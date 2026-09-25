# Contributing — устройство `.claude`-системы

Этот файл описывает, как устроена агент-инфраструктура форка (наследуется при
разворачивании, сама в `/de-template` не удаляется).

## Структура

```
.claude/
├─ skills/           # процедуры (smartdev, plan, init-service, stack-deep-dive, de-template, scaffold, release)
├─ rules/            # правила по темам (forward-only, fsd-architecture, comments…)
├─ plans/           # активные планы <slug>.md и backlog.md (skill /plan)
└─ settings.json     # permissions.deny: publish, обход хуков, разрушительные git-команды, каталог авто-памяти
```

## Скилы

Каждый скил — папка с `SKILL.md` (фронтматтер `name`/`description` + тело
процедуры) и опциональными подкаталогами:

- `references/` — статичные документы, на которые ссылается процедура (checklists, prune-листы)
- `state/` — рабочая память сессии (открытые вопросы, прогресс волн), **коммитится**
  вместе с репо как shared проектная память между сессиями и тимейтами

## Правила

`.claude/rules/<topic>.md` — правила по темам. Область задаёт поле `paths:` во
frontmatter (glob-шаблоны): правило подгружается, когда агент читает совпавший
файл. Например, `rules/fsd-architecture.md` (`paths: ["src/**/*.ts", "src/**/*.tsx"]`)
приходит вместе с кодом из `src/`. Правило без `paths` грузится всегда, как
`CLAUDE.md` — так устроен `forward-only`.

## Память

Долгосрочное знание — только в репо: `CLAUDE.md`, правила, `state/` скилов,
`docs/`. Авто-память Claude Code не используется: запись в её каталог закрыта
deny-правилом `.claude/settings.json`.

## Forward-only

Все артефакты в `.claude/` — текущее состояние. Без журналов прошлого,
без «было/стало», без changelog'ов в prose. История — в `git log`.

## Изменение скилов

Правки `SKILL.md` идут через `/plan` — план в `.claude/plans/` — чтобы
изменение пережило `/clear` и было видно тимейтам.
