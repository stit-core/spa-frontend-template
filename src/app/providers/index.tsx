import type { ReactNode } from 'react'
import { QueryProvider } from './query'
import { I18nProvider } from './i18n'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <I18nProvider>
      <QueryProvider>{children}</QueryProvider>
    </I18nProvider>
  )
}
