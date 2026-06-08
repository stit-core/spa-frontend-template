---
name: de-template
description: Развернуть форк spa-frontend-template в самостоятельный проект по stable-артефактам docs/{fsd,stack} — переименовать пакет, обновить README, runtime config defaults, nginx entrypoint, prune reference-слайсов auth/profile/todos/theme. Активируй когда юзер форкнул шаблон и говорит "/de-template", "разверни фундамент", "де-темплейтизируй", "сделай из шаблона свой проект", или когда init-service дошёл до этапа 3 (FSD+стек спроектированы и stable). Движок skill-only: и механика, и wiring — reviewable edits под этой процедурой. НЕ запускать на каноническом репозитории шаблона.
---

# Skill: de-template (движок развёртывания)

Превращает форк шаблона в проект, который ничего не помнит про
`spa-frontend-template`. Читает **stable** `docs/{fsd,stack}` и разворачивает
фундамент по секциям `Generates`.

Запускается **один раз** на форке. Финал — зелёный `pnpm check` и проект
без следов шаблона.

## Когда применять

- "/de-template" / «разверни фундамент» / «сделай из шаблона свой проект»
- `/init-service` дошёл до этапа 3 (FSD+стек spable, валидаторы зелёные)

## Когда НЕ применять

- FSD/стек ещё не `stable` — сначала `/fsd-deep-dive` + `/stack-deep-dive`
- Проект уже де-темплейтизирован (свой `package.json#name`, reference-слайсы
  удалены) — обычный день-в-день через `/smartdev`
- **Канонический репозиторий шаблона** — никогда (guard ниже)

## Gate (проверить ДО любых правок)

1. **Не канонический шаблон.** `package.json#name` ещё
   `@stit/spa-frontend-template` И каталог — не временная копия/форк → СТОП.
   Спроси юзера явно подтвердить, что это форк/тест-копия.

2. **Артефакты stable.** Все 8 FSD-kind и все 8 stack-kind имеют
   `status: stable`, все `Generates` непусты:
   ```bash
   for k in app pages widgets features entities shared-ui shared-api shared-lib; do
     grep -q '^status: stable' "docs/fsd/$k.md" || { echo "STOP: docs/fsd/$k.md не stable"; exit 1; }
   done
   for k in service runtime config routing api styling observability dependencies; do
     grep -q '^status: stable' "docs/stack/$k.md" || { echo "STOP: docs/stack/$k.md не stable"; exit 1; }
   done
   ```

3. **State deep-dive скилов чист**:
   ```bash
   grep -RlE '\*\*blocker\*\*' .claude/skills/{fsd,stack}-deep-dive/state/ 2>/dev/null \
     && echo "STOP: открытые blocker'ы в state — добей сначала" \
     || echo "OK"
   ```

## Phase A — детерминированная механика

### A.1 Имя пакета и module path

Источник: `docs/stack/service.md § Идентичность` (поля `scope`, `repository`).

```bash
NEW_NAME=<scope из service.md>
git grep -lF '@stit/spa-frontend-template' | xargs sed -i "s|@stit/spa-frontend-template|$NEW_NAME|g"
pnpm install
```

Проверь `head -2 package.json` — `"name": "$NEW_NAME"`.

### A.2 README

Из `docs/stack/service.md`: имя, scope, назначение, ссылки на родственные
репо. Замени шаблонную шапку `README.md` на проектную. Убери упоминания
«шаблон»/«template»/«форкни».

### A.3 Runtime config defaults

Из `docs/stack/config.md § Runtime config keys`: обнови
`docker/nginx-entrypoint.sh` и `public/config.js` (dev-заглушка) — добавь
новые ключи с дефолтами проекта. Обнови `src/shared/config/index.ts`
(Zod-схему) под новые поля.

### A.4 Strip шаблонной меты

- Удали `docs/getting-started.md` ([META])
- `docs/contributing.md` — оставь (система наследуется), переформулируй
  «шаблон» → имя проекта
- Сбрось `.claude/plans/roadmap.md` к пустому fork-start (history шаблона —
  не история форка)

### A.5 Prune reference-слайсов

Учебные слайсы `features/auth`, `pages/profile`, `pages/todos`,
`features/theme`, `features/create-todo`, `entities/session`, `entities/user`,
`entities/todo` — удаляются **после того как свои слайсы спроектированы и
сгенерированы** (иначе теряешь живой образец). Полный чеклист prune —
см. **`references/prune.md`**.

## Phase B — doc-driven wiring

По stable-артефактам `docs/fsd/*` чейнить `/scaffold` для собственных слайсов:

- `entities/*` из `docs/fsd/entities.md` (по таблице)
- `features/*` из `docs/fsd/features.md`
- `widgets/*` из `docs/fsd/widgets.md`
- `pages/*` из `docs/fsd/pages.md`

После каждого `/scaffold` — `pnpm steiger src` должен оставаться зелёным.

## Финал

`pnpm check` зелёный. Сообщи юзеру: онбординг закрыт, дальше через
`/smartdev` → `/plan` → `/scaffold`.
