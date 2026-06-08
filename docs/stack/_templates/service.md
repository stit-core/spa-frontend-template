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
| repository | `git@git.stit.tech:<org>/<service>-frontend.git` |
| image registry | `git.stit.tech/<org>/<service>-spa` |
| version scheme | _semver / git-sha_ |
| owners | _кто_ |

## Связь с экосистемой

- backend: `git.stit.tech/<org>/<service>-backend` (если есть)
- docs: `git.stit.tech/<org>/<service>-docs`
- infra: `git.stit.tech/<org>/<service>-infra`

## Generates

- `package.json` — `name`, `version`
- `README.md` — шапка проекта
- `docker/Dockerfile` — `LABEL` метаданные

## Открытые вопросы

- _что_
