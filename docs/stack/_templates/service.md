---
id: stack.service
kind: service
name: service
status: draft
---

# service

## Идентичность

| поле | значение |
|---|---|
| name | _<service>_ |
| scope | `@<org>/<service>-spa` |
| repository | `git@git.sftbmb.ru:<org>/<service>-frontend.git` |
| image registry | `git.sftbmb.ru/<org>/<service>-spa` |
| version scheme | _semver / git-sha_ |
| owners | _кто_ |

## Связь с экосистемой

- backend: `git.sftbmb.ru/<org>/<service>-backend` (если есть)
- docs: `git.sftbmb.ru/<org>/<service>-docs`
- infra: `git.sftbmb.ru/<org>/<service>-infra`

## Generates

- `package.json` — `name`, `version`
- `README.md` — шапка проекта
- `docker/Dockerfile` — `LABEL` метаданные

## Открытые вопросы

- _что_
