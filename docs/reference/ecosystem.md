# Экосистема

## Соседние репозитории

Экосистема sftbmb — **4 форкаемых шаблона** под оргом `sftbmb-core` (этот репо
один из них), плюс корп control-plane `sftbmb-infra/infra`, общая Go-библиотека
`sftbmb-core/golibinfra` и дизайн-система `sftbmb-core/ui-lib` (см. ниже). Типовой
проект разворачивает рядом 4 форка:

```
~/git/<org>/<project>/
├─ docs/      ← project-docs-template (per-project: projects/<slug>/{vision+таблицы, interface, domains, screens})
├─ backend/   ← go-backend-template (опционально)
├─ frontend/  ← spa-frontend-template (этот репо)
└─ infra/     ← project-infra-template-compose
```

## Кто что хранит

| репо | первичная ответственность |
|---|---|
| `docs/` | продуктовая аналитика (project), UX-аналитика (interface), DDD бэка (domains), композиция экранов (screens) |
| `backend/` | HTTP API, доменная логика, миграции БД, sqlc, NATS, outbox |
| `frontend/` | SPA: FSD-структура, mock-слой, runtime config, Docker image |
| `infra/` | docker-compose, deploy, secrets через Vault, ingress |

## Контракты между репо

| источник | потребитель | что |
|---|---|---|
| `docs/projects/<slug>/` | `frontend/`, `backend/` | product-файлы в корне папки проекта: vision, persona, capability, surface |
| `docs/projects/<slug>/interface/` | `frontend/` | who, situation, zone, block (вход для `/fsd-deep-dive`) |
| `docs/projects/<slug>/domains/` | `backend/`, `frontend/` | DDD-сущности (вход для `mock-слоя`) |
| `docs/projects/<slug>/screens/` | `frontend/` | flows, screens, blocks, shells |
| `backend/openapi.json` | `frontend/` | контракт HTTP API (вход для Hey API codegen) |
| `frontend/dist` | `infra/` | image push → CD pipeline |

## Корп control-plane

Вне форкаемых шаблонов — корпоративный control-plane под оргом `sftbmb-infra`:

- `sftbmb-infra/infra` — корп-VPS: Vault (KV + AppRole онбординг проектов), registry
  `git.sftbmb.ru`, приём OTLP на `otel.sftbmb.ru`, LE-DNS. Source-of-truth карты
  экосистемы.
- `sftbmb-core/golibinfra` — общая Go-библиотека (kit'ы), которую тянет `backend/`.

Эти репо **не форкаются** — общие для всех проектов.

## Дизайн-система

`@sftbmb/ui` — **внешний** npm-пакет из `git.sftbmb.ru/sftbmb-core/ui-lib`.
Не клонируется в проект, не реэкспортируется через
`shared/ui`. Импортируется напрямую из любого слоя FSD.

## Шаблон vs проект

4 форкаемых шаблона (`go-backend-template`, `spa-frontend-template`,
`project-docs-template`, `project-infra-template-compose`) живут под оргом
`sftbmb-core` и форкаются через Gitea «Use this template». Этот фронт-шаблон
проходит `/init-service` → `/de-template`, после чего становится независимым
проектом.
