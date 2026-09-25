# Профиль репо для /plan — spa-frontend-template

- **Роль:** сервис — React SPA (`<org>/frontend`). Работа приходит фазой программы из хаба
  `<org>/infra` (`parent: infra:<slug>`) или прямым заходом. Итог — образ в registry (`/release`);
  выкатка тега — только из хаба (`make bump`).
- **Гейт перед «готово»:** `pnpm check` (plan:check + typecheck + lint + format:check + test +
  steiger + build + size).
- **Проверка планов:** `pnpm plan:check` (входит в `pnpm check`; pre-commit проверяет, когда
  меняется `.claude/plans/`).
- **Сводка планов:** `pnpm plan:check --summary`.
- **Типовые проверки шагов:** `pnpm vitest run <путь>` → passed · `pnpm test` → passed ·
  `pnpm steiger` → без нарушений · `pnpm build` → собрано · `pnpm test:e2e` → passed (отдельный
  прогон, не в гейте) · `pnpm check` → зелёный.
- **Handoff:** в хаб `<org>/infra` — новый образ и новые runtime-ключи env (их печатает `/release`);
  в `<org>/strategy` — расхождение с FSD-картой (карта правится только там, её скиллами).
- **Разбор падений:** отдельного скилла нет — сначала воспроизводящий тест, потом фикс.
- **До плана выясни:**
  - какая stable-запись FSD-карты (`<org>/strategy`, `docs/projects/<slug>/fsd/<surface>/`)
    описывает задачу; нет записи — это работа strategy (`/fsd-deep-dive`), а не этого репо;
  - какие слои FSD затронуты и не нужен ли подъём в `entities`/`shared` вместо cross-feature;
  - контракт API: схемы Zod в `entities/<name>/model/schema.ts` и сценарии MSW для mock-режима;
  - новая зависимость — запись в `docs/stack/dependencies.md`; правки `docker/*`, `.npmrc` и
    runtime config согласуй с пользователем;
  - env: build-time (`VITE_*`) или runtime (`window.__APP_CONFIG__`); секретов во фронте нет;
  - i18n (Lingui), доступность (axe в компонент-тестах), бюджет размера (`pnpm size`).
