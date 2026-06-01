# spa-frontend-template — BLUEPRINT (предреализация)

Сводный документ-замысел перед скаффолдингом. Финальная картина по итогам ресерча и
интерактивного обсуждения. Не часть итогового шаблона — после апрува удаляется или
переезжает в `docs/`.

---

## 1. Назначение и место в экосистеме

Шаблон React SPA на TypeScript для stit-проектов. Форкается через Gitea «Use this template».
Рядом с фронтом всегда лежит `../docs/` (репозиторий проектной аналитики на базе
`project-docs-template` — vision/persona/capability/interface/domains/screens), а если нужен
свой бэк — рядом `../backend` (на базе `go-backend-template`). Дизайн-система — npm-пакет
`@stit-design/ui` из приватного registry `git.stit.tech`.

Карта для типового проекта:

```
~/git/<org>/<project>/
  ├─ docs/              # project-docs-template — продукт/UX/domains/screens
  ├─ backend/           # go-backend-template (опционально)
  ├─ frontend/          # spa-frontend-template — этот репо
  └─ infra/             # project-infra-template-compose
```

Шаблон проектирует фронт **по** артефактам `../docs/` (домены, экраны, сущности, ситуации,
зоны) и собственным артефактам `docs/{fsd,stack}/`.

---

## 2. Стэк (зафиксирован на май 2026)

### Платформа
| Зона | Выбор | Rationale |
|---|---|---|
| Runtime | Node 24 LTS, ESM-only | Active LTS до апреля 2028; stable `require(esm)` |
| Package manager | **pnpm 10** | Lifecycle-скрипты выключены по умолчанию (supply-chain), стабильный lockfile |
| TypeScript | **6.0** strict (stable с 23.03.2026, последний JS-based major перед 7.0 на Go) | `verbatimModuleSyntax`, `moduleResolution: bundler`, `noUncheckedIndexedAccess`, `isolatedModules`, `noImplicitOverride` |
| Bundler / dev | **Vite 8 (Rolldown)** | Production-stable, ~7-10× быстрее на prod-сборке |

### Каркас React
| Зона | Выбор |
|---|---|
| React | **19.2.x** + View Transitions |
| Compiler | **React Compiler 1.0** — полный проход (`compilationMode: 'all'`) + `eslint-plugin-react-compiler` |
| Router | **TanStack Router** — **file-based** через Vite-plugin (`@tanstack/router-vite-plugin`), типобезопасные search params, `routeTree.gen.ts` коммитится |
| Server state | **TanStack Query v5** |
| Client state | **Zustand v5** базовый. Jotai — опционально точечно, добавляется fsd-deep-dive |
| HTTP клиент | `openapi-fetch` (поверх native fetch) |
| Devtools | TanStack Devtools shell (плагины Router/Query) + react-scan в dev + React DevTools (extension) |

### API: real + mock dual mode

**Главный инвариант:** приложение всегда обращается на `/api/...`. Что отвечает — реальный бэк
(через Vite proxy в dev / nginx в prod) или MSW Service Worker — определяется
переключателем `VITE_API_MODE` в `.env.local` (по умолчанию `mock`).

| Слой | Технология |
|---|---|
| OpenAPI codegen | **Hey API openapi-ts** + плагины: TanStack Query, Zod schemas, MSW handlers. Команда `pnpm gen:api` после появления `/openapi.json` у бэка |
| Mock-движок | **MSW 2.x** + **@mswjs/data** + **@faker-js/faker 10** |
| CORS dev | **Vite `server.proxy`**: `/api → VITE_API_TARGET` (real-режим); в mock-режиме прокси не активен — MSW перехватывает на сетевом уровне |
| Mock-слой расположение | Единый `src/shared/api/mock/` |

**Toggle архитектура:**
- `.env.local` → `VITE_API_MODE=mock|real`, `VITE_API_TARGET=https://api.dev.example.com`
- `src/app/init.ts`: `if (mode === 'mock') await import('@/shared/api/mock').then(m => m.start())`
- Динамический импорт + tree-shake → mock-код **не попадает в прод-бандл**, даже если зависимости в `dependencies`
- Dev-UI: панелька в углу для смены сценария runtime (empty / populated / error-states / authenticated)
- Персистентность mock-стейта в `localStorage` под версионированным ключом → при reload данные сохраняются

