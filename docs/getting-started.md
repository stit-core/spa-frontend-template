# Getting Started

> [META] Этот файл предназначен **только для потребителя шаблона**.
> `/de-template` удаляет его при первом разворачивании в проект.

## Что это

Шаблон React SPA на TypeScript для sftbmb-проектов. Жёсткий FSD,
TanStack Router/Query, MSW для mock-режима, дизайн-система
`@sftbmb/ui` из приватного registry. После форка ты пройдёшь
несколько этапов проектирования, и репо разверётся в самостоятельный
проект, не помнящий про шаблон.

## Путь

```
0. Use this template на Gitea → клон → pnpm install
1. /smartdev          → сводка состояния
2. /init-service      → оркестратор онбординга:
   ├─ /fsd-deep-dive  → проектирование FSD-карты (docs/fsd/*)
   ├─ /stack-deep-dive → проектирование стека (docs/stack/*)
   ├─ gate: оба валидатора зелёные + state скилов чист
   ├─ /de-template    → разворот фундамента, prune reference-слайсов
   └─ /scaffold       → для каждого своего слайса
3. pnpm dev → SPA крутится в mock-режиме
4. (когда бэк появится) /openapi.json → pnpm gen:api → переключи VITE_API_MODE=real
5. pnpm check → git push → CI собирает Docker image → инфра деплоит
```

## Шаг 0: подготовка

```bash
# Node 24 (через nvm/asdf)
nvm use

# pnpm 10 через corepack
corepack enable
corepack prepare pnpm@10 --activate

# Зависимости
pnpm install

# Git-хуки
pnpm prepare   # lefthook install
```

## Шаг 1: смартдев

В Claude Code:

```
/smartdev
```

Покажет состояние: ветка, drift, активный план, gate'ы. На свежем форке
скажет «начни с /init-service».

## Шаг 2: /init-service

Скил сам проводит по этапам:

1. **`/fsd-deep-dive`** — волнами вопросов проектирует
   `docs/fsd/{app,pages,widgets,features,entities,shared-ui,shared-api,shared-lib}.md`.
   Читает соседнюю папку проекта `../docs/projects/<slug>/` (product-файлы в
   корне + вложенные `interface`/`domains`/`screens`) как контекст.
2. **`/stack-deep-dive`** — добивает `docs/stack/{service,runtime,config,routing,api,styling,observability,dependencies}.md`
   поверх базовых выборов шаблона.
3. После всех `status: stable` запускает **`/de-template`** — переименование
   пакета, обновление README, генерация nginx env-set, удаление
   reference-слайсов.

## Шаг 3: разработка

```bash
pnpm dev              # mock-режим по умолчанию (VITE_API_MODE=mock)
```

В левом нижнем углу — мини-панель переключателя mock-сценариев
(`empty | populated | authenticated | error`). Состояние сохраняется
в `localStorage` (`app.mock.db.v1`), кнопка **reset** чистит.

Когда появится бэк:

```bash
# .env.local
VITE_API_MODE=real
VITE_API_TARGET=https://api.dev.example.com

# Если у бэка есть /openapi.json — генерим клиент:
pnpm gen:api
```

## Gate перед push

```bash
pnpm check   # typecheck + lint + format:check + test + steiger + size + build
```

Lefthook `pre-push` запускает то же самое автоматически.

## Когда что-то идёт не так

- **`/smartdev`** покажет состояние и подскажет, в какой режим/скил идти
- **Артефакты не stable** → доделай через `/fsd-deep-dive` или `/stack-deep-dive`
- **Reference-слайсы мешают** — удаляются `/de-template` (см. его references/prune.md)
