---
id: stack.runtime
kind: runtime
name: runtime
status: draft
---

# runtime

## Node

- Версия dev: `24 LTS`
- Менеджер: `pnpm 10` через corepack
- ESM-only (`"type": "module"`)

## Browser

- Target: `es2024`
- Поддержка: _не шире минимума Tailwind v4 — Chrome/Edge ≥ 111, Firefox ≥ 128, Safari ≥ 16.4_
- Polyfills: _нужны ли (при target `es2024` обычно нет)_

## React

- Версия: `19.2.x`
- Compiler: `1.0`, `compilationMode: 'infer'` — компоненты и хуки (`'all'` ломает
  обычные функции, см. комментарий в `vite.config.ts`)
- View Transitions: _включаем для навигаций?_

## Generates

- `.nvmrc`
- `package.json#engines`
- `tsconfig.json#target` / `vite.config.ts#build.target`

## Открытые вопросы

- _что_
