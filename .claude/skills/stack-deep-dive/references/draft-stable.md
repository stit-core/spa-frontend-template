# Промоушн draft → stable (stack)

Контракт перевода артефакта `docs/stack/<kind>.md` в `status: stable`.

## Чек-лист

1. **Обязательные секции kind'а** (`references/field-checklists.md`) заполнены
   или явно `_нет_`.

2. **Generates непуст** — конкретные файлы, которые правит `/de-template`.

3. **Cross-kind согласованность**:
   - `config.md#API_BASE_URL` совпадает с тем, что использует `shared/config`
   - `api.md#Контракт API` описывает, где живут zod-схемы
   - `observability.md#DSN` (если активен) — есть в `config.md`
   - `dependencies.md` не противоречит установленному `package.json`

4. **Нет открытых `(**blocker**)`-вопросов** в `state/<kind>.md`
   (формат — `references/state-format.md`).

## Эскалация при сомнении

Сомнение — не промоушн: `(**blocker**)`-строка в `## Открытые вопросы` заметки
`state/<kind>.md`.
