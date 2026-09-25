# Три режима ведения сеанса

`stack-deep-dive` поверх базовых выборов шаблона (Vite 8, React 19.2, TanStack,
Tailwind v4, MSW, …) решает **проектные** вариации. Режим определяется входом.

## A. Заведение

**Вход**: `<kind>`, для которого `docs/stack/<kind>.md` ещё нет.

Механика: освежить контракт по `docs/stack/README.md`, затем
`cp docs/stack/_templates/<kind>.md docs/stack/<kind>.md`; frontmatter (`kind`,
`status: draft`) — из имени файла, без вопросов. Дальше — режим C на свежем
артефакте.

Не хватает нескольких из 8 файлов — предложи раундом `AskUserQuestion` завести
все недостающие сразу (минимальный frontmatter + draft) или только выбранный.

## B. Сырьё

**Вход**: свободный текст или приложение (текущий `vite.config.ts`,
`package.json`, описание деплоя, список env).

Извлеки из материала платформенные решения и привяжи каждое к одному kind:
имя сервиса/registry → `service`; node/browser target/React Compiler →
`runtime`; env и секреты → `config`; layouts/guards/preload → `routing`;
контракт API/auth/mock → `api`; оси темизации → `styling`; Sentry/web-vitals →
`observability`; проектные deps → `dependencies`. План раскладки — в чат и на
подтверждение раундом `AskUserQuestion`; затем артефакты заводятся или
обновляются как драфты, дыры по обязательным секциям — `(**blocker**)` в
`state/<kind>.md`.

Извлечённое остаётся кандидатом, пока юзер его не подтвердил. Env-имена и версии
берутся только из материала. `Generates` не выводится из материала: это
контракт `/de-template`, его архитектор решает явно.

## C. Углубление

**Вход**: `<kind>` существующего артефакта — аргументом или по выбору юзера.

Цель — закрыть дыры артефакта: пустые обязательные секции, anti-pattern-подозрения
(`references/field-checklists.md`), cross-kind drift и прежде всего пустой или
TBD-`Generates` — без него артефакт бесполезен `/de-template`. Контекст — файл
артефакта целиком, его `state/<kind>.md`, если есть, и соседи по cross-kind sync:
`config` и `runtime` — роллапы, поэтому правка `observability`/`api`/`styling`
проверяется на то, что их env/DSN доехали в `config`.

Вопросы — точечно по дырам, раундом `AskUserQuestion` (до 4 вопросов). Ответы
применяются правкой артефакта; зеркальное обновление `config` — черновиком, потом
подтвердить. Закрыв дыры, прогони `references/draft-stable.md`: все ✅ — промоушн.

## Каскады / cross-kind drift

`config.md` — роллап env всех kind'ов: env, объявленный любым артефактом, обязан
быть в `config.md § Runtime config keys` или `§ Build-time env`. Drift помечается
`(**blocker**)` в `state/config.md`, чтобы не потеряться к промоушну.

## Стиль вопросов

- Имена сервиса/registry/env называет архитектор (вариант «Other» в
  `AskUserQuestion`), скилл их не предлагает.
- Сессия закрывается прогоном `references/draft-stable.md` по правленым
  артефактам — так незакрытое попадает в `state/`, а не теряется.
