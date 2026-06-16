export type ConversionStatus = 'idle' | 'ready' | 'converting' | 'success' | 'error'

export type PreviewMode = 'plain' | 'rendered'

export type UploadItem = {
  id: string
  file: File
}

export type ConvertedContent = {
  markdown: string
  pages: number
}

export type ResultStatus = 'success' | 'error'

export type ResultItem = {
  id: string
  file: File
  markdown: string
  pages: number
  downloadName: string
  status: ResultStatus
  errorMessage: string | null
}

export type FloatingTip = {
  id: string
  text: string
  left: number
  top: number
}

export type FileKind = 'pdf' | 'docx' | 'document'
