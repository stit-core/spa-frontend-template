---
id: fsd.shared-lib
kind: shared-lib
name: shared-lib
status: draft
---

# shared-lib

## Назначение

Инфра-утилиты, не привязанные к домену: i18n, observability, generic-хелперы
(`cn`, `invariant`, `debounce`, …), testing-утилиты.

## Состав

| сегмент | назначение |
|---|---|
| `config/` | runtime config (Zod-валидация `window.__APP_CONFIG__`) |
| `i18n/` | Lingui setup, locales |
| `observability/` | Sentry condit. init + web-vitals |
| `lib/` | generic-утилиты (cn, invariant, …) |
| `testing/` | hooks/wrappers для unit-тестов (опционально) |

## i18n

- Дефолтная локаль: `ru`
- Поддерживаемые: `ru`, `en`
- Переключение: `features/theme` → store → `i18n.activate(locale)`

## Generates

- `src/shared/config/index.ts`
- `src/shared/i18n/index.ts` + `locales/{ru,en}.ts`
- `src/shared/observability/index.ts`
- `src/shared/lib/*.ts` + `index.ts`

## Открытые вопросы

- _что_
