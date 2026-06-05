# spa-frontend-template

Шаблон React SPA: TypeScript 6 / Vite 8 / React 19.2 + Compiler 1.0 /
TanStack Router + Query + Form / Zustand / Zod 4 / Tailwind v4 + `@sftbmb/ui` /
MSW для mock-режима / Sentry condit. + web-vitals / Biome + ESLint + Steiger /
Vitest 4 + Playwright / pnpm 10 / lefthook.

## Быстрый старт

```bash
# Node 24 + pnpm 10
nvm use && corepack enable && corepack prepare pnpm@10 --activate

pnpm install
pnpm prepare         # lefthook git-hooks
pnpm gen:msw         # init Service Worker для MSW в public/

pnpm dev             # mock-режим по умолчанию → http://localhost:5173
```

В углу появится мини-панель `mock:` — переключатель сценариев
(`empty | populated | authenticated | error`) и кнопка `reset`.

## Воркфлоу для нового проекта

```
0. Use this template на Gitea → клон → pnpm install
1. /smartdev                  → сводка состояния
2. /init-service              → оркестратор онбординга:
   ├─ /fsd-deep-dive          → проектирование FSD-карты (docs/fsd/*)
   ├─ /stack-deep-dive        → проектирование стека (docs/stack/*)
   ├─ /de-template            → разворот фундамента
   └─ /scaffold (по слайсам)  → реализация
3. pnpm dev → SPA крутится в mock-режиме
4. pnpm gen:api → клиент из /openapi.json (когда бэк появится)
5. pnpm check → git push → CI собирает Docker image
```

Полный путь — `docs/getting-started.md`.

## Команды

```bash
pnpm dev              # Vite dev (mock-режим)
pnpm build            # typecheck + Vite prod build
pnpm test             # Vitest
pnpm test:e2e         # Playwright
pnpm lint             # Biome + ESLint
pnpm steiger          # FSD-линтер
pnpm gen              # route-tree + OpenAPI codegen
pnpm check            # gate: typecheck + lint + format + test + steiger + size + build
```

## Структура

- `src/app/` — bootstrap, providers, router, root-стили
- `src/pages/` — file-based TanStack Router routes
- `src/widgets/` — переиспользуемые блоки
- `src/features/` — пользовательские сценарии
- `src/entities/` — доменные сущности
- `src/shared/` — инфра: api, config, i18n, lib, ui, ui-lib
- `docs/fsd/` — проектная карта слоёв (`/fsd-deep-dive`)
- `docs/stack/` — проектная карта стека (`/stack-deep-dive`)
- `docs/reference/` — стационарные доки (architecture, ecosystem, observability, deployment)
- `.claude/skills/` — процедуры (init-service, fsd-deep-dive, stack-deep-dive, de-template, scaffold, plan, smartdev)
- `.claude/rules/` — path-scoped правила (FSD, forward-only, comments, env, tests, ui-lib-gaps)

## Документация

- [`docs/README.md`](./docs/README.md) — карта документации
- [`docs/getting-started.md`](./docs/getting-started.md) — старт для потребителя шаблона
- [`docs/reference/architecture.md`](./docs/reference/architecture.md) — FSD, слои, public API
- [`docs/reference/deployment.md`](./docs/reference/deployment.md) — Docker + nginx + runtime config

## Дизайн-система

`@sftbmb/ui` — внешний npm-пакет из `git.sftbmb.ru/sftbmb-core/ui-lib`.
Импортируется напрямую из любого слоя. Если чего-то не хватает — gap-шим в
`src/shared/ui-lib/` + запись в [`docs/ui-lib-gaps.md`](./docs/ui-lib-gaps.md).

## Лицензия

Apache-2.0 — см. [LICENSE](./LICENSE).
