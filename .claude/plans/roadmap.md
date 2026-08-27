# Roadmap

Единый план активной работы. Любое содержательное изменение идёт через секцию
здесь (skill `/plan`). План переживает `/clear`.

## Active

_пусто_

## Backlog

- Обновить observability-стек: `@sentry/react` 8→10, `web-vitals` 4→6,
  `happy-dom` 16→20 (работает и так; бамп — осознанной волной с прогоном gate).
- Сжать initial JS (~139KB gz): основной кандидат — zod в entry-графе
  (рассмотреть `zod/mini` в `shared/config`).
- E2E (`pnpm test:e2e`) — отдельный CI-stage (в gate не входит по дизайну).
