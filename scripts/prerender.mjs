// Post-build step (see package.json `build` script): renders App.svelte server-side and splices
// the result into dist/index.html, so the shipped HTML has real content/meta instead of an empty
// `<div id="app">`. Runs after `vite build` (client) and `vite build --ssr ... --outDir dist-ssr`.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(new URL('.', import.meta.url)))
const distDir = path.join(rootDir, 'dist')
const ssrDir = path.join(rootDir, 'dist-ssr')
const ssrEntry = path.join(ssrDir, 'entry-server.js')

if (!existsSync(ssrEntry)) {
  throw new Error(`Expected SSR bundle at ${ssrEntry} — did the "vite build --ssr" step run first?`)
}

const { renderApp } = await import(`${pathToFileUrl(ssrEntry)}`)
const { head, body } = renderApp()

let html = await readFile(path.join(distDir, 'index.html'), 'utf-8')

// Drop the static <head> fallback (description/OG/twitter/canonical) now that we have the real,
// fully-rendered <svelte:head> output — avoids shipping duplicate/conflicting meta tags.
html = html.replace(/<!--\s*seo-fallback:start\s*-->[\s\S]*?<!--\s*seo-fallback:end\s*-->\n?/, '')

if (!html.includes('</head>')) {
  throw new Error('dist/index.html has no </head> tag — cannot inject prerendered head content.')
}
html = html.replace('</head>', `${head}\n  </head>`)

if (!html.includes('<div id="app"></div>')) {
  throw new Error('dist/index.html has no empty <div id="app"></div> — cannot inject prerendered markup.')
}
html = html.replace('<div id="app"></div>', `<div id="app">${body}</div>`)

await writeFile(path.join(distDir, 'index.html'), html, 'utf-8')

// Intermediate SSR bundle is not part of the deployable site.
await rm(ssrDir, { recursive: true, force: true })

console.log('Prerendered dist/index.html')

function pathToFileUrl(p) {
  return new URL(`file:///${p.replace(/\\/g, '/')}`).href
}
