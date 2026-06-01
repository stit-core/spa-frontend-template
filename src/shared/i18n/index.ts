import { i18n } from '@lingui/core'
import { messages as ru } from './locales/ru'

const SUPPORTED_LOCALES = ['ru', 'en'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]

const DEFAULT_LOCALE: Locale = 'ru'

export async function initI18n(locale: Locale = DEFAULT_LOCALE): Promise<void> {
  if (locale === 'ru') {
    i18n.load('ru', ru)
  } else {
    const { messages } = await import('./locales/en')
    i18n.load('en', messages)
  }
  i18n.activate(locale)
}

export { i18n, SUPPORTED_LOCALES, DEFAULT_LOCALE }
export type { Locale }
