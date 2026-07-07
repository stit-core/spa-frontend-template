# Чек-листы полей по kind

По разделу на каждый из 8 FSD-kinds. В каждом разделе:

- **Обязательные секции** — что должно быть и непусто к stable.
- **Что в Generates** — конкретика, которую ждёт `de-template`/`scaffold`.
- **Cross-kind ссылки** — с чем синхронизируется.
- **Главные anti-patterns**.

Полный канон — `docs/fsd/README.md` + `_templates/<kind>.md`. Здесь — выжимка
для скилла. Источник кандидатов — соседний `../docs/projects/<slug>/`.

---

## app

**Обязательные секции**: `Состав`, `Init-последовательность`, `Providers`,
`Generates`.

**Generates содержит**: `src/app/init.ts` (bootstrap-порядок), `src/app/providers/*`
(query/router/i18n/error-boundary), `src/app/router/` (root layout).

**Cross-kind**: провайдеры тянут решения из `shared-api.md` (Query-клиент),
`shared-lib.md` (i18n/observability).

**Anti-patterns**:
- Side-effect в рендере вместо `app/init.ts` / `queryFn`.
- Провайдер без обоснования в составе.

---

## pages

**Обязательные секции**: `Карта pages`, `Связь с layouts`, `Guards и redirects`,
`Generates`.

**Generates содержит**: `src/pages/<slug>.tsx` (или `<slug>/route.ts`),
привязка к route-tree.

**Cross-kind**: каждая page использует только widgets/features/entities из
своих карт; `pages/<slice>.screen` → `../docs/projects/<slug>/screens/screens/`.

**Anti-patterns**:
- Бизнес-логика в page вместо feature/entity.
- Page без соответствия экрану в источнике (выдумана).

---

## widgets

**Обязательные секции**: `Карта widgets`, `Generates`.

**Generates содержит**: `src/widgets/<name>/` с `ui/model/index.ts`.

**Cross-kind**: widget имеет **≥2 page-референса** в `pages.md` (иначе
pages-first: вернуть в page-слайс); `widgets/<slice>.block` →
`../docs/projects/<slug>/screens/blocks/`.

**Anti-patterns**:
- Widget с 1 референсом (Steiger `insignificant-slice`).
- Импорт другого widget'а напрямую (нарушение FSD-границ).

---

## features

**Обязательные секции**: `Карта features`, `Generates`.

**Generates содержит**: `src/features/<name>/` (`ui/model/api/lib/config` по
назначению, `index.ts`).

**Cross-kind**: фича использует только сущности из `entities.md`;
`features/<slice>.situation` → `../docs/projects/<slug>/interface/situation.md`.

**Anti-patterns**:
- Фича A импортит фичу B напрямую (подъём в entities/shared или композиция в
  widget/page).
- Имя-аббревиатура вместо имени сценария из `situation.md`.

---

## entities

**Обязательные секции**: `Карта entities`, `Schema и валидация`, `Generates`.

**Generates содержит**: `src/entities/<name>/model/schema.ts` (Zod),
`api/queries.ts`, `index.ts`.

**Cross-kind**: `entities/<slice>.source` →
`../docs/projects/<slug>/domains/` или `interface/data-items.md`;
схема согласована с `shared-api.md § Mock-сущности`.

**Anti-patterns**:
- Сущность без Zod-схемы.
- `@x`-нотация для features (она только для entities).

---

## shared-ui

**Обязательные секции**: `Карта shared/ui/`, `Generates`.

**Generates содержит**: `src/shared/ui/<name>/` (проектные компоненты) + `index.ts`.

**Cross-kind**: компоненты опираются на токен-слой `app/styles/index.css`
(rule `shared-ui`, `styling.md`).

**Anti-patterns**:
- Импорт внешней дизайн-системы / вендорных UI-пакетов.
- Хардкод сырых цветов/размеров вместо семантических токенов.

---

## shared-api

**Обязательные секции**: `HTTP-клиент`, `OpenAPI codegen`, `Mock-стратегия`,
`Telemetry-proxy`, `Generates`.

**Generates содержит**: `src/shared/api/client.ts`, `__generated__/`,
`src/shared/api/mock/handlers/*`.

**Cross-kind**: mock-сущности ↔ `entities.md`; OpenAPI source ↔ `stack/api.md`.

**Anti-patterns**:
- Mock-сценарий без соответствия dev-сценариям (`empty|populated|…`).
- Mock-сущность без entity в `entities.md`.

---

## shared-lib

**Обязательные секции**: `Состав`, `i18n`, `Generates`.

**Generates содержит**: `src/shared/lib/*` (generic-утилиты), `src/shared/i18n/*`,
observability-обвязка.

**Cross-kind**: i18n-bootstrap ↔ `app.md § Init-последовательность`.

**Anti-patterns**:
- Бизнес-логика слайса в `shared/lib` (она generic-only).
- Сегменты `utils/`/`helpers/` по типу вместо назначения.
