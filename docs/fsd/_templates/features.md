---
id: fsd.features
kind: features
name: features
status: draft
---

# features

## Назначение

Пользовательские сценарии (action-oriented). Каждая фича — отдельный
сценарий действия пользователя.

## Карта features

| slice | сценарий | situation (../docs/projects/<slug>/interface) | использует entities | результат |
|---|---|---|---|---|
| _name_ | _что делает пользователь_ | _slug_ | _какие_ | _изменение state_ |

## Cross-feature

Фича A не импортирует фичу B. Если такой случай возникает — поднимаем
общее в entities/shared или композируем в widget/page.

## Generates

- `src/features/<slice>/ui/*`
- `src/features/<slice>/model/*` (schema, store)
- `src/features/<slice>/api/*` (mutations)
- `src/features/<slice>/lib/*`
- `src/features/<slice>/index.ts`

## Открытые вопросы

- _что_