**Mock из доменных артефактов** (фишка):
- `../docs/domains/` содержит сущности с инвариантами и use-case'ами
- `fsd-deep-dive` маппит каждую доменную сущность на `@mswjs/data` модель
- Хэндлеры на ресурсные пути `/api/{entity}` с CRUD + поиск/фильтр
- Точных путей API не знаем → используем конвенцию (REST-style + версионированный префикс `/api/v1`)
- Когда появится `/openapi.json` — пути переподтянутся через codegen, хэндлеры регенерируются

### Auth (cookie-only + mock)
- httpOnly cookie на стороне бэка (без видимых токенов на фронте)
- CSRF-токен в double-submit pattern или header `X-CSRF-Token`
- `src/shared/api/auth/` — interceptor для 401 (redirect на `/login`) и автоматическое продление сессии
- В mock-режиме: `features/auth` хранит «фейковый» auth-state в `@mswjs/data` + cookie через `Set-Cookie` от MSW; полностью замокабельный сценарий (any creds → login → session → logout)
- `app/router` route guard читает `useAuth()` хук → редирект на `/login` для приватных страниц

### Формы / валидация / i18n
| Зона | Выбор |
|---|---|
| Forms | **TanStack Form** + Standard Schema |
| Schema | **Zod 4** (опционально `zod/mini` для критичных бандлов) |
| i18n | **Lingui v5** — ICU, type-safe macros, ~3KB рантайма. Дефолт `ru`, опциональный `en`, активируется флагом проекта |

### Стили
- **Tailwind v4** (Oxide engine, `@theme`)
- Темизация — через `@import "@stit-design/ui/theme.css"` + `@import "tailwindcss"` в `src/app/styles/index.css`
- Все токены DS автоматически становятся Tailwind-утилитами и CSS-переменными
- **Без CSS-in-JS, без vanilla-extract, без Panda** — Tailwind v4 покрывает
- **`shared/ui-lib/` дисциплина**: если в `@stit-design/ui` чего-то не хватает — кладём аккуратный шим **только в `src/shared/ui-lib/`** (не в `shared/ui/`!), пишем строку в `docs/ui-lib-gaps.md` с описанием gap'а → потом, когда фича появится в DS, шим удаляется одним движением. Линт-правило: импорты `@stit-design/ui` разрешены везде, импорты `@/shared/ui-lib` тоже, кастомные обёртки над DS пишутся в `src/shared/ui/`.

### Тестовый стэк
| Зона | Выбор |
|---|---|
| Unit/component | **Vitest 4** — browser mode (Playwright provider), RTL для интеграционных |
| E2E | **Playwright** |
| A11y unit | `vitest-axe` |
| A11y e2e | `@axe-core/playwright` |
| Storybook | **Не входит в шаблон** — DS уже в ui-lib, виджеты доказываются через component-tests |
| Visual regression | Не в gate (платформозависимо). Опциональный таргет `pnpm test:visual` |
| Mock-фикстуры в тестах | переиспользуем `shared/api/mock/` сценарии в setup тестов |

### Линтеры / форматтеры / гейты
| Инструмент | Роль |
|---|---|
| **Biome 2** | format + базовые JS/TS правила (быстро, один конфиг) |
| **ESLint 9 flat** | React, jsx-a11y, testing-library, react-compiler, FSD-плагины |
| **Steiger** | архитектурный линтер FSD (forbidden-imports, public-api, no-public-api-sidestep, insignificant-slice, excessive-slicing, ambiguous-slice-names, no-segmentless-slices) |
| **lefthook** | git hooks (pre-commit, commit-msg, pre-push) — быстрый, параллельный |
| **commitlint** | Conventional Commits |
| **size-limit** | бандл-бюджеты на entry-чанки (в `pnpm check` и pre-push) |

**`pnpm check`** = typecheck + lint (Biome+ESLint) + format:check + test (vitest run + axe) + steiger + size-limit + build. E2E и visual — отдельные таргеты вне gate.

**`pnpm gen`** = генерация `routeTree.gen.ts` + `pnpm gen:api` (Hey API), если есть `OPENAPI_URL`.

### Деплой
- **Dockerfile** (multi-stage): pnpm install → pnpm build → nginx:alpine
- `nginx.conf` — SPA fallback (`try_files`), gzip/brotli, кэш immutable для `assets/*`
- **Runtime config**: `nginx-entrypoint.sh` генерит `/usr/share/nginx/html/config.js` с
  `window.__APP_CONFIG__ = {...}` из env-переменных контейнера на старте
- Один образ — любая среда (dev/stage/prod). 12-factor-friendly

