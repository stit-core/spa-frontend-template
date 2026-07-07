# Roadmap

Единый план активной работы. Любое содержательное изменение идёт через секцию
здесь (skill `/plan`). План переживает `/clear`.

## Active

### Выпил внешней дизайн-системы, свой токен-слой

Внешней DS больше нет — компоненты пишутся в проекте, design-system-agnostic на
собственном токен-слое. Сделано: удалён `@stit/ui` (dep + `.npmrc` registry),
токены перенесены в `src/app/styles/index.css` (Tailwind v4 `@theme` + `@theme
inline` со scheme-переменными light/dark), снесён `shared/ui-lib` + rule/doc
`ui-lib-gaps`, добавлен rule `shared-ui`, доки/скиллы приведены к новой модели.

Остаётся:
- [ ] `pnpm install && pnpm check` — прогнать gate (deps не были установлены;
  проверить, что Tailwind резолвит все семантические утилиты `text-body-*`,
  `bg-action-*`, `border-divider`, `rounded-control` и dark-схема работает).
- После зелёного gate — удалить эту секцию (forward-only).

## Backlog

_пусто_
