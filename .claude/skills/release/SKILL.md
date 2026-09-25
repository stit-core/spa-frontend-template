---
name: release
description: Выпустить новую версию SPA — git-тег vX.Y.Z, сборка и пуш одного nginx-образа в registry (среда задаётся env контейнера) и INFRA-HANDOFF для <org>/infra (make bump SVC=frontend). Используй, когда юзер просит релиз или выпуск версии после закрытой задачи с зелёным pnpm check. Выкатка на VPS — не здесь, а в <org>/infra.
---

# Skill: release

Канонический release-флоу фронта. **Зона ответственности этого репо: код →
образ в registry; на этом STOP.** Образ пушится в `<registry>/<org>/frontend`
под тегом `vX.Y.Z` (registry-путь — из `docs/stack/service.md § Идентичность`,
по умолчанию `git.stit.tech/<org>/frontend`).

**Один образ на все среды.** Сборка `node → nginx` (см.
`docs/reference/deployment.md`); среда конфигурируется на старте контейнера через
env (`/config.js` → `window.__APP_CONFIG__`).

Дальше — **handoff** в `<org>/infra`: rollout выполняется там
(`make bump SVC=frontend TAG=<v>` — правит `FRONTEND_TAG` в `.env` VPS +
force-recreate). Деплой-команды чужих репо (`make ship`, `make bump`, ssh) отсюда
не запускаются — скилл печатает INFRA-HANDOFF-блок, его применяет оператор или
агент в `<org>/infra`.

Собрать образ локально для проверки, без релиза:
`docker buildx build -f docker/Dockerfile --load -t spa-local .`

## Pre-flight (до команд)

- [ ] Юзер явно сказал OK на релиз и назвал версию (semver по уровню изменений) —
      тег и пуш видны вне репо, версию не угадывай
- [ ] Ветка `main`, working tree clean — релиз собирается только из `main`
- [ ] `pnpm check` зелёный. Нет — СТОП → чинить, не релизить
- [ ] Оператор залогинен в registry (`docker login <host>` — вне процесса,
      не делай сам)

## Шаги

1. **Тег**: `git tag vX.Y.Z && git push origin vX.Y.Z`.
2. **Build+push** (Dockerfile лежит в `docker/`, не в корне — `-f` обязателен):
   ```bash
   docker buildx build -f docker/Dockerfile -t <registry>/<org>/frontend:vX.Y.Z --push .
   ```
3. **INFRA-HANDOFF** — напечатать блок:
   ```
   === INFRA HANDOFF · <org>/frontend vX.Y.Z ===
   WHAT:   новый образ <registry>/<org>/frontend:vX.Y.Z
   ACTION: в <org>/infra: make bump SVC=frontend TAG=vX.Y.Z
   ENV:    <новые runtime-env ключи, если появились; иначе "—">
   RISK:   <осознанные риски отката/совместимости; иначе "—">
   ===
   ```
   Новые runtime-ключи берутся из `docs/stack/config.md § Runtime config
   keys` — если контракт env расширился, инфра-админ должен дописать их в
   `.env` VPS до бампа.

Теги образа — только `vX.Y.Z` или `<sha>`: на VPS тег пинится в `.env`
(`FRONTEND_TAG`), и `:latest`/`:edge` сделали бы выкатку неповторяемой.
