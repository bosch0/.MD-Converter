export const SUPPORTED_EXTENSIONS = ['pdf', 'docx'] as const

export const SUPPORTED_EXTENSION_SET = new Set<string>(SUPPORTED_EXTENSIONS)

export const SUPPORTED_MIME_TYPES = new Set<string>([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export const FILE_INPUT_ACCEPT = '.pdf,.docx'
