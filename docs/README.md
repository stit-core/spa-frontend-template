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
| `ui-lib-gaps.md` | **долг к `@stit/ui`** (gap-шимы и их критерии замены) | автоматически при добавлении шима |

## Внешние артефакты

Проектная аналитика — в соседнем репо (`../docs/`, форк `project-docs-template`),
вложенная per-project в папке проекта `../docs/projects/<slug>/`:

- `../docs/projects/<slug>/` — product-файлы прямо в корне папки проекта:
  vision.md + таблицы persona, capability, surface, integration…
- `../docs/projects/<slug>/interface/` — who, stage, situation, zone, block, ux-substrate, data-items
- `../docs/projects/<slug>/domains/` — DDD-артефакты бэкенда (если есть)
- `../docs/projects/<slug>/screens/` — flows, screens, blocks, shells (каждый — подкаталог)

`/fsd-deep-dive` **читает** эти артефакты как первичный контекст и мапит
ситуации/блоки/сущности на FSD-слои.

## Reference

- [`reference/architecture.md`](./reference/architecture.md) — слои, импорты, public API
- [`reference/ecosystem.md`](./reference/ecosystem.md) — место в экосистеме шаблонов (docs/frontend/backend/infra + корп control-plane + дизайн-система)
- [`reference/observability.md`](./reference/observability.md) — Sentry, web-vitals, OTel-proxy
- [`reference/deployment.md`](./reference/deployment.md) — Dockerfile, nginx, runtime config
- [`getting-started.md`](./getting-started.md) — для потребителя шаблона (META, удаляется в de-template)
- [`contributing.md`](./contributing.md) — устройство `.claude`-системы (наследуется форком)

## Forward-only

Все артефакты — текущее состояние. Без «было/стало», без changelog'ов внутри
текста, без следов отменённых решений. История — в `git log`.
