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

Шаблоны `stit-core/*` форкаются в репо клиентской орги `<org>/*`. Проект — папка
`~/git/<org>/`: в её корне — карта проекта `CLAUDE.md` и общие настройки сессии, в
папках корня — форки орги sibling-checkout'ами (`../<name>`). Из корня ведётся вся
работа ([`project-root.md`](https://github.com/stit-core/project-infra-template-compose/blob/main/docs/reference/project-root.md)):

```
~/git/<org>/   ← корень проекта (<org>/project): CLAUDE.md, .claude/settings.json, local/
├─ strategy/   ← business-strategy-template
├─ infra/      ← project-infra-template-compose (хаб)
├─ frontend/   ← spa-frontend-template (этот репо)
├─ site/       ← seo-frontend-template (если есть)
├─ backend/    ← go-backend-template (если есть)
├─ <bot>/      ← telegram-bot-template (если есть)
└─ mobile/     ← mobile-template (если есть)
```

| шаблон → форк | роль |
|---|---|
| `business-strategy-template` → `<org>/strategy` | design-time source of truth: бизнес, AJTBD, SWOT, карта гипотез, продукты (vision/surface, interface, screens, fsd, telegram-bot-flow, mobile, services + domains), ИТ-периметр |
| `project-infra-template-compose` → `<org>/infra` | runtime проекта (docker-compose на VPS) и **хаб**: программы сквозных задач, выкатка тегов (`make bump`) |
| `go-backend-template` → `<org>/backend` | Go-сервис |
| `spa-frontend-template` → `<org>/frontend` | React SPA (кабинет, всё за логином) — этот репо |
| `seo-frontend-template` → `<org>/site` | Astro SEO-сайт (индексируемый контент) |
| `telegram-bot-template` → `<org>/<bot>` | Telegram-бот (Python, aiogram) |
| `mobile-template` → `<org>/mobile` | KMP-приложение Android + iOS; релиз — в магазины |

Библиотеки: `golibinfra` (Go-киты для Go-сервисов) и `pylibinfra` (Python-киты;
потребитель — `telegram-bot-template`). Итого 7 шаблонов и 2 библиотеки; этот репо
библиотеки экосистемы не потребляет.

## Как сюда приходят

1. **Корень проекта — первым.** Заводится папка `~/git/<org>/` с картой проекта
   `CLAUDE.md`; в неё клонируются все репо проекта (этот — в `frontend/`), и из неё
   ведётся вся работа — одной сессией Claude Code.
2. **Сначала проектирование — `<org>/strategy`.** До кода там проектируется всё, что
   можно, в том числе FSD-карта поверхности, которую реализует этот репо. Код
   начинается, когда проект продуман.
3. **Реализация — из корня.** Сессия корня (или её фоновый агент) приходит сюда, в
   `frontend/`, с задачей или фазой программы и работает **обвязкой этого репо**:
   сначала `CLAUDE.md` (с ним подхватываются правила и скиллы репо), дальше —
   скиллы и гейт `pnpm check`. Сквозная задача — программа в `.claude/plans/` хаба
   `<org>/infra`; её фаза ведётся планом здесь (`/plan`, `parent: infra:<slug>`).
   Репо останавливается на образе в registry (`/release`); выкатка тега — только
   через хаб (`make bump`). Изменение дизайна по ходу — в `strategy/`, скиллами
   strategy.
4. **Прямой заход сюда** (сессия в папке репо) — нормальный режим: репо работает
   своей обвязкой, а последствия для соседей уходят handoff-блоком — для хаба
   `<org>/infra` это INFRA-HANDOFF, который печатает `/release` (новый образ, новые
   runtime-ключи env).

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
