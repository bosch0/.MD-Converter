import type { esMessages } from './locales/es'

type EsMessages = typeof esMessages

export type TranslationKey = keyof EsMessages
export type MessageDictionary = { [K in TranslationKey]: string }
export type Locale = 'es' | 'en'
export type TranslationParams = Record<string, string | number>
export type TranslateFn = (key: TranslationKey, params?: TranslationParams) => string
