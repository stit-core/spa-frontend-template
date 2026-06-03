---
id: fsd.pages
kind: pages
name: pages
status: draft
---

# pages

## Назначение

1 page = 1 route. File-based TanStack Router. Каждая page — слайс с минимальной
композицией (PageHeader + содержимое из widgets/features/entities).

## Карта pages

| slice | путь URL | screen (../docs/projects/<slug>/screens/screens) | guard | компонент |
|---|---|---|---|---|
| _name_ | _/path_ | _slug_ | _public / authenticated / role_ | _что внутри_ |

## Связь с layouts

| layout | какие pages используют |
|---|---|
| `__root` (AppShell) | _все_ |
| _custom_ | _какие_ |

## Guards и redirects

| правило | где |
|---|---|
| `unauthenticated → /login` | _какие routes_ |
| _other_ | _где_ |

## Generates

- `src/pages/<slice>.tsx` (или `<slice>/route.ts` + `<slice>/ui/page.tsx` для крупных)
- `src/pages/__root.tsx` — корневой layout

## Открытые вопросы

- _что нужно решить_
