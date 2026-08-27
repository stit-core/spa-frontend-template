---
id: fsd.shared-api
kind: shared-api
name: shared-api
status: draft
---

# shared-api

## HTTP-клиент

Собственный тонкий враппер поверх native `fetch` (`shared/api/client.ts`).
`credentials: 'include'` — cookie-auth. CSRF — `csrf_token` cookie →
`X-CSRF-Token` header на mutating requests. Ошибки — `ApiError` со статусом.

## Контракт API

Кодогена нет: контракт — рукописные zod-схемы в `entities/<name>/model/schema.ts`.
Клиент возвращает `unknown`; ответ парсится схемой на вызывающей стороне
(`TodoSchema.parse(await apiClient.get('/v1/todos'))`).

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

## Generates

- `src/shared/api/client.ts` — общий HTTP-клиент
- `src/shared/api/mock/db.ts` — `@mswjs/data` factory из доменных сущностей
- `src/shared/api/mock/handlers/*.ts` — REST-handlers
- `src/shared/api/mock/scenarios/index.ts` — сценарии загрузки

## Открытые вопросы

- _что_
