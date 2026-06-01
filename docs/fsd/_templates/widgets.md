---
id: fsd.widgets
kind: widgets
name: widgets
status: draft
---

# widgets

## Назначение

Переиспользуемые UI-блоки на **≥2 pages** или независимые зоны
ответственности внутри одной page (Header, Sidebar, Outlet и т.п.).

> **Pages-first**: блок, использующийся в одной page, остаётся в page-слайсе.
> Steiger ловит widget с одним референсом как `insignificant-slice`.

## Карта widgets

| slice | назначение | использует entities/features | block (../docs/screens) |
|---|---|---|---|
| _name_ | _что_ | _что_ | _slug_ |

## Generates

- `src/widgets/<slice>/ui/<name>.tsx`
- `src/widgets/<slice>/index.ts`

## Открытые вопросы

- _что_
