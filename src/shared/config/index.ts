import { z } from 'zod'

const RuntimeConfigSchema = z.object({
  API_BASE_URL: z.string().default('/api'),
  API_MODE: z.enum(['mock', 'real']).default('mock'),
  MOCK_SCENARIO: z.enum(['empty', 'populated', 'authenticated', 'error']).default('populated'),
  MOCK_DEVTOOLS: z.boolean().default(false),
  SENTRY_DSN: z.string().default(''),
  SENTRY_ENVIRONMENT: z.string().default('development'),
  RELEASE: z.string().default('dev'),
})

export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>

declare global {
  interface Window {
    __APP_CONFIG__?: unknown
  }
}

function readConfig(): RuntimeConfig {
  const fromWindow = (typeof window !== 'undefined' && window.__APP_CONFIG__) ?? {}
  const fromEnv = {
    API_MODE: import.meta.env.VITE_API_MODE,
    MOCK_SCENARIO: import.meta.env.VITE_MOCK_SCENARIO,
    MOCK_DEVTOOLS: import.meta.env.VITE_MOCK_DEVTOOLS === '1',
  }
  return RuntimeConfigSchema.parse({ ...fromEnv, ...(fromWindow as object) })
}

export const runtimeConfig = readConfig()
