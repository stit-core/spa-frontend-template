# spa-frontend-template — гайд для агентов

Шаблон React SPA: TypeScript 6 / Vite 8 / React 19.2 + Compiler 1.0 /
TanStack Router (file-based) + Query + Form / Zustand / Zod 4 (рукописные
контракты API, без кодогена) / Tailwind v4 / MSW для mock-режима /
Lingui 5 runtime-only i18n / Sentry condit. + web-vitals /
Biome 2 + ESLint 9 + Steiger / Vitest 4 + Playwright / pnpm 10 / lefthook.

Этот файл — **ядро (always-on) + роутер**. Детали — в `docs/`, контекстные
правила — в `.claude/rules/` (подгружаются по `paths`, когда читаешь файл их темы;
`forward-only` — всегда), процедуры — в `.claude/skills/`.
Карта документации — `docs/README.md`.

## Точка входа

Сюда приходят двумя путями, и в обоих работаешь обвязкой этого репо — этот файл,
скиллы, гейт `pnpm check`:

- **из корня проекта `~/git/<org>/`** — оттуда ведётся вся работа: сначала проект
  продумывается в `<org>/strategy`, затем сессия корня (или её фоновый агент)
  приходит сюда, в `frontend/`, с задачей или фазой программы. Сквозная задача —
  программа в `.claude/plans/` хаба `<org>/infra`; её фаза ведётся планом здесь
  (`/plan`, `parent: infra:<slug>`). Итог работы здесь — образ в registry
  (`/release`); выкатка тега — только через хаб (`make bump`);
- **прямым заходом** (сессия в папке репо) — нормальный режим; то, что задевает
  соседей, уходит handoff-блоком для хаба `<org>/infra` (его печатает `/release`:
  новый образ, новые runtime-ключи env), изменение дизайна — в `<org>/strategy` его
  скиллами.

Дальше:

- **`/smartdev`** — сводка состояния и следующий шаг. Запускай в начале сессии и
  после `/clear`.
- **Свежий форк шаблона** — путь `docs/getting-started.md`: форк → `/init-service` →
  проектирование стека (FSD-карта — в `<org>/strategy`) → `/de-template` → свой проект.
- **Planning-first.** Содержательное изменение идёт через план — файл в
  `.claude/plans/` (skill `/plan`: критерии приёмки, шаги с проверками, «Где мы
  сейчас» для продолжения после `/clear`); бэклог — `.claude/plans/backlog.md`.
  Прямая правка — только truly-atomic и багфиксы.

## Проектирование первично, код вторичен

**FSD-карта проектируется в соседнем `<org>/strategy`** (форк
`business-strategy-template`): слой `docs/projects/<slug>/fsd/<surface>/` —
карта слайсов (entities · features · pages · widgets · app · shared-*),
восходящая к ситуациям/экранам/доменам; там её ведёт его `/fsd-deep-dive`.
Этот репо её **читает** (cross-repo, read-only): `/scaffold` и `/de-template`
разворачивают stable-записи в код и сами выводят `src/<layer>/<slice>/` из
kind + slug. Артефакты платформы — локальные `docs/stack/` (8 kinds). Код
пишется/генерируется по артефактам, не наоборот. Reference-слайсы
`features/auth`, `pages/profile`, `pages/todos`, `features/theme` — учебные
образцы: изучить, потом удалить под свой проект (через `/de-template`).

Резолв соседа — sibling-checkout в корне проекта: поля `project-slug` / `strategy-path`
(дефолт `../strategy`) / `surface` в `docs/stack/service.md`. Соседа нет —
скиллы печатают next-step, не падают.

## Команды

Единый интерфейс через `pnpm <script>` (`package.json`):

| команда | что делает |
|---|---|
| `pnpm dev` | Vite dev-server, mock-режим по умолчанию |
| `pnpm build` | typecheck + Vite prod build |
| `pnpm test` | Vitest (run) |
| `pnpm test:e2e` | Playwright |
| `pnpm steiger` | архитектурный линтер FSD |
| `pnpm gen` | route-tree (TanStack Router CLI) |
| `pnpm check` | **gate**: typecheck + lint + format:check + test + steiger + build + size |

Перед claim «готово» / push — **`pnpm check`** (его же гоняет `lefthook pre-push`).

