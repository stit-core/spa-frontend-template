---
name: init-service
description: Онбординг свежего форка spa-frontend-template — ведёт путь форк → привязка к FSD-карте поверхности в соседнем <org>/strategy → стек через /stack-deep-dive → разворот через /de-template, пока проект не перестанет помнить про шаблон. Используй, когда юзер только что форкнул шаблон или спрашивает, с чего начать новый фронтенд из него, и когда видишь неразвёрнутый форк (package.json#name — @stit/spa-frontend-template, reference-слайсы auth/profile/todos/theme на месте). Сам не проектирует и не разворачивает — по очереди передаёт этапы профильным скиллам.
---

# Skill: init-service (онбординг-оркестратор)

Дирижёр пути «форк шаблона → свой проект»: ведёт по этапам, а каждый этап
выполняет профильный скилл. Этап не начинается, пока гейт предыдущего не зелёный —
артефакты первичны, код пишется по ним. Полное описание пути для человека —
`docs/getting-started.md`; этот скилл его исполняет.

Проект уже развёрнут (своё имя пакета, reference-слайсы удалены) — это обычная
работа через `/smartdev`; новый слайс в развёрнутом проекте — `/scaffold`.

## Pre-flight

- [ ] Форк создан, репо склонирован (Gitea → **Use this template** → `<org>/frontend`)
      рядом с `<org>/strategy`
- [ ] `pnpm install` прогнан
- [ ] `pnpm prepare` поставил lefthook-хуки
- [ ] Если нет — подскажи шаг 0 из `docs/getting-started.md` и дальше не иди

## Этапы

### 1. Привязаться к FSD-карте в `<org>/strategy`

- FSD-карта поверхности проектируется в соседнем `<org>/strategy`
  (`docs/projects/<slug>/fsd/<surface>/`, его `/fsd-deep-dive`), не здесь
- Проверить sibling-checkout: `../strategy` (или `strategy-path`) существует
  и слой `fsd/<surface>/` заведён. Нет — next-step юзеру: «спроектируй
  FSD-карту в `<org>/strategy` (`/fsd-deep-dive`) и вернись», дальше не идти
- Записать `project-slug` / `strategy-path` / `surface` в
  `docs/stack/service.md` — по ним `/scaffold` и `/de-template` найдут карту
- Gate: записи карты, нужные первому развороту, — `status: stable`

### 2. Спроектировать стек → `/stack-deep-dive`

- Скилл заводит `docs/stack/*.md` из `docs/stack/_templates/` и ведёт волнами
  поверх базовых выборов шаблона
- Gate: все 8 артефактов `status: stable`, `Generates` непусты

### 3. Развернуть фундамент → `/de-template`

- Gate перед запуском: стек stable; stable-записи FSD-карты в strategy; нет
  открытых `(**blocker**)` в state `/stack-deep-dive`
- `/de-template` по stable-артефактам переименовывает пакет, пишет README и
  runtime config, снимает META-файлы шаблона, раскладывает свои слайсы через
  `/scaffold` и после этого удаляет reference-слайсы

### 4. Финал

`pnpm check` зелёный → проект самостоятельный и про шаблон не помнит. Сообщи юзеру:
онбординг закрыт, дальше обычный флоу через `/smartdev`; новые stable-записи
FSD-карты — `/scaffold`.

Сам init-service артефакты и код не пишет: FSD-карта — в `<org>/strategy`,
стек — `/stack-deep-dive`, фундамент — `/de-template`, слайсы — `/scaffold`.
