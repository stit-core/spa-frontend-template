---
id: stack.observability
kind: observability
name: observability
status: draft
---

# observability

## Sentry

- SaaS / self-hosted GlitchTip: _какой_
- DSN: через `window.__APP_CONFIG__.SENTRY_DSN`
- Активация: dynamic import при непустом DSN
- traces sample rate: `0.1`
- session replay: _нужен ли (privacy-чувствительно)_

## Web Vitals

- LCP / INP / CLS / FCP / TTFB
- dev: `console.info`
- prod: Sentry если активен, иначе noop

## OTel-collector

- backend-as-proxy: _нужен ли_
- если да: фронт батчит → `/api/v1/telemetry` → бэк → collector с service-token
- service-token хранится в _Vault path_

## Generates

- `src/shared/observability/index.ts` — Sentry + web-vitals
- `src/shared/api/telemetry/index.ts` — proxy-клиент (если активен)
- `docker/nginx-entrypoint.sh` — env `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `RELEASE`

## Открытые вопросы

- _что_
