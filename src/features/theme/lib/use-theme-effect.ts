import { useEffect } from 'react'
import { i18n } from '@/shared/i18n'
import { useThemeStore } from '../model/store'

// Применение data-scheme к html и активация Lingui locale.
export function useThemeEffect(): void {
  const scheme = useThemeStore((s) => s.scheme)
  const locale = useThemeStore((s) => s.locale)

  useEffect(() => {
    document.documentElement.dataset.scheme = scheme
  }, [scheme])

  useEffect(() => {
    void (async () => {
      if (locale === 'ru') {
        const { messages } = await import('@/shared/i18n/locales/ru')
        i18n.load('ru', messages)
      } else {
        const { messages } = await import('@/shared/i18n/locales/en')
        i18n.load('en', messages)
      }
      i18n.activate(locale)
    })()
  }, [locale])
}
