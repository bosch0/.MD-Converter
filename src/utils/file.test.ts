import { describe, expect, it } from 'vitest'
import { formatBytes, getExtension, isSupportedFile } from './file'

describe('file utils', () => {
  it('normalizes file extension', () => {
    expect(getExtension('doc.TEST.PDF')).toBe('pdf')
    expect(getExtension('README')).toBe('')
  })

  it('accepts supported files by extension or mime', () => {
    const supportedByExtension = new File(['x'], 'report.PDF', { type: '' })
    const supportedByMime = new File(['x'], 'report.unknown', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    const unsupported = new File(['x'], 'notes.txt', { type: 'text/plain' })

    expect(isSupportedFile(supportedByExtension)).toBe(true)
    expect(isSupportedFile(supportedByMime)).toBe(true)
    expect(isSupportedFile(unsupported)).toBe(false)
  })

  it('formats file sizes in readable units', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB')
  })
})
