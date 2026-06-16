import { hydrate, mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const target = document.getElementById('app')!

// The production build prerenders this container's markup (see scripts/prerender.mjs), so it
// needs to be hydrated rather than mounted fresh. In `pnpm dev`/non-prerendered builds the
// container is empty and a normal mount is used instead.
const app = target.firstChild ? hydrate(App, { target }) : mount(App, { target })

export default app
