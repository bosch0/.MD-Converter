import { derived, writable } from 'svelte/store'
import { AVAILABLE_LOCALES, DEFAULT_LOCALE, createTranslator } from '../i18n'
import type { Locale } from '../i18n'

const LOCALE_STORAGE_KEY = 'md-converter.locale'

const getStoredLocale = (): Locale | null => {
  if (typeof window === 'undefined') return null
  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (!savedLocale) return null
  return AVAILABLE_LOCALES.includes(savedLocale as Locale) ? (savedLocale as Locale) : null
}

// `?lang=` takes priority so the hreflang-annotated alternate URLs (see App.svelte) actually
// resolve to the matching locale instead of just being a metadata-only promise.
const getQueryLocale = (): Locale | null => {
  if (typeof window === 'undefined') return null
  const queryLocale = new URLSearchParams(window.location.search).get('lang')
  return queryLocale && AVAILABLE_LOCALES.includes(queryLocale as Locale) ? (queryLocale as Locale) : null
}

export const locale = writable<Locale>(getQueryLocale() ?? getStoredLocale() ?? DEFAULT_LOCALE)

export const t = derived(locale, ($locale) => createTranslator($locale))

type SetLocaleOptions = {
  persist?: boolean
}

export const setLocale = (nextLocale: Locale, options: SetLocaleOptions = {}) => {
  if (!AVAILABLE_LOCALES.includes(nextLocale)) return
  locale.set(nextLocale)
  if (options.persist && typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
  }
}
