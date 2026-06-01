---
id: fsd.shared-api
kind: shared-api
name: shared-api
status: draft
---

# shared-api

## HTTP-клиент

`openapi-fetch` поверх native `fetch`. `credentials: 'include'` — cookie-auth.
CSRF — через middleware (читает `csrf_token` cookie → `X-CSRF-Token` header
на mutating requests).

## OpenAPI codegen

- Источник: `<backend>/openapi.json` (когда бэк появится)
- Команда: `pnpm gen:api` → `@hey-api/openapi-ts`
- Output: `src/shared/api/__generated__/` (типы + клиент + TanStack Query hooks + Zod-схемы + MSW handlers)

## Mock-стратегия

Mock-режим переключается флагом `VITE_API_MODE=mock|real`. В режиме `mock`
MSW Service Worker перехватывает `/api/*` на сетевом уровне; приложение
не знает.

### Сценарии

| scenario | состояние |
|---|---|
| `empty` | _все ручки пустые_ |
| `populated` | _список сущностей с реалистичными данными_ |
| `authenticated` | _populated + session уже создана_ |
| `error` | _все ручки → 500_ |

### Сущности мока

| entity | поля | приходит из |
|---|---|---|
| _name_ | _список_ | _domain или data-item_ |

## Telemetry-proxy

`shared/api/telemetry/` — заглушка. Активация — решение `/stack-deep-dive`.

## Generates

- `src/shared/api/client.ts` — общий HTTP-клиент
- `src/shared/api/mock/db.ts` — `@mswjs/data` factory из доменных сущностей
- `src/shared/api/mock/handlers/*.ts` — REST-handlers
- `src/shared/api/mock/scenarios/index.ts` — сценарии загрузки
- `src/shared/api/__generated__/` — после `pnpm gen:api`

## Открытые вопросы

- _что_
