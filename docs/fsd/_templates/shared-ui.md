---
id: fsd.shared-ui
kind: shared-ui
name: shared-ui
status: draft
---

# shared-ui

## Назначение

Внешней дизайн-системы нет. `shared/ui/` — переиспользуемые UI-компоненты
проекта (примитивы + обёртки с layout-/biz-семантикой), design-system-agnostic:
опираются только на собственный токен-слой (`app/styles/index.css`). Тонкие, с
layout-конвенциями проекта. Слайс-локальный UI живёт в `ui/`-сегменте слайса и
поднимается сюда при реальном переиспользовании.

## Карта shared/ui/

| component | роль | семантика / токены |
|---|---|---|
| _name_ | _примитив / обёртка_ | _что добавляет, какие токены_ |

## Generates

- `src/shared/ui/<component>/<name>.tsx` + `index.ts`

## Открытые вопросы

- _что_
