# Observability

## Sentry — ошибки и перформанс

`@sentry/react` подключается **условно**: только если runtime-config содержит
непустой `SENTRY_DSN`. Загружается через `dynamic import` — без DSN в проде
ни байта Sentry в бандл не попадает.

DSN — **public by design**. Sentry-сервер режет по origin (CSP allowed
origins в настройках проекта), rate-limit'ит spam. Лежать в фронт-бандле
безопасно.

### Как поднять SaaS

1. Регистрация на sentry.io → New Project → React
2. Получаешь DSN вида `https://<key>@o<org>.ingest.sentry.io/<project>`
3. Кладёшь в env контейнера: `SENTRY_DSN=...`
4. nginx-entrypoint.sh при старте впишет в `window.__APP_CONFIG__.SENTRY_DSN`
5. Sentry активируется

### Self-hosted

Для self-hosted рекомендуется **GlitchTip** — open-source совместимый по
API/SDK, лёгкий (postgres + redis), поднимается одним docker-compose.
`@sentry/react` SDK работает без изменений: указываешь DSN на GlitchTip.

Полный Sentry self-hosted — тяжёлый (postgres + redis + kafka + clickhouse),
оправдан только при больших объёмах.

## Web Vitals — производительность

`web-vitals` (LCP, INP, CLS, FCP, TTFB) подключается **всегда**
(`src/shared/observability/index.ts`):

- в `dev` — выводит в `console.info`
- в `prod` — репортер ничего не отправляет; куда слать метрики (Sentry или свой
  приёмник) — решение проекта, дописывается в тот же репортер

Без аутентификации, без токенов.

## Что НЕ собираем

- Session replay (Sentry replay) — не подключён: privacy-чувствительно, включается осознанно
- Трейсы — выборка 10% (`tracesSampleRate: 0.1`), не трогаем без причины
