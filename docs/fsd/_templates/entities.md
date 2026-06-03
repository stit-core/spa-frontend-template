---
id: fsd.entities
kind: entities
name: entities
status: draft
---

# entities

## Назначение

Доменные сущности (data-oriented). Source — `../docs/projects/<slug>/domains/`
(DDD-артефакты бэка) или `../docs/projects/<slug>/interface/data-items.md`
(если бэка нет). Каждая сущность — schema + queries/mutations + примитивный
UI-presenter.

## Карта entities

| slice | сущность | источник (domain/data-item) | поля | связи |
|---|---|---|---|---|
| _name_ | _что_ | _slug_ | _список_ | _с чем связано_ |

## Schema и валидация

Каждая сущность имеет Zod-схему в `model/types.ts`. Схема — единственный
источник правды о форме сущности на фронте. Mapping DTO → domain (если
расхождение с бэком) — в `api/`.

## Generates

- `src/entities/<slice>/model/types.ts` (Zod schema + type)
- `src/entities/<slice>/api/queries.ts` (queryOptions + мутации)
- `src/entities/<slice>/ui/<name>.tsx` (presenter, опционально)
- `src/entities/<slice>/lib/*` (хуки-обёртки, опционально)
- `src/entities/<slice>/index.ts`

## Открытые вопросы

- _что_
