---
name: init-service
description: Оркестратор онбординга потребителя шаблона — ведёт путь форк → проектирование FSD (fsd-deep-dive) → проектирование стека (stack-deep-dive) → de-template → /scaffold собственных слайсов, пока проект не перестанет помнить про шаблон. Активируй когда юзер форкнул spa-frontend-template и говорит "/init-service", "онбординг", "развернуть SPA из шаблона", "с чего начать новый фронтенд", или когда видишь свежий форк (package.json#name всё ещё @sftbmb/spa-frontend-template, reference-слайсы auth/profile/todos/theme на месте). Сам не проектирует и не де-темплейтит — чейнит специализированные скиллы по порядку.
---

# Skill: init-service (онбординг-оркестратор)

Дирижёр пути «форк шаблона → свой проект». Не делает проектирование/генерацию
сам, а **ведёт по этапам и чейнит** специализированные скиллы. Один проход
доводит до проекта, который ничего не помнит про шаблон.

Полное описание пути для человека — `docs/getting-started.md`; этот скил его
исполняет.

## Когда применять

- "/init-service" / «онбординг» / «развернул форк, что дальше»
- Свежий форк: `package.json#name` ещё `@sftbmb/spa-frontend-template`,
  reference-слайсы `features/auth`, `pages/profile`, `pages/todos`,
  `features/theme` на месте
- Юзер: «хочу развернуть свой SPA из шаблона»

## Когда НЕ применять

- Проект уже де-темплейтизирован (своё имя пакета, reference-слайсы удалены) —
  это обычный день-в-день, иди в `/smartdev`
- Юзер хочет добавить слайс/page/widget в уже-свой проект — это `/scaffold`,
  не онбординг

## Pre-flight

- [ ] Форк создан, репо склонирован (Gitea → **Use this template** → `<org>/<service>-frontend`)
- [ ] `pnpm install` прогнан
- [ ] `pnpm prepare` поставил lefthook-хуки
- [ ] Если нет — подскажи шаги 0 из `docs/getting-started.md` и дальше не иди

## Этапы (чейнить по порядку, не делать самому)

### 1. Спроектировать FSD → `/fsd-deep-dive`

- Скопировать шаблоны `docs/fsd/_templates/*.md` в `docs/fsd/*.md` (если нет)
- `/fsd-deep-dive` читает соседнюю папку проекта `../docs/projects/<slug>/`
  (product-файлы в корне + вложенные `interface/`, `domains/`, `screens/`) как контекст
- Чейнить волнами вопросов inside-out до `status: stable` всех 8 артефактов
- Gate: все `status: stable`, все `Generates` непусты

### 2. Спроектировать стек → `/stack-deep-dive`

- Скопировать шаблоны `docs/stack/_templates/*.md` в `docs/stack/*.md`
- `/stack-deep-dive` ведёт волнами поверх базовых выборов шаблона
- Gate: все 8 артефактов `status: stable`, `Generates` непусты

### 3. Развернуть фундамент → `/de-template`

- Gate перед запуском: FSD и stack `stable`, нет открытых `**blocker**`-вопросов
- `/de-template` читает stable-артефакты и разворачивает по `Generates`:
  - `package.json#name`
  - `README.md`
  - `docker/nginx-entrypoint.sh` env defaults
  - `vite.config.ts#proxy.target` (если real-режим)
  - Prune reference-слайсов (`auth`, `profile`, `todos`, `theme`)
  - Удаление `docs/getting-started.md` (META)

### 4. Свои слайсы → `/scaffold`

Когда фундамент развёрнут — чейнить `/scaffold` под каждый собственный слайс,
спроектированный в `docs/fsd/*`:

- `entities/*` — из `docs/fsd/entities.md`
- `features/*` — из `docs/fsd/features.md`
- `widgets/*` — из `docs/fsd/widgets.md`
- `pages/*` — из `docs/fsd/pages.md`

### 5. Финал

`pnpm check` зелёный → проект больше не помнит про шаблон. Сообщи юзеру:
онбординг закрыт, дальше обычный флоу через `/smartdev`. `docs/getting-started.md`
(META) удалён.

## Что init-service НЕ делает

- ❌ Не интервьюирует по FSD/стеку сам — это `/fsd-deep-dive`, `/stack-deep-dive`
- ❌ Не правит фундамент руками и не де-темплейтит — это `/de-template`
- ❌ Не запускает `/de-template` до зелёных gate'ов
- ❌ Не пропускает проектирование ради «быстро сгенерить» — docs первичны

## Anti-patterns

- ❌ Кодить `src/` до того как спроектированы артефакты
- ❌ Удалять reference-слайсы до того как свои готовы (теряешь живой образец)
- ❌ Дублировать процедуру deep-dive внутри этого скилла
