import { getFileBaseName, getExtension, getFileKindLabel, formatBytes } from '../utils/file'
import type { TranslateFn } from '../i18n'
import type { ConvertedContent, ResultItem, UploadItem } from '../types/conversion'

type ConversionProgressCallback = (pageIndex: number, pageTotal: number) => void

const collapseWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim()

const escapeTableCell = (value: string) => collapseWhitespace(value).replace(/\|/g, '\\|')

const renderMarkdownTable = (node: HTMLElement) => {
  const rows = Array.from(node.querySelectorAll('tr')).map((row) =>
    Array.from(row.querySelectorAll('th, td')).map((cell) => escapeTableCell(cell.textContent ?? '')),
  )

  if (rows.length === 0) return ''

  const columnCount = Math.max(...rows.map((row) => row.length))
  const normalizeRow = (row: string[]) => {
    const cells = [...row]
    while (cells.length < columnCount) cells.push('')
    return cells
  }

  const header = normalizeRow(rows[0])
  const separator = header.map(() => '---')
  const body = rows.slice(1).map(normalizeRow)
  const markdownRows = [header, separator, ...body]
    .map((row) => `| ${row.join(' | ')} |`)
    .join('\n')

  return `\n\n${markdownRows}\n\n`
}

export const normalizeExtractedText = (text: string) => {
  const unified = text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/-\n(?=\w)/g, '')
    .replace(/\n{3,}/g, '\n\n')

  const lines = unified.split('\n')
  const output: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim().replace(/\s{2,}/g, ' ')
    if (!line) {
      if (output[output.length - 1] !== '') {
        output.push('')
      }
      continue
    }

    const bulletMatch = line.match(/^[•◦·*\-–—]\s+(.+)$/)
    if (bulletMatch) {
      output.push(`- ${bulletMatch[1]}`)
      continue
    }

    const numberedMatch = line.match(/^\d+[.)]\s+(.+)$/)
    if (numberedMatch) {
      output.push(line)
      continue
    }

    const looksLikeHeading =
      line.length <= 70 &&
      (line === line.toUpperCase() ||
        /^[A-ZÁÉÍÓÚÜÑ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ,:;().\-/]+$/.test(line)) &&
      !/[.!?]$/.test(line)

    if (looksLikeHeading) {
      output.push(`## ${line}`)
      continue
    }

    output.push(line)
  }

  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

const createTurndownService = async () => {
  const { default: TurndownService } = await import('turndown')
  const service = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
  })

  service.addRule('table', {
    filter: 'table',
    replacement: (_content: string, node: Node) => renderMarkdownTable(node as HTMLElement),
  })

  return service
}

let pdfWorkerReady = false

const configurePdfWorker = async () => {
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs')
  if (!pdfWorkerReady) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url,
    ).toString()
    pdfWorkerReady = true
  }
  return pdfjs
}

const convertPdfFile = async (
  file: File,
  onProgress: ConversionProgressCallback,
  t: TranslateFn,
): Promise<ConvertedContent> => {
  const pdfjs = await configurePdfWorker()
  const data = await file.arrayBuffer()
  const loadingTask = pdfjs.getDocument({ data })
  const pdf = await loadingTask.promise
  const pageTexts: string[] = []

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex)
    const content = await page.getTextContent()
    const pageLines: string[] = []
    let currentLine = ''

    for (const item of content.items as Array<{ str?: string; hasEOL?: boolean }>) {
      const str = collapseWhitespace(item.str ?? '')
      if (!str) continue
      currentLine += currentLine ? ` ${str}` : str
      if (item.hasEOL) {
        pageLines.push(currentLine)
        currentLine = ''
      }
    }

    if (currentLine) {
      pageLines.push(currentLine)
    }

    const pageText = normalizeExtractedText(pageLines.join('\n'))
    if (pageText) {
      pageTexts.push(`## ${t('conversion.pdf.pageHeading', { pageIndex })}\n\n${pageText}`)
    }

    onProgress(pageIndex, pdf.numPages)
  }

  return {
    markdown: pageTexts.join('\n\n'),
    pages: pdf.numPages,
  }
}

const convertDocxFile = async (file: File): Promise<ConvertedContent> => {
  const mammoth = await import('mammoth')
  const turndown = await createTurndownService()
  const data = await file.arrayBuffer()
  const htmlResult = await mammoth.convertToHtml({ arrayBuffer: data }, { includeDefaultStyleMap: true })
  const markdown = turndown.turndown(htmlResult.value)

  return {
    markdown: normalizeExtractedText(markdown),
    pages: 1,
  }
}

export const convertFile = async (
  item: UploadItem,
  onProgress: ConversionProgressCallback,
  t: TranslateFn,
): Promise<ConvertedContent> => {
  const ext = getExtension(item.file.name)
  if (ext === 'pdf') return convertPdfFile(item.file, onProgress, t)
  if (ext === 'docx') {
    onProgress(1, 1)
    return convertDocxFile(item.file)
  }

  throw new Error(t('conversion.error.unsupportedFormat', { fileName: item.file.name }))
}

export const createResultItem = (id: string, file: File, conversion: ConvertedContent, t: TranslateFn): ResultItem => {
  const baseName = getFileBaseName(file.name)
  const header = `# ${baseName}`
  const meta = t('conversion.markdown.origin', {
    kind: getFileKindLabel(file, t),
    size: formatBytes(file.size),
  })
  const content = conversion.markdown.trim() || t('conversion.markdown.emptyContent')
  const markdown = [header, meta, '', content].join('\n')

  return {
    id,
    file,
    markdown,
    pages: conversion.pages,
    downloadName: `${baseName}.md`,
    status: 'success',
    errorMessage: null,
  }
}

const resolveConversionErrorMessage = (error: unknown, t: TranslateFn): string => {
  if (error instanceof Error && error.message.trim()) return error.message
  return t('conversion.error.generic')
}

export const createErrorResultItem = (id: string, file: File, error: unknown, t: TranslateFn): ResultItem => ({
  id,
  file,
  markdown: '',
  pages: 0,
  downloadName: `${getFileBaseName(file.name)}.md`,
  status: 'error',
  errorMessage: resolveConversionErrorMessage(error, t),
})