### Observability
- **Sentry**: `@sentry/react` подключается условно — если `__APP_CONFIG__.SENTRY_DSN` пустой, init не вызывается (через dynamic import → не попадает в бандл). DSN — public by design, безопасно держать в runtime config
- **Web Vitals**: `web-vitals` библиотека всегда, метрики в dev — `console`, в prod — Sentry если активен, иначе noop
- **OTel-proxy stub**: `src/shared/api/telemetry/` содержит заглушку с `// TODO: backend proxy` — fsd/stack-deep-dive решает, нужно активировать (отправка батчами на `/api/telemetry`, бэк форвардит в коллектор со своим service-token)

### Forward-only + Conventional Commits
- Перенос из go-backend-template: forward-only в доках/комментариях/коммитах
- `.claude/rules/forward-only.md` — копия с фронт-адаптацией
- `lefthook commit-msg` запускает commitlint с conventional-config

---

## 3. FSD-канон шаблона (строго v2.1)

### Слои
```
src/
  app/        # инициализация (init.ts, providers, router root, styles)
  pages/      # 1 page = 1 route, file-based TanStack Router
  widgets/    # переиспользуемые блоки на ≥2 pages
  features/   # пользовательские сценарии (login, create-todo, theme-switch)
  entities/   # доменные сущности из docs/domains
  shared/     # инфра-слой
```

Импорт строго нисходящий. `processes` депрекейтнут. `app` и `shared` — sliceless (слой == слайс).

### Сегменты слайса
Каждый слайс — папка с **функциональными** сегментами:

```
features/auth-login/
  ui/          # React-компоненты
  model/       # стор, бизнес-логика, schemas, types
  api/         # запросы, мапперы DTO→domain
  lib/         # хелперы, специфичные для слайса
  config/      # feature-flags, константы
  index.ts     # public API (explicit re-exports)
```

**Запрещены** сегменты `components/`, `hooks/`, `utils/`, `types/` (это группировка «по типу», не «по назначению»).

### Public API
- `index.ts` обязателен на каждом слайсе **и** на каждом сегменте sliceless-слоя (`shared/api/index.ts`, `shared/ui/button/index.ts`)
- **Explicit re-exports**, не `export *`
- Внутри слайса — относительные пути; снаружи — только через `index.ts`
- В `shared/ui` и `shared/lib` — **отдельный `index.ts` на каждый компонент/утилиту** (для tree-shake)

