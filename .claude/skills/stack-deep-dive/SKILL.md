---
name: stack-deep-dive
description: Проектирование платформы SPA — заполняет 8 артефактов docs/stack/{service,runtime,config,routing,api,styling,observability,dependencies}.md поверх базовых выборов шаблона раундами вопросов и ведёт их draft → stable. Используй, когда нужно спроектировать или добить стек форка, разобрать сырьё (vite.config.ts, package.json, список env, описание деплоя) по артефактам стека, и когда /init-service дошёл до этапа стека.
---

# Skill: stack-deep-dive

Интервьюер по платформе. Базовые выборы шаблона уже зафиксированы (Vite 8,
React 19.2, TanStack, Tailwind v4, MSW, …) и здесь не пересматриваются —
предложение их поменять идёт отдельным issue в репозиторий шаблона. Здесь
решаются **проектные** вариации: имя сервиса, registry, конкретный список env,
проектные зависимости.

## Pre-flight

- [ ] FSD-карта поверхности в `../strategy` (`docs/projects/<slug>/fsd/<surface>/`)
      заведена (хотя бы draft) — `shared-api.md` карты нужен для `stack/api.md`
- [ ] `docs/stack/*.md` существуют (или заводятся из `_templates/` — режим
      «Заведение»)

## Порядок (от внутреннего к внешнему)

1. **`service.md`** — имя сервиса, scope, repo URL, registry, owners, резолв strategy
2. **`runtime.md`** — node, browser target, React Compiler mode
3. **`config.md`** — все env (runtime + build-time), их дефолты, источники
4. **`routing.md`** — layouts, guards, default preload
5. **`api.md`** — контракт API (zod-схемы), auth scheme, mock-сущности
6. **`styling.md`** — какие оси темизации активны (scheme/brand/density)
7. **`observability.md`** — Sentry SaaS или self-hosted (GlitchTip), web-vitals
8. **`dependencies.md`** — проектные добавления вне базовой подборки

## Как вести артефакт

Показать, что по артефакту уже зашито шаблоном; спросить проектные вариации
раундом `AskUserQuestion` (до 4 вопросов — лимит инструмента); заполнить таблицы и
`Generates`; открытые вопросы, решения и следующие шаги — в `state/<kind>.md`.
Проектная зависимость попадает в `package.json` только вместе с записью в
`dependencies.md`. `/de-template` запускается, когда все 8 артефактов `stable`.

Справка:

- `references/workflow-patterns.md` — режимы входа (заведение / сырьё /
  углубление) и cross-kind drift; прочитай в начале сессии, чтобы выбрать режим.
- `references/field-checklists.md` — обязательные секции, `Generates` и
  anti-patterns каждого kind; сверяйся при заполнении и проверке артефакта.
- `references/state-format.md` — формат заметки `state/<kind>.md`; перед записью в state.
- `references/draft-stable.md` — контракт промоушна `draft → stable`; перед
  переводом артефакта в `stable`.
