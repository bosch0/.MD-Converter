// SSR entry used only by `scripts/prerender.mjs` at build time (see package.json `build` script).
// It renders `App` once, server-side, with no `window`/`navigator`/`localStorage`, so the locale
// store resolves to its fallback ('es') — see `stores/locale.ts`. The resulting markup is spliced
// into `dist/index.html` so crawlers (and the first paint) get real content instead of an empty
// `<div id="app">`. The client then hydrates onto this markup (see `main.ts`).
import { render } from 'svelte/server'
import App from './App.svelte'

export const renderApp = () => render(App)
