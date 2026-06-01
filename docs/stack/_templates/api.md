---
id: stack.api
kind: api
name: api
status: draft
---

# api

## HTTP-клиент

`openapi-fetch` поверх native `fetch`. CSRF middleware на mutating requests.
Cookie-auth (`credentials: 'include'`).

## OpenAPI codegen

- Source: `<backend>/openapi.json` (через env `OPENAPI_URL` или путь)
- Tool: `@hey-api/openapi-ts`
- Plugins: TanStack Query hooks, Zod schemas, MSW handlers
- Output: `src/shared/api/__generated__/`
- Команда: `pnpm gen:api`

## Auth scheme

| механизм | детали |
|---|---|
| session storage | httpOnly cookie `app_session` |
| token type | _opaque / JWT_ |
| CSRF | double-submit cookie `csrf_token` + header `X-CSRF-Token` |
| refresh | _автообновление через interceptor / explicit_ |

## Mock-стратегия

- MSW 2.x + `@mswjs/data` + `@faker-js/faker`
- Сценарии: `empty | populated | authenticated | error`
- Персист: `localStorage` под ключом `app.mock.db.v1`
- Dev-UI переключатель в углу

## Generates

- `src/shared/api/client.ts`
- `src/shared/api/mock/*`
- `scripts/gen-api.ts` — обёртка над Hey API CLI
- `package.json#scripts#gen:api`

## Открытые вопросы

- _что_