### Размещение конкретики
| Что | Где |
|---|---|
| OpenAPI generated types/client | `src/shared/api/__generated__/` |
| OpenAPI generated TanStack Query hooks | `src/shared/api/__generated__/` |
| Zod-схемы доменных сущностей | `src/entities/<name>/model/schema.ts` |
| HTTP-клиент инстанс | `src/shared/api/client.ts` |
| TanStack Router route-tree | `src/app/router/` (autogen `routeTree.gen.ts`) |
| File-based routes | `src/pages/<route>/route.ts` (TanStack convention) |
| Mock-слой (MSW handlers, @mswjs/data db, scenarios, seeds) | `src/shared/api/mock/` |
| Mock-фикстуры близкие к сущности | `src/entities/<name>/api/mock-fixtures.ts` (опционально) |
| DS-шимы (gap'ы ui-lib) | `src/shared/ui-lib/` |
| Проектные обёртки над DS | `src/shared/ui/` |
| Тесты | рядом со слайсом `*.test.tsx` |
| E2E | `e2e/` на уровне проекта (вне FSD-графа) |

### Дизайн-система
- `@stit-design/ui` — внешний npm-пакет, импортируется **напрямую** из любого слоя
- `shared/ui/` хранит только **проектные обёртки** (PageHeader, DataTable с biz-семантикой)
- `shared/ui-lib/` — временные шимы (см. дисциплину выше)

### Cross-feature
Фича А не импортирует фичу Б. Варианты:
1. Поднять общее в `entities/` или `shared/` (каноничный путь)
2. Композиция в `widget` или `page` (родитель видит обе)
3. `@x`-нотация — **только для `entities/`** (не для `features/`)

### Widgets vs Pages
- **Pages-first**: если блок не переиспользуется — оставляй в page-slice
- Widget — только если: (a) ≥2 pages используют, или (b) page из нескольких независимых зон ответственности (Header, Sidebar, MainFeed)
- Steiger ловит widget с одним референсом (`insignificant-slice`)

---

## 4. Артефакты проектирования (docs/{fsd,stack}/)

Зеркалит дизайн go-backend-template (docs/domains + docs/stack).

### docs/fsd/ — карта слоёв
8 kind'ов (singleton-артефакты):

| kind | файл | что описывает |
|---|---|---|
| `app` | `app.md` | инициализация, провайдеры, root-styles |
| `pages` | `pages.md` | список pages с маппингом на routes + связь с `screens/*` |
| `widgets` | `widgets.md` | переиспользуемые блоки, маппинг на `blocks/*` |
| `features` | `features.md` | сценарии, маппинг на `situation/*` |
| `entities` | `entities.md` | доменные сущности, маппинг на `domains/*` или `data-items` |
| `shared-ui` | `shared-ui.md` | проектные обёртки над DS и шимы |
| `shared-api` | `shared-api.md` | HTTP-клиент, OpenAPI codegen, mock-слой |
| `shared-lib` | `shared-lib.md` | infra-утилиты (i18n, telemetry, testing) |

Каждый артефакт — таблица слайсов в этом слое + секция **Generates** (что родится в коде).
Аналог `docs/domains/<context>/*.md` в go-backend.

### docs/stack/ — карта платформы
8 kind'ов:

| kind | файл | описывает |
|---|---|---|
| `service` | `service.md` | name, scope (`@org/<service>`), repository URL, image registry, version scheme |
| `runtime` | `runtime.md` | node version, browser support, polyfills, target |
| `config` | `config.md` | runtime config keys, env, секреты-классы |
| `routing` | `routing.md` | TanStack Router конфигурация, layouts, route-tree origin |
| `api` | `api.md` | OpenAPI source, codegen, mock-стратегия, auth scheme |
| `styling` | `styling.md` | DS-источник, темы, layout-конвенции |
| `observability` | `observability.md` | Sentry, web-vitals, OTel-proxy решение |
| `dependencies` | `dependencies.md` | внешние runtime-deps (NPM-пакеты вне базовой подборки), reasoning |

Каждый — секция **Generates** для `de-template`.

---

## 5. Скилы шаблона

| Скил | Когда | Что делает |
|---|---|---|
| **`/init-service`** | форк, «онбординг», «с чего начать» | оркестратор: проверяет gate'ы, чейнит fsd-deep-dive → stack-deep-dive → de-template → /scaffold reference-slices → cleanup |
| **`/fsd-deep-dive`** | проектирование FSD-карты | читает `../docs/{project,interface,domains,screens}/`, ведёт диалог о слоях/слайсах/сегментах, заполняет `docs/fsd/*.md` до `status: stable`. Аналог `domain-deep-dive` в go-backend, но с особенностью «pages-first» из v2.1 |
| **`/stack-deep-dive`** | проектирование стека | заполняет `docs/stack/*.md` поверх базовых выборов шаблона (8 артефактов). Что добавляется/убирается, какие deps, какая i18n-стратегия |
| **`/de-template`** | после stable-артефактов | разворачивает шаблон в проект: package.json name, README, runtime config keys, nginx.conf, route-tree корни, prune reference-слайсов. **Не запускается** до зелёных валидаторов и stable у всех артефактов |
| **`/scaffold`** | новый слайс/page/widget | интерактивный: тип (slice/page/widget/entity/feature), имя, какие сегменты (ui/model/api/lib), нужен ли тест/route/mock-handler. Раскладывает шаблонный слайс по FSD-канону |
| **`/plan`** | любое содержательное изменение | секция в `.claude/plans/roadmap.md` (как в go-backend). Planning-first перед реализацией |
| **`/smartdev`** | начало сессии / после /clear | cockpit: ветка, drift, активный план, состояние gate'ов |

### Что НЕ добавляем
- `/release` — release-цикл фронт-приложения короткий (один Dockerfile → один image-tag → CD pipeline в infra-репо); ритуала отдельного не нужно
- `/triage-failure` — пользователь отказался; можно добавить позже
- Авто-память — отключена глобально (учтено в CLAUDE.md шаблона)

---

## 6. Reference-слайсы (учебные, удаляются в de-template)

1. **`features/auth` + `entities/session` + `pages/login`** — Login-форма: TanStack Form + Zod + Query mutation + route guard; cookie-only auth с MSW-моком
2. **`pages/profile` + `entities/user`** — чтение профиля: Query + Suspense + ErrorBoundary
3. **`pages/todos` + `entities/todo` + `features/create-todo`** — CRUD: optimistic update, invalidation, list/infinite query
4. **`features/theme`** — переключатель `data-scheme` (light/dark) из ui-lib и locale Lingui; Zustand store

Все четыре полностью маппятся друг на друга так, чтобы покрывать **все слои и все паттерны**:
формы, query/mutation, optimistic, suspense, route guards, mock-сценарии, i18n, theming, client
state. Это «золотой образец» — потенциальный потребитель шаблона смотрит и копирует.

---

## 7. Структура репо (после первичного скаффолда)

```
spa-frontend-template/
├─ .claude/
│  ├─ skills/
│  │  ├─ init-service/SKILL.md
│  │  ├─ fsd-deep-dive/SKILL.md + references/ + state/
│  │  ├─ stack-deep-dive/SKILL.md + references/ + state/
│  │  ├─ de-template/SKILL.md + references/
│  │  ├─ scaffold/SKILL.md + references/
│  │  ├─ plan/SKILL.md
│  │  └─ smartdev/SKILL.md
│  ├─ rules/
│  │  ├─ comments.md
│  │  ├─ forward-only.md
│  │  ├─ fsd-architecture.md
│  │  ├─ tests-pipeline.md
│  │  ├─ env-local.md
│  │  └─ ui-lib-gaps.md
│  ├─ plans/roadmap.md
│  └─ settings.json
├─ docs/
│  ├─ README.md           # карта документации
│  ├─ getting-started.md  # для потребителя шаблона (META, удаляется при de-template)
│  ├─ contributing.md     # устройство .claude (наследуется форком)
│  ├─ fsd/
│  │  ├─ README.md
│  │  ├─ _templates/      # 8 шаблонов под /fsd-deep-dive режим A
│  │  ├─ app.md
│  │  ├─ pages.md
│  │  ├─ widgets.md
│  │  ├─ features.md
│  │  ├─ entities.md
│  │  ├─ shared-ui.md
│  │  ├─ shared-api.md
│  │  └─ shared-lib.md
│  ├─ stack/
│  │  ├─ README.md
│  │  ├─ _templates/
│  │  └─ {8 stack-kind файлов}.md
│  ├─ reference/
│  │  ├─ architecture.md
│  │  ├─ ecosystem.md
│  │  ├─ observability.md
│  │  └─ deployment.md
│  └─ ui-lib-gaps.md      # реестр шимов и заявок в DS
├─ src/
│  ├─ app/
│  │  ├─ init.ts          # bootstrap, conditional MSW, Sentry, web-vitals
│  │  ├─ providers/       # QueryClient, RouterProvider, ThemeProvider, I18nProvider
│  │  ├─ router/          # routeTree.gen.ts, routerConfig
│  │  ├─ styles/index.css # @import "@stit-design/ui/theme.css"; @import "tailwindcss"
│  │  └─ root.tsx
│  ├─ pages/
│  │  ├─ __root.tsx       # TanStack Router root layout
│  │  ├─ index/route.ts   # /
│  │  ├─ login/route.ts   # /login
│  │  ├─ profile/route.ts # /profile  (guarded)
│  │  └─ todos/route.ts   # /todos    (guarded)
│  ├─ widgets/
│  │  └─ app-shell/       # Header + Sidebar + Outlet + ThemeSwitcher
│  ├─ features/
│  │  ├─ auth/            # login/logout
│  │  ├─ create-todo/
│  │  └─ theme/           # data-scheme + locale switcher
│  ├─ entities/
│  │  ├─ session/
│  │  ├─ user/
│  │  └─ todo/
│  └─ shared/
│     ├─ api/
│     │  ├─ client.ts
│     │  ├─ telemetry/    # stub OTel-proxy
│     │  ├─ mock/
│     │  │  ├─ index.ts   # start()
│     │  │  ├─ db.ts      # @mswjs/data
│     │  │  ├─ handlers/
│     │  │  ├─ seeds/     # faker фабрики
│     │  │  ├─ scenarios/ # empty | populated | error
│     │  │  └─ persist.ts # localStorage гидрация
│     │  └─ __generated__/  # Hey API output (после pnpm gen:api)
│     ├─ config/runtime.ts  # window.__APP_CONFIG__ → typed config
│     ├─ i18n/              # Lingui setup
│     ├─ lib/               # генерик-хелперы (cn, invariant, debounce)
│     ├─ ui/                # проектные обёртки над DS (PageHeader, DataTable)
│     └─ ui-lib/            # шимы для отсутствующих компонентов DS
├─ public/
│  ├─ mockServiceWorker.js  # генерится npx msw init
│  └─ config.js             # генерится nginx-entrypoint.sh при старте
├─ e2e/                     # Playwright тесты
│  ├─ playwright.config.ts
│  └─ smoke.spec.ts
├─ scripts/
│  ├─ gen-api.ts            # обёртка над Hey API
│  └─ gen-msw-init.ts
├─ docker/
│  ├─ Dockerfile
│  ├─ nginx.conf
│  └─ nginx-entrypoint.sh
├─ .env.example             # VITE_API_MODE=mock | real, VITE_API_TARGET=, etc.
├─ .env.local.example
├─ .gitignore
├─ .nvmrc                   # node 24.x
├─ .npmrc                   # @stit-design registry
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json            # strict + bundler resolution
├─ vite.config.ts
├─ vitest.config.ts
├─ eslint.config.js         # flat + React + jsx-a11y + react-compiler + FSD plugins
├─ biome.json
├─ steiger.config.ts
├─ lefthook.yml
├─ .commitlintrc.cjs
├─ size-limit.config.cjs
├─ CLAUDE.md                # ядро + роутер скилов
├─ README.md                # точка входа потребителя
└─ Makefile (или package.json scripts only)
```

---

## 8. package.json scripts (контракт)

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "biome check . && eslint .",
    "lint:fix": "biome check --write . && eslint --fix .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:browser": "vitest --browser",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:visual": "playwright test --grep @visual",
    "steiger": "steiger src",
    "size": "size-limit",
    "gen": "tsr generate && pnpm gen:api",
    "gen:api": "tsx scripts/gen-api.ts",
    "check": "pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm steiger && pnpm size && pnpm build",
    "analyze": "vite build --mode analyze"
  }
}
```

---

## 9. Воркфлоу потребителя шаблона (после фотрка)

```
1. Use this template на Gitea → клон
2. pnpm install
3. /smartdev → видит, что project в шаблонном состоянии
4. /init-service:
   ├─ читает ../docs/{project,interface,domains,screens}/ (если есть)
   ├─ → /fsd-deep-dive (волны вопросов, заполняет docs/fsd/*.md)
   ├─ → /stack-deep-dive (заполняет docs/stack/*.md)
   ├─ → gate: оба валидатора + state чист
   ├─ → /de-template (module path, nginx.conf, prune reference-слайсов)
   └─ → /scaffold для собственных слайсов по проектированию
5. pnpm dev → SPA крутится в mock-режиме на спроектированных сущностях
6. (когда бэк появится) бэк публикует /openapi.json
7. .env.local: VITE_API_MODE=real, VITE_API_TARGET=https://api.dev.example.com
8. pnpm gen:api → Hey API регенерирует клиент и хэндлеры
9. pnpm dev → крутится против реального бэка
10. pnpm check → gate → git push
11. CI: образ → registry → infra deploy
```

---

## 10. Невходящее (явно out-of-scope шаблона)

- **SSR/SSG** — это CSR SPA, никаких Next/Remix/TanStack Start
- **Monorepo / workspaces** — один пакет; если фронту нужен общий код с другим фронтом, это другой шаблон
- **Custom design system** — `@stit-design/ui` единственный источник; кастомные компоненты только в `shared/ui/` как обёртки или в `shared/ui-lib/` как gap-шимы
- **Сторибук** — в ui-lib
- **PWA / offline-first** — добавляется проектом, если нужно
- **Visual regression в gate** — только опциональный таргет
- **Release-скил для приложения** — короткий CI-pipeline, ритуал не нужен

---

## 11. Открытые точки на момент апрува

Если что-то ниже неясно — обсуждаем до старта реализации:

1. **Имя FSD-слоя `pages/` vs `routes/`** — TanStack Router file-based ищет файлы по конвенции; решим, оставлять ли `pages/` (FSD-канон) с `tanstackRouter({ routesDirectory: 'src/pages' })`, или переименовать в `routes/` ради конвенции router'а. Предлагаю **оставить `pages/`** — FSD-канон важнее, плагин Router конфигурируется.
2. **`tsx` vs `node --experimental-strip-types`** для запуска скриптов в `scripts/` — обычно `tsx`, но Node 24 уже умеет strip-types; решу при реализации в пользу `tsx` (зрелость экосистемы).
3. **Reference-слайсы — глубина** — оставляю минимум, чтобы покрыть паттерны (4 слайса достаточно); если хочется ещё (file upload, infinite scroll, websocket-подписка) — скажите.
