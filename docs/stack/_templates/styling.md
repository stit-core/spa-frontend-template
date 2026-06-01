---
id: stack.styling
kind: styling
name: styling
status: draft
---

# styling

## Источники

- **Дизайн-система**: `@stit-design/ui` — внешний npm-пакет из `git.stit.tech/stit-design/ui-lib`
- **CSS framework**: Tailwind v4 (Oxide engine, `@theme`)
- **Темизация**: через CSS-переменные из `@stit-design/ui/theme.css`

## Корневой импорт

`src/app/styles/index.css`:

```css
@import "@stit-design/ui/theme.css";
@import "tailwindcss";
```

## Темизация — оси

| ось | значения | управляется через |
|---|---|---|
| `data-scheme` | `light` / `dark` | `features/theme` store |
| `data-brand` | _список_ | _когда_ |
| `data-density` | `comfortable` / `compact` | _когда_ |

## Layout-конвенции проекта

- `shared/ui/` — проектные обёртки с layout-семантикой (PageHeader, DataTable)
- Тонкие, опираются на токены DS
- Запрет: хардкод цвета/размера в компонентах, обращение к примитивным
  токенам `--p-*`. Только семантические/component-токены.

## Generates

- `src/app/styles/index.css`
- `vite.config.ts#plugins[tailwindcss]`

## Открытые вопросы

- _что_
