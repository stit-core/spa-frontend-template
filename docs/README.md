# docs/ — карта документации

Документация — **source of truth** для всего, что разворачивается в коде.
Скилы `/fsd-deep-dive` и `/stack-deep-dive` заполняют артефакты ниже до
`status: stable`, после чего `/de-template` разворачивает по ним фундамент
проекта, а `/scaffold` — отдельные слайсы.

## Слои

| каталог | вопрос | вход |
|---|---|---|
| [`fsd/`](./fsd/README.md) | **как нарезан фронт по FSD** (8 артефактов слоёв) | `/fsd-deep-dive` |
| [`stack/`](./stack/README.md) | **на какой платформе крутится фронт** (8 артефактов стека) | `/stack-deep-dive` |
| [`reference/`](./reference/) | **архитектура и устройство** (стационарные доки) | вручную |
| `ui-lib-gaps.md` | **долг к `@stit-design/ui`** (gap-шимы и их критерии замены) | автоматически при добавлении шима |

## Внешние артефакты

Проектная аналитика — в соседнем репо (`../docs/`), который создаётся из
`project-docs-template`:

- `../docs/project/` — vision, persona, capability, surface, integration…
- `../docs/interface/` — who, stage, situation, zone, block, ux-substrate, data-items
- `../docs/domains/` — DDD-артефакты бэкенда (если есть)
- `../docs/screens/` — flow, screen, block, shell

`/fsd-deep-dive` **читает** эти артефакты как первичный контекст и мапит
ситуации/блоки/сущности на FSD-слои.

## Reference

- [`reference/architecture.md`](./reference/architecture.md) — слои, импорты, public API
- [`reference/ecosystem.md`](./reference/ecosystem.md) — место в 3-репо схеме (docs/frontend/backend/infra)
- [`reference/observability.md`](./reference/observability.md) — Sentry, web-vitals, OTel-proxy
- [`reference/deployment.md`](./reference/deployment.md) — Dockerfile, nginx, runtime config
- [`getting-started.md`](./getting-started.md) — для потребителя шаблона (META, удаляется в de-template)
- [`contributing.md`](./contributing.md) — устройство `.claude`-системы (наследуется форком)

## Forward-only

Все артефакты — текущее состояние. Без «было/стало», без changelog'ов внутри
текста, без следов отменённых решений. История — в `git log`.
