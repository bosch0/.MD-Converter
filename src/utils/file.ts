import { SUPPORTED_EXTENSION_SET, SUPPORTED_MIME_TYPES } from '../config/files'
import type { TranslateFn, TranslationKey } from '../i18n'
import type { FileKind } from '../types/conversion'

const fileKindKeyMap: Record<FileKind, TranslationKey> = {
  pdf: 'fileKind.pdf',
  docx: 'fileKind.docx',
  document: 'fileKind.document',
}

export const createUploadItemId = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}-${file.type}`

export const getExtension = (name: string): string => name.split('.').pop()?.toLowerCase() ?? ''

export const getFileBaseName = (name: string): string => name.replace(/\.[^.]+$/, '')

export const getFileKind = (file: File): FileKind => {
  const ext = getExtension(file.name)
  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx') return 'docx'
  return 'document'
}

export const getFileKindLabel = (file: File, t: TranslateFn): string =>
  t(fileKindKeyMap[getFileKind(file)])

export const isSupportedFile = (file: File): boolean => {
  const ext = getExtension(file.name)
  return SUPPORTED_EXTENSION_SET.has(ext) || SUPPORTED_MIME_TYPES.has(file.type)
}

export const formatBytes = (value: number): string => {
  if (value === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(value) / Math.log(k))
  return `${(value / Math.pow(k, index)).toFixed(index === 0 ? 0 : 1)} ${sizes[index]}`
}
