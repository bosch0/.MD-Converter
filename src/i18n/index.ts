import { enMessages } from './locales/en'
import { esMessages } from './locales/es'
import type { Locale, TranslateFn, TranslationKey, TranslationParams } from './types'

export const AVAILABLE_LOCALES: Locale[] = ['es', 'en']
const FALLBACK_LOCALE: Locale = 'es'

const messages = {
  es: esMessages,
  en: enMessages,
} as const

export const resolveLocaleFromLanguage = (language?: string): Locale => {
  if (!language) return FALLBACK_LOCALE

  const normalizedLanguage = language.toLowerCase()
  const baseLanguage = normalizedLanguage.split('-')[0]
  return AVAILABLE_LOCALES.includes(baseLanguage as Locale)
    ? (baseLanguage as Locale)
    : FALLBACK_LOCALE
}

export const DEFAULT_LOCALE: Locale = resolveLocaleFromLanguage(
  typeof navigator !== 'undefined' ? navigator.language : undefined,
)

const interpolationRegex = /\{([a-zA-Z0-9_]+)\}/g

const formatMessage = (template: string, params?: TranslationParams) => {
  if (!params) return template

  return template.replace(interpolationRegex, (_fullMatch, token: string) => {
    const value = params[token]
    return value === undefined ? '' : String(value)
  })
}

export const translate = (
  locale: Locale,
  key: TranslationKey,
  params?: TranslationParams,
): string => formatMessage(messages[locale][key], params)

export const createTranslator = (locale: Locale): TranslateFn => (key, params) =>
  translate(locale, key, params)

export type { Locale, TranslateFn, TranslationKey, TranslationParams }
