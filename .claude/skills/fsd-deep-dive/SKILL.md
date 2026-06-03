---
name: fsd-deep-dive
description: Проектирование FSD-карты приложения через интерактивные волны вопросов. Заполняет 8 артефактов docs/fsd/{app,pages,widgets,features,entities,shared-ui,shared-api,shared-lib}.md до status: stable, опираясь на проектную аналитику из ../docs/projects/<slug>/ (product-файлы в корне папки проекта + вложенные interface/domains/screens). Активируй когда юзер говорит "/fsd-deep-dive", "спроектируй FSD", "разложим по слоям", или когда оркестратор /init-service пришёл к этапу 1.
---

# Skill: fsd-deep-dive

Интервьюер по FSD-карте. Читает проектную аналитику в
`../docs/projects/<slug>/`, ведёт интерактивные волны вопросов, заполняет
8 артефактов в `docs/fsd/`.

## Когда применять

- "/fsd-deep-dive"
- Юзер: «спроектируем фронт», «разложим по слоям», «давай FSD-карту»
- Оркестратор `/init-service` пришёл к этапу 1

## Pre-flight

- [ ] Соседняя папка проекта `../docs/projects/<slug>/` существует — это
      контекст. Внутри: product-файлы (vision.md + persona/capability/surface/…)
      прямо в корне папки проекта, плюс вложенные `interface/`, `domains/`,
      `screens/`. `<slug>` — папка продукта в форке `<org>/docs`. Если нет —
      спроси юзера: «есть аналитика? где она лежит (какой `<slug>`)? без неё
      проектируем налегке (только из общих принципов)»
- [ ] `docs/fsd/*.md` существуют (или скопированы из `_templates/`)

## Режимы

| режим | когда |
|---|---|
| **A: с аналитикой** | в `../docs/projects/<slug>/interface/situation.md` есть ситуации, в `../docs/projects/<slug>/domains/` есть сущности → мапим напрямую |
| **B: с эскизом** | юзер принёс набросок экранов/сценариев → структурируем сам |
| **C: с нуля** | ничего нет — задаём базовые вопросы про сценарии |

Подробно по каждому режиму и каскадам удаления — `references/workflow-patterns.md`.

## Порядок проектирования

1. **`entities/`** — что за сущности (data-oriented) — из
   `../docs/projects/<slug>/domains/` или
   `../docs/projects/<slug>/interface/data-items.md`
2. **`features/`** — какие сценарии действий (action-oriented) — из
   `../docs/projects/<slug>/interface/situation.md`
3. **`pages/`** — какие маршруты — из
   `../docs/projects/<slug>/screens/screens/` или
   `../docs/projects/<slug>/interface/zone.md`
4. **`widgets/`** — какие переиспользуемые блоки — из
   `../docs/projects/<slug>/screens/blocks/`, только при ≥2 pages
5. **`app/`** — bootstrap-последовательность, провайдеры, layouts
6. **`shared-ui/`** — какие проектные обёртки нужны
7. **`shared-api/`** — HTTP-клиент, codegen, mock-стратегия
8. **`shared-lib/`** — i18n, observability, generic-утилиты

Обязательные секции, Generates и anti-patterns по каждому kind —
`references/field-checklists.md`.

## Волны вопросов (3-5 за раз)

Не задавай 10 вопросов сразу. Волна:

1. Что в `../docs/projects/<slug>/<source>` подсказывает: 3-5 кандидатов на слайсы
2. Спрашиваешь юзера: подтвердить / отбросить / переименовать
3. Записываешь в `docs/fsd/<kind>.md` (таблица + Generates)
4. Открытые вопросы / решения / следующие шаги → в `state/<kind>.md`
   (формат — `references/state-format.md`); блокирующий вопрос помечается
   `**blocker**`

## Промоушн draft → stable

См. `references/draft-stable.md` — единый чек-лист перевода артефакта
`docs/fsd/<kind>.md` в `status: stable` (заполненность таблиц, непустой
`Generates`, проверенные маппинги на `../docs/projects/<slug>/`, чистота
по `**blocker**` в `state/<kind>.md`, cross-kind согласованность).

## Что НЕ делать

- ❌ Не писать продуктовые/UX-формулировки от себя — это работа авторов
  `../docs/projects/<slug>/`
- ❌ Не «оптимизировать» — называй слайсы по сценарию из situation, а не
  изобретай аббревиатуры
- ❌ Не выносить в widget блоки с 1 референсом (pages-first)
- ❌ Не активировать `/de-template` до stable у всех 8
