import createClient, { type Middleware } from 'openapi-fetch'
import { runtimeConfig } from '@/shared/config'

// Общий HTTP-клиент. Cookie-auth: credentials: 'include' гонит httpOnly-cookie
// сессии в каждом запросе на тот же origin (/api/*).
// Типы paths появляются после `pnpm gen:api` (Hey API openapi-ts). До этого —
// untyped client, всё работает в рантайме.

type Paths = Record<string, never>

const csrfMiddleware: Middleware = {
  async onRequest({ request }) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const token = readCookie('csrf_token')
      if (token) request.headers.set('X-CSRF-Token', token)
    }
    return request
  },
}

export const apiClient = createClient<Paths>({
  baseUrl: runtimeConfig.API_BASE_URL,
  credentials: 'include',
})

apiClient.use(csrfMiddleware)

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match?.[1]
}
