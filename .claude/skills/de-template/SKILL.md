---
name: de-template
description: Развернуть форк spa-frontend-template в самостоятельный проект по stable-артефактам — локальный docs/stack и FSD-карта поверхности из соседнего <org>/strategy (docs/projects/<slug>/fsd/<surface>/) — имя пакета, README, runtime config, снятие META-файлов, свои слайсы через /scaffold и затем удаление reference-слайсов auth/profile/todos/theme. Используй, когда юзер просит развернуть фундамент или превратить форк шаблона в свой проект, и когда /init-service дошёл до этапа разворота (стек и нужные записи FSD-карты stable). Запускается один раз на форке и никогда — на каноническом репозитории шаблона.
---

# Skill: de-template (движок развёртывания)

Превращает форк шаблона в проект, который ничего не помнит про
`spa-frontend-template`. Читает **stable**-артефакты — локальный `docs/stack`
(секции `Generates`) и FSD-карту поверхности из соседнего `<org>/strategy`
(`<strategy-path>/docs/projects/<slug>/fsd/<surface>/`; резолв — поля в
`docs/stack/service.md`, дефолт `../strategy`) — и разворачивает фундамент
обычными правками рабочего дерева, которые юзер ревьюит как любой diff.

Запускается **один раз** на форке. Финал — зелёный `pnpm check` и проект
без следов шаблона. Стек или карта ещё не stable — сначала `/stack-deep-dive`
здесь и `/fsd-deep-dive` в `<org>/strategy`. Проект уже развёрнут (своё
`package.json#name`, reference-слайсы удалены) — это обычная работа через
`/smartdev`.

## Gate (проверить до любых правок)

1. **Не канонический шаблон.** `package.json#name` ещё
   `@stit/spa-frontend-template` и каталог — не временная копия/форк → СТОП.
   Спроси юзера явно подтвердить, что это форк/тест-копия: разворот
   переименовывает пакет и удаляет reference-слайсы.

2. **Артефакты stable.** Все 8 stack-kind имеют `status: stable`, все
   `Generates` непусты:
   ```bash
   for k in service runtime config routing api styling observability dependencies; do
     grep -q '^status: stable' "docs/stack/$k.md" || { echo "STOP: docs/stack/$k.md не stable"; exit 1; }
   done
   ```
   FSD-карта: `fsd/<surface>/` в strategy существует; записи, нужные первому
   развороту (Phase B), — `status: stable` (проверить по колонке `status`
   их таблиц; сомнение → `/fsd-audit <slug>` на стороне strategy).

3. **State stack-deep-dive чист** (blocker'ы FSD-карты живут в дереве state
   strategy — их проверяет его `/fsd-audit`):
   ```bash
   grep -RlE '\*\*blocker\*\*' .claude/skills/stack-deep-dive/state/ 2>/dev/null \
     && echo "STOP: открытые blocker'ы в state — добей сначала" \
     || echo "OK"
   ```

## Phase A — детерминированная механика

### A.1 Имя пакета

Источник: `docs/stack/service.md § Идентичность` (поля `scope`, `repository`).
`.claude/` исключён: скиллы по шаблонному имени отличают неразвёрнутый форк.

```bash
NEW_NAME=<scope из service.md>
git grep -lF '@stit/spa-frontend-template' -- . ':!.claude' | xargs sed -i "s|@stit/spa-frontend-template|$NEW_NAME|g"
pnpm install
```

Проверь `head -2 package.json` — `"name": "$NEW_NAME"`.

### A.2 README

Из `docs/stack/service.md`: имя, scope, назначение, ссылки на родственные
репо. Замени шаблонную шапку `README.md` на проектную. Убери упоминания
«шаблон»/«template»/«форкни».

### A.3 Runtime config

Новые ключи из `docs/stack/config.md § Runtime config keys` с дефолтами проекта
ложатся в три места контракта: Zod-схема `src/shared/config/index.ts`, генерация
`config.js` в `docker/nginx-entrypoint.sh` и блок `ENV` в `docker/Dockerfile`.
`public/config.js` остаётся пустой dev-заглушкой — в dev работают дефолты схемы.

### A.4 Strip шаблонной меты

- Удали `docs/getting-started.md` ([META]) вместе со ссылками на него
  (`README.md`, `docs/README.md`, `CLAUDE.md`)
- `docs/contributing.md` — оставь (система наследуется), переформулируй
  «шаблон» → имя проекта
- `.claude/plans/` — форк стартует без планов шаблона: только `backlog.md` с
  `_пусто_` (планы шаблона — не планы проекта)

## Phase B — свои слайсы

По stable-записям FSD-карты strategy
(`<strategy-path>/docs/projects/<slug>/fsd/<surface>/`) чейнить `/scaffold`
для собственных слайсов:

- `entities/*` из `entities.md` карты (по таблице)
- `features/*` из `features.md`
- `widgets/*` из `widgets.md`
- `pages/*` из `pages.md`

После каждого `/scaffold` — `pnpm steiger` должен оставаться зелёным.

## Phase C — prune reference-слайсов

Учебные слайсы шаблона — живой образец, поэтому удаляются только после Phase B,
когда свои слайсы сгенерированы и работают. Что удалить, что заменить и как
пересобрать mock-слой — чеклист **`references/prune.md`**.

## Финал

`pnpm check` зелёный. Сообщи юзеру: онбординг закрыт, дальше через
`/smartdev` → `/plan` → `/scaffold`.
