# Промоушн draft → stable

Контракт перевода артефакта `docs/fsd/<kind>.md` в `status: stable`. Зеркалит
аналогичный документ в go-backend `domain-deep-dive`.

## Чек-лист

1. **Все таблицы заполнены** (или явно `_нет_`):
   - `app.md` § Состав / Init-последовательность / Providers
   - `pages.md` § Карта pages / Связь с layouts / Guards
   - `widgets.md` § Карта widgets
   - `features.md` § Карта features
   - `entities.md` § Карта entities / Schema и валидация
   - `shared-ui.md` § Карта shared/ui/ / Карта shared/ui-lib/
   - `shared-api.md` § OpenAPI codegen / Mock-стратегия / Сущности мока
   - `shared-lib.md` § Состав / i18n

2. **Generates непуст** — есть конкретные пути файлов, которые родит
   `/de-template` или `/scaffold` по этому артефакту.

3. **Маппинги проверены** на стороне источника:
   - `features/<slice>.situation` → существует в `../docs/interface/situation.md`
   - `entities/<slice>.source` → существует в `../docs/domains/` или
     `data-items.md`
   - `pages/<slice>.screen` → существует в `../docs/screens/screens/`
   - `widgets/<slice>.block` → существует в `../docs/screens/blocks/`

4. **Нет открытых `**blocker**`-вопросов** в `state/<kind>-questions.md`.

5. **Cross-kind согласованность**:
   - Каждая фича из `features.md` использует только сущности из `entities.md`
   - Каждая page из `pages.md` использует только widgets/features/entities из
     соответствующих карт
   - widgets из `widgets.md` имеют ≥2 page-референса в `pages.md` (иначе
     pages-first: вернуть в page-слайс)

## Эскалация при сомнении

Если на каком-то пункте сомнение — оставь в `state/<kind>-questions.md`
строку:

```
**blocker** | <дата> | <короткий вопрос> | _ждём решения юзера_
```

И не промоушай в `stable`, пока не закрыта.
