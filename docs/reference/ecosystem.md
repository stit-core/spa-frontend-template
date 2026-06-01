# Экосистема

## Соседние репозитории

Типовой проект stit состоит из 3-4 репо рядом:

```
~/git/<org>/<project>/
├─ docs/      ← project-docs-template (vision, persona, interface, domains, screens)
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
| `docs/project/` | `frontend/`, `backend/` | persona, capability, surface |
| `docs/interface/` | `frontend/` | who, situation, zone, block (вход для `/fsd-deep-dive`) |
| `docs/domains/` | `backend/`, `frontend/` | DDD-сущности (вход для `mock-слоя`) |
| `docs/screens/` | `frontend/` | flow, screen, block, shell |
| `backend/openapi.json` | `frontend/` | контракт HTTP API (вход для Hey API codegen) |
| `frontend/dist` | `infra/` | image push → CD pipeline |

## Дизайн-система

`@stit-design/ui` — **внешний** npm-пакет из `git.stit.tech/stit-design/ui-lib`.
Не клонируется в проект, не реэкспортируется через `shared/ui`. Импортируется
напрямую из любого слоя FSD.

## Шаблон vs проект

Каждый из шаблонов (`go-backend-template`, `spa-frontend-template`,
`project-docs-template`, `project-infra-template-compose`) форкается через
Gitea «Use this template» и проходит свой `/init-service` → `/de-template`.
После — независимый проект.
