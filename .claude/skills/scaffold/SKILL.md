---
name: scaffold
description: Разложить один FSD-слайс (entity, feature, widget или page) по канону шаблона за один проход — сегменты ui/model/api/lib, public API index.ts, заготовки тестов, route для page и mock-handler для слайса с API. Источник — stable-запись FSD-карты в соседнем <org>/strategy (docs/projects/<slug>/fsd/<surface>/); src/-пути скилл выводит из kind и slug. Используй, когда нужно завести в коде слайс, страницу, виджет или сущность, и когда /init-service или /de-template доходят до реализации своих слайсов. Сам слайс проектируется в strategy (/fsd-deep-dive), не здесь.
---

# Skill: scaffold

Раскладывает один слайс по FSD-канону за один проход. Бизнес здесь не
проектируется — карта слайсов живёт в `<org>/strategy` (его `/fsd-deep-dive`).
Скилл создаёт файлы по stable-записи из
`<strategy-path>/docs/projects/<slug>/fsd/<surface>/<kind>.md` (резолв — поля
`project-slug` / `strategy-path` / `surface` в `docs/stack/service.md`, дефолт
`../strategy`); `src/`-путей в карте нет — их скилл выводит сам из kind + slug.

## Вход

- Запись слайса есть в FSD-карте strategy (`fsd/<surface>/<kind>.md`) со
  `status: stable`. Нет соседа или записи — next-step юзеру «спроектируй слайс в
  `<org>/strategy` (`/fsd-deep-dive`)»: слайс без записи в карте здесь не заводится.
- Slug — kebab-case (`create-todo`, `payment-status`) и не конфликтует с
  существующими слайсами.

Тип и slug берутся из аргумента (`/scaffold <kind> <slug>`) и записи карты; что
создавать — из kind и колонок записи (`entities`: `source`, `поля`; `features`:
`entities`, `результат`; `pages`: `path`, `guard`, композиция). Юзера спрашивай
одним раундом и только о том, чего запись не определяет: опциональные сегменты
(`lib/`, `ui/` у entity) и нужен ли mock-handler.

## Раскладка

### entity

```
src/entities/<slug>/
├─ model/schema.ts         # Zod-схема + тип (контракт API)
├─ api/queries.ts          # queryOptions + мутации
├─ ui/<slug>-card.tsx      # presenter (опционально)
├─ index.ts                # public API
└─ model/schema.test.ts    # тест схемы
```

### feature

```
src/features/<slug>/
├─ ui/<slug>-form.tsx      # основной компонент
├─ model/schema.ts         # Zod-схема ввода (если форма)
├─ api/<slug>.ts           # mutation (если есть)
├─ index.ts
└─ ui/<slug>-form.test.tsx
```

### widget

```
src/widgets/<slug>/
├─ ui/<slug>.tsx
├─ index.ts
└─ ui/<slug>.test.tsx
```

### page

```
src/pages/<slug>.tsx       # TanStack Router file-based route
```

`path` и `guard` — из записи карты; guard — в `beforeLoad` с `redirect`, не в
рендере. Route-tree (`src/app/router/routeTree.gen.ts`) регенерирует vite-плагин
на `pnpm dev`, без dev-сервера — `pnpm gen`. Тест page-уровня — e2e в `e2e/`.

## Public API

`index.ts` — explicit re-exports:

```ts
export { LoginForm } from './ui/login-form'
export { useLoginMutation } from './api/login'
export { LoginSchema, type LoginInput } from './model/schema'
```

Не `export *`: он прячет, что слайс отдаёт наружу, и мешает tree-shake.

## Mock handler

Для entity/feature с `api/` — `src/shared/api/mock/handlers/<slug>.ts`:

```ts
import { HttpResponse, http } from 'msw'
import type { DB } from '../db'

export function <slug>Handlers(db: DB) {
  return [
    http.get('/api/v1/<resource>', () => HttpResponse.json([])),
    // …
  ]
}
```

Подключить в `buildHandlers` (`src/shared/api/mock/handlers/index.ts`); новая
сущность — ещё и модель в `src/shared/api/mock/db.ts` и её снапшот в `persist.ts`
(иначе mock-данные не переживут перезагрузку).

## После раскладки

- `pnpm steiger` — зелёный (канон слайса, public API на месте)
- `pnpm typecheck` — нет битых импортов
- `pnpm lint` — формат и правила в порядке

Линтеры держат канон: сегменты по назначению (`components/`, `hooks/`, `utils/`,
`types/` — группировка по типу, Steiger `no-reserved-folder-names`), импорт из
соседнего слайса того же слоя запрещён, слайс «на будущее» не заводится (Steiger
`insignificant-slice`).
