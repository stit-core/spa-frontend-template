---
id: fsd.shared-ui
kind: shared-ui
name: shared-ui
status: draft
---

# shared-ui

## Назначение

- `shared/ui/` — проектные обёртки над `@stit/ui` (PageHeader,
  DataTable c biz-семантикой). Тонкие, с layout-конвенциями проекта.
- `shared/ui-lib/` — временные шимы для отсутствующих в DS компонентов.
  Дисциплина — `docs/ui-lib-gaps.md`.

## Карта shared/ui/

| component | оборачивает (DS) | проектная семантика |
|---|---|---|
| _name_ | _что из DS_ | _что добавляет_ |

## Карта shared/ui-lib/ (gap-шимы)

Должна совпадать с `docs/ui-lib-gaps.md`.

| shim | gap в DS | критерий замены |
|---|---|---|
| _name_ | _что_ | _когда заменять_ |

## Generates

- `src/shared/ui/<component>/<name>.tsx` + `index.ts`
- `src/shared/ui-lib/<shim>/<name>.tsx` + `index.ts` + запись в `ui-lib-gaps.md`

## Открытые вопросы

- _что_
