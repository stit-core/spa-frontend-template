# spa-frontend-template — гайд для агентов

Шаблон React SPA: TypeScript 6 / Vite 8 / React 19.2 + Compiler 1.0 /
TanStack Router (file-based) + Query + Form / Zustand / Zod 4 / Tailwind v4 /
`@stit/ui` / MSW для mock-режима / Sentry condit. + web-vitals /
Biome 2 + ESLint 9 + Steiger / Vitest 4 + Playwright / pnpm 10 / lefthook.

Этот файл — **ядро (always-on) + роутер**. Детали — в `docs/`, контекстные
правила — в `.claude/rules/` (path-scoped), процедуры — в `.claude/skills/`.
Карта документации — `docs/README.md`.

## Точка входа

- **`/smartdev`** — cockpit сессии: сводка состояния (ветка, drift, активный план, gate'ы) +
  переключение в нужный режим. Запускай в начале / после `/clear`.
- **Потребителю шаблона** — `docs/getting-started.md`: форк → `/init-service` →
  проектирование FSD/стека → `/de-template` → свой проект.
- **Planning-first.** Любое содержательное изменение идёт через план — секция в
  `.claude/plans/roadmap.md` (skill `/plan`). Прямая правка — только truly-atomic
  и багфиксы.

## Проектирование первично, код вторичен

FSD-артефакты — `docs/fsd/`, артефакты платформы — `docs/stack/`. Это **source of
truth**; код пишется/генерируется по ним, не наоборот. Reference-слайсы
`features/auth`, `pages/profile`, `pages/todos`, `features/theme` — учебные
образцы: изучить, потом удалить под свой проект (через `/de-template`).

Контекст из соседнего docs-репо: `../docs/projects/<slug>/` — product-файлы
(vision + persona/capability/surface/…) прямо в папке проекта,
а `interface/`, `domains/`, `screens/` — вложенные внутри неё
(`../docs/projects/<slug>/{interface,domains,screens}/`). Читается
`/fsd-deep-dive` как первичный источник проектирования (если есть).

## Команды

Единый интерфейс через `pnpm <script>` (`package.json`):

| команда | что делает |
|---|---|
| `pnpm dev` | Vite dev-server, mock-режим по умолчанию |
| `pnpm build` | typecheck + Vite prod build |
| `pnpm test` | Vitest (run) |
| `pnpm test:e2e` | Playwright |
| `pnpm steiger` | архитектурный линтер FSD |
| `pnpm gen` | route-tree + OpenAPI codegen (Hey API) |
| `pnpm check` | **gate**: typecheck + lint + format:check + test + steiger + size + build |

Перед claim «готово» / push — **`pnpm check`** (его же гоняет `lefthook pre-push`).

## Карта: где что

| Тема | Где |
|---|---|
| Архитектура FSD, слои, public API | `docs/reference/architecture.md` + rule `fsd-architecture` |
| Экосистема (4 форкаемых шаблона, контракты) | `docs/reference/ecosystem.md` |
| Observability (Sentry, web-vitals, OTel-proxy) | `docs/reference/observability.md` |
| Deployment (Dockerfile, nginx, runtime config) | `docs/reference/deployment.md` |
| Тесты | rule `tests-pipeline` |
| env, секреты, runtime config | rule `env-local` |
| Дисциплина шимов ui-lib | rule `ui-lib-gaps` + `docs/ui-lib-gaps.md` |
| FSD-артефакты (8 kinds) | `docs/fsd/README.md` |
| Stack-артефакты (8 kinds) | `docs/stack/README.md` |
| Forward-only стиль | rule `forward-only` |

## Стиль кода (инварианты)

- **Biome formatter** + **ESLint flat config** обязательны (`pnpm lint`)
- **TypeScript strict** (`verbatimModuleSyntax`, `noUncheckedIndexedAccess`, …) —
  без `as any` без явной причины
- **React Compiler 1.0** — полный проход; код пишется без ручных `useMemo`/`useCallback`/`memo`
  кроме обоснованных случаев (`eslint-plugin-react-compiler` ловит нарушения Rules of React)
- **FSD-импорты** строго нисходящие (Steiger + `eslint-plugin-boundaries` + `no-restricted-imports`)
- **Public API** — `index.ts` на каждом слайсе/сегменте sliceless-слоя, explicit re-exports
- **`shared/ui-lib/` дисциплина** — каждый шим = запись в `docs/ui-lib-gaps.md`
- **Комментарии** — только WHY, кратко (rule `comments`)
- **Forward-only** — все доки/комментарии описывают текущее состояние,
  без «было/стало», без changelog'ов в prose

## Git workflow

- **Conventional Commits**: `feat|fix|refactor|docs|test|chore|meta|perf|style`,
  формат `<type>(<scope>)?: <subject>`, subject ≤ 72
- **Push в `main` разрешён** (прямой или через PR); линейная история
- Gate `lefthook pre-push → pnpm check` (skip только при явной просьбе юзера)
- git-хуки ставятся `pnpm prepare` (== `lefthook install`)

## Границы

### Делать всегда
- Перед claim «готово» — `pnpm check`
- **Изменение — через план** (skill `/plan`). Отклонение — осознанное
- Cross-feature — только через подъём в entities/shared или композицию в widget/page
- Compute-side-effects — в `app/init.ts` или в Query (`queryFn`); никогда в рендере
- При правке `docs/{fsd,stack}/*.md` — следить за `status: stable` и `Generates`-секцией

### Сначала спросить
- Правка `docker/*`, `.npmrc`, `package.json#dependencies` без записи в `docs/stack/dependencies.md`
- Удаление reference-слайсов вручную (это работа `/de-template`)
- Изменение FSD-структуры (новый слой, переименование сегментов)
- Любой `--no-verify`

### Не делать никогда
- `--no-verify` без явного разрешения юзера
- Коммитить `.env`, `*.pem`, `*.key`
- Прямой `export *` из `index.ts` (только explicit re-exports)
- Импорт из `../*/*/*/*` или мимо public API
- Reimport `@stit/ui` в `shared/ui/` (DS импортируется напрямую)
- Самописная DS-альтернатива в `shared/ui/` (то, что есть в DS, должно быть из DS)

## Forward-only

Любой текст в репо описывает **только текущее состояние** — не «было/стало».
История — в `git log` + Conventional Commits. Полное правило —
`.claude/rules/forward-only.md`.

## Авто-память

Запись в файловую авто-память запрещена глобально (см. `~/.claude/CLAUDE.md`).
Не предлагай «сохранить в память». Долгосрочное знание — в репо: `CLAUDE.md`,
`.claude/rules/`, `state/` каждого скила.
