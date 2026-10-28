# Экосистема

## Где этот шаблон

`spa-frontend-template` → форк `<org>/frontend`: React SPA — кабинет, дашборд, всё
за логином. Код пишется по FSD-карте поверхности из `<org>/strategy`; результат
репо — nginx-образ в registry.

Индексируемый сайт — другой шаблон, `seo-frontend-template`. Проект может держать
оба: сайт на корне домена, приложение на `app.${DOMAIN}`.

| нужно | берут |
|---|---|
| кабинет, дашборд, что угодно за логином | **этот шаблон** → форк `<org>/frontend` |
| страницы, которые ищут в Google и Яндексе; блог, услуги, кейсы, лендинг | `seo-frontend-template` → форк `<org>/site` |

## Шаблоны и соседи

Шаблоны `stit-core/*` форкаются в репо клиентской орги `<org>/*`; форки одной орги
лежат рядом sibling-checkout'ами (`../<name>`):

```
~/git/<org>/
├─ strategy/   ← business-strategy-template
├─ infra/      ← project-infra-template-compose (операционный хаб)
├─ frontend/   ← spa-frontend-template (этот репо)
├─ site/       ← seo-frontend-template (если есть)
├─ backend/    ← go-backend-template (если есть)
├─ <bot>/      ← telegram-bot-template (если есть)
└─ mobile/     ← mobile-template (если есть)
```

| шаблон → форк | роль |
|---|---|
| `business-strategy-template` → `<org>/strategy` | design-time source of truth: бизнес, AJTBD, SWOT, карта гипотез, продукты (vision/surface, interface, screens, fsd, telegram-bot-flow, mobile, services + domains), ИТ-периметр |
| `project-infra-template-compose` → `<org>/infra` | runtime проекта (docker-compose на VPS) и **операционный хаб**: общий план, рассылка агентов по сиблингам, выкатка тегов (`make bump`) |
| `go-backend-template` → `<org>/backend` | Go-сервис |
| `spa-frontend-template` → `<org>/frontend` | React SPA (кабинет, всё за логином) — этот репо |
| `seo-frontend-template` → `<org>/site` | Astro SEO-сайт (индексируемый контент) |
| `telegram-bot-template` → `<org>/<bot>` | Telegram-бот (Python, aiogram) |
| `mobile-template` → `<org>/mobile` | KMP-приложение Android + iOS; релиз — в магазины |

Библиотеки: `golibinfra` (Go-киты для Go-сервисов) и `pylibinfra` (Python-киты;
потребитель — `telegram-bot-template`). Итого 7 шаблонов и 2 библиотеки; этот репо
библиотеки экосистемы не потребляет.

## Как сюда приходят

1. **Старт проекта — `<org>/strategy`.** Там проектируется всё, что можно, в том
   числе FSD-карта поверхности, которую реализует этот репо.
2. **Дальше всё идёт из `<org>/infra` — операционного хаба.** Сквозная задача —
   план-программа в `.claude/plans/` инфры; оттуда агент приходит сюда
   (`../frontend`) с фазой, ведёт её планом здесь (`/plan`, `parent: infra:<slug>`) и
   работает **обвязкой этого репо**: `CLAUDE.md`, скиллы, гейт `pnpm check`. Репо
   останавливается на образе в registry (`/release`); выкатка тега — только из
   `<org>/infra` (`make bump`). Изменение дизайна по ходу — тоже агентом из хаба, в
   `../strategy` его скиллами.
3. **Прямой заход сюда** — нормальный режим: репо работает своей обвязкой, а
   последствия для соседей уходят handoff-блоком — для `<org>/infra` это
   INFRA-HANDOFF, который печатает `/release` (новый образ, новые runtime-ключи env).

Деплой-команды чужих репо (`make ship`, `make bump`, ssh) отсюда не запускаются.

## Что репо берёт и отдаёт

| источник | потребитель | что |
|---|---|---|
| `strategy`: `docs/projects/<slug>/fsd/<surface>/` | этот репо | **stable-карта слайсов** — вход `/scaffold` и `/de-template`; `src/`-пути выводятся из kind + slug |
| `strategy`: `docs/projects/<slug>/{interface,screens}/<surface>/` + продуктовые файлы | этот репо | контекст: ситуации, экраны, блоки, данные |
| `strategy`: `docs/projects/<slug>/services/<svc>/domains/` | этот репо | DDD-сущности — источник entities и mock-слоя |
| `backend`: OpenAPI (`/openapi.json`) | этот репо | контракт HTTP API — референс для рукописных zod-схем |
| этот репо: образ `<registry>/<org>/frontend:vX.Y.Z` | `infra` | `/release` пушит; выкатка — `make bump SVC=frontend TAG=<v>` в `<org>/infra` (правит `FRONTEND_TAG` в `.env` VPS) |

Registry — Gitea `git.stit.tech` (путь образа — `docs/stack/service.md § Идентичность`).
Резолв strategy — поля `project-slug` / `strategy-path` (дефолт `../strategy`) /
`surface` в `docs/stack/service.md`. Чтение strategy — read-only и одностороннее:
этот репо в него не пишет.

## Шаблон vs проект

Шаблоны живут под оргом `stit-core` и форкаются через Gitea «Use this template».
Этот фронт-шаблон проходит `/init-service` → `/de-template`, после чего
становится независимым проектом.

Канон карты экосистемы и флоу — `docs/reference/ecosystem.md` инфра-репо
(`../infra/docs/reference/ecosystem.md`, шаблон `project-infra-template-compose`).
