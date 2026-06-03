# FSD-артефакты

Проектирование FSD-карты — **первичный source of truth** и **вход для скила
`/de-template` и `/scaffold`**. Зеркалит `docs/stack/`: 8 singleton-артефактов
(по одному на слой/сегмент), заполняются через `/fsd-deep-dive`, валидируются
структурным сценарием скила.

Где `docs/stack/` отвечает на «на чём крутится», `docs/fsd/` отвечает на
«как нарезано».

## Kinds

| kind | файл | описывает |
|---|---|---|
| `app` | `app.md` | bootstrap, providers, router-config, root-стили |
| `pages` | `pages.md` | список pages с маппингом на routes + связь с `screens/*` |
| `widgets` | `widgets.md` | переиспользуемые блоки, маппинг на `blocks/*` |
| `features` | `features.md` | сценарии, маппинг на `situation/*` |
| `entities` | `entities.md` | доменные сущности, маппинг на `domains/*` или `data-items` |
| `shared-ui` | `shared-ui.md` | проектные обёртки над DS, шимы `ui-lib/` |
| `shared-api` | `shared-api.md` | HTTP-клиент, OpenAPI codegen, mock-стратегия |
| `shared-lib` | `shared-lib.md` | i18n, observability, lib-утилиты |

Каждый артефакт обязан иметь секцию **Generates** — что из него родится в коде.

## Frontmatter

```yaml
id: fsd.<name>            # fsd.app, fsd.pages, …
kind: <name>              # один из 8 выше
name: <name>              # == basename файла без .md
status: draft             # draft → stable (после полного заполнения секций)
```

## Workflow

1. Скопировать `_templates/<kind>.md` → `docs/fsd/<kind>.md` (8 штук)
2. `/fsd-deep-dive` — заполнить волнами вопросов на основе `../docs/projects/<slug>/` (product-файлы в корне + вложенные `interface`/`domains`/`screens`)
3. Промоушн `status: draft → stable` после полного заполнения всех обязательных секций
4. `/de-template` читает stable-артефакты и разворачивает фундамент по секциям `Generates`

## Gate

`/de-template` и `/scaffold` не запускаются, пока не все артефакты `stable`.
Зеркалит stack-gate.
