import { describe, expect, it } from 'vitest'
import type { TranslateFn } from '../i18n'
import { createErrorResultItem, createResultItem, normalizeExtractedText } from './conversion'

const t: TranslateFn = (key, params) => {
  if (key === 'conversion.markdown.origin') {
    return `_Source: ${params?.kind} · ${params?.size}_`
  }

  if (key === 'conversion.markdown.emptyContent') {
    return '_No useful text was detected in this file._'
  }

  if (key === 'conversion.error.generic') {
    return 'Unknown error during conversion.'
  }

  if (key === 'fileKind.pdf') return 'PDF'
  if (key === 'fileKind.docx') return 'DOCX'
  if (key === 'fileKind.document') return 'Document'

  return String(key)
}

describe('conversion helpers', () => {
  it('normalizes extracted text blocks and bullets', () => {
    const input = 'TITLE\nline   one\n• bullet item'
    expect(normalizeExtractedText(input)).toBe('## TITLE\nline one\n- bullet item')
  })

  it('creates successful conversion result items', () => {
    const file = new File(['content'], 'report.pdf', { type: 'application/pdf' })
    const result = createResultItem(
      'id-1',
      file,
      {
        markdown: 'Hello markdown',
        pages: 2,
      },
      t,
    )

    expect(result.status).toBe('success')
    expect(result.pages).toBe(2)
    expect(result.downloadName).toBe('report.md')
    expect(result.markdown).toContain('# report')
    expect(result.markdown).toContain('Hello markdown')
  })

  it('creates failed conversion result items with fallback message', () => {
    const file = new File(['content'], 'broken.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })

    const resultWithError = createErrorResultItem('id-2', file, new Error('Cannot read file'), t)
    const resultWithUnknown = createErrorResultItem('id-3', file, { reason: 'unknown' }, t)

    expect(resultWithError.status).toBe('error')
    expect(resultWithError.errorMessage).toBe('Cannot read file')
    expect(resultWithError.pages).toBe(0)
    expect(resultWithUnknown.errorMessage).toBe('Unknown error during conversion.')
  })
})
