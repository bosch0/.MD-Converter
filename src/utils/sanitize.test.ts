import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
  it('removes unsafe scripts and inline handlers', () => {
    const dirty = '<h1>Ok</h1><img src=x onerror="alert(1)" /><script>alert(2)</script>'
    const clean = sanitizeHtml(dirty)

    expect(clean).toContain('<h1>Ok</h1>')
    expect(clean).toContain('<img src="x">')
    expect(clean).not.toContain('onerror')
    expect(clean).not.toContain('<script>')
  })
})