## Карта: где что

| Тема | Где |
|---|---|
| Архитектура FSD, слои, public API | `docs/reference/architecture.md` + rule `fsd-architecture` |
| Экосистема: 7 шаблонов + 2 библиотеки, корень проекта и соседи, когда SPA / когда сайт, контракты, флоу (из корня проекта или прямой заход) | `docs/reference/ecosystem.md` |
| Observability (Sentry, web-vitals) | `docs/reference/observability.md` |
| Deployment (Dockerfile, nginx, runtime config) | `docs/reference/deployment.md` |
| Тесты | rule `tests-pipeline` |
| env, секреты, runtime config | rule `env-local` |
| UI-компоненты (свои, на собственном токен-слое) | rule `shared-ui` |
| FSD-карта (8 kinds, cross-repo) | `../strategy/docs/projects/<slug>/fsd/<surface>/` (канон слоя — `../strategy/docs/projects/_template/fsd/README.md`) |
| Stack-артефакты (8 kinds) | `docs/stack/README.md` |
| Путь потребителя шаблона: форк → свой проект | `docs/getting-started.md` |
| Устройство `.claude`-системы (правила, скиллы, план, state) | `docs/contributing.md` |
| Forward-only, комментарии | rules `forward-only`, `comments` |

## Стиль кода (инварианты)

- **Biome formatter** + **ESLint flat config** обязательны (`pnpm lint`)
- **TypeScript strict** (`verbatimModuleSyntax`, `noUncheckedIndexedAccess`, …) —
  без `as any` без явной причины
- **React Compiler 1.0** (`compilationMode: infer`) — код пишется без ручных
  `useMemo`/`useCallback`/`memo` кроме обоснованных случаев (compiler-правила
  `eslint-plugin-react-hooks` ловят нарушения Rules of React)
- **FSD-импорты** строго нисходящие и только через public API — без deep-import
  `@/<layer>/<slice>/<segment>/…` (Steiger + `eslint-plugin-boundaries` +
  `no-restricted-imports`)
- **Public API** — `index.ts` на каждом слайсе/сегменте sliceless-слоя, explicit
  re-exports, без `export *`
- **UI-компоненты пишутся в проекте** на собственном токен-слое
  (`app/styles/index.css`): семантические токены вместо сырых цветов и размеров,
  вендорные UI-киты (Material UI, shadcn, chakra…) не подключаются (rule `shared-ui`)
- **Комментарии** — только WHY, кратко (rule `comments`)

## Git workflow

- **Conventional Commits**: `feat|fix|refactor|docs|test|chore|meta|perf|style`,
  формат `<type>(<scope>)?: <subject>`, subject ≤ 72
- **Push в `main` разрешён** (прямой или через PR); линейная история
- Хуки ставит `pnpm prepare` (`lefthook install`): pre-commit — Biome и ESLint по
  staged, commit-msg — commitlint, pre-push — `pnpm check`

## Границы

### Делать всегда
- Cross-feature — только через подъём в entities/shared или композицию в widget/page
- Побочные эффекты — в `app/init.ts` или в Query (`queryFn`/`mutationFn`), не в
  рендере: рендер обязан быть чистым (Rules of React, на них опирается компилятор)
- При правке `docs/stack/*.md` — следить за `status: stable` и `Generates`-секцией;
  FSD-карта правится только в `<org>/strategy` (его `/fsd-deep-dive`), не здесь

### Сначала спросить
- Правка `docker/*`, `.npmrc`, `package.json#dependencies` без записи в `docs/stack/dependencies.md`
- Удаление reference-слайсов вручную (это работа `/de-template`)
- Изменение FSD-структуры (новый слой, переименование сегментов)

Хуки не обходятся: `--no-verify` (как и `--no-gpg-sign`) закрыт deny-правилами
`.claude/settings.json`, пропустить pre-push `pnpm check` может только сам юзер.
`.env`, `*.pem`, `*.key` не коммитятся — в них секреты.

## Долгосрочное знание

Авто-память Claude Code не используется: запись в её каталог закрыта deny-правилом
`.claude/settings.json`. Не предлагай «сохранить в память» — знание, которое должно
пережить сессию, записывается в репо: `CLAUDE.md`, `.claude/rules/`, `state/`
скиллов, `docs/`.
