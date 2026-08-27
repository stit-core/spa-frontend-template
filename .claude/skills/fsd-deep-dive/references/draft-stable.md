# Промоушн draft → stable

Контракт перевода артефакта `docs/fsd/<kind>.md` в `status: stable`. Зеркалит
аналогичный документ в `project-docs-template` `domain-deep-dive` (там живёт
DDD-проектирование, которое FSD мапит на слои).

## Чек-лист

1. **Все таблицы заполнены** (или явно `_нет_`):
   - `app.md` § Состав / Init-последовательность / Providers
   - `pages.md` § Карта pages / Связь с layouts / Guards и redirects
   - `widgets.md` § Карта widgets
   - `features.md` § Карта features / Cross-feature
   - `entities.md` § Карта entities / Schema и валидация
   - `shared-ui.md` § Карта shared/ui/
   - `shared-api.md` § HTTP-клиент / Контракт API / Mock-стратегия
   - `shared-lib.md` § Состав / i18n

2. **Generates непуст** — есть конкретные пути файлов, которые родит
   `/de-template` или `/scaffold` по этому артефакту.

3. **Маппинги проверены** на стороне источника (всё в папке проекта
   `../docs/projects/<slug>/`):
   - `features/<slice>.situation` → существует в
     `../docs/projects/<slug>/interface/situation.md`
   - `entities/<slice>.source` → существует в
     `../docs/projects/<slug>/domains/` или
     `../docs/projects/<slug>/interface/data-items.md`
   - `pages/<slice>.screen` → существует в
     `../docs/projects/<slug>/screens/screens/`
   - `widgets/<slice>.block` → существует в
     `../docs/projects/<slug>/screens/blocks/`

4. **Нет открытых `**blocker**`-вопросов** в `state/<kind>.md`
   (формат — `references/state-format.md`).

5. **Cross-kind согласованность**:
   - Каждая фича из `features.md` использует только сущности из `entities.md`
   - Каждая page из `pages.md` использует только widgets/features/entities из
     соответствующих карт
   - widgets из `widgets.md` имеют ≥2 page-референса в `pages.md` (иначе
     pages-first: вернуть в page-слайс)

## Эскалация при сомнении

Если на каком-то пункте сомнение — оставь строку в `## Открытые вопросы`
заметки `state/<kind>.md` (формат — `references/state-format.md`):

```
- <короткий falsifiable-вопрос>? (**blocker**)
```

И не промоушай в `stable`, пока не закрыта.
