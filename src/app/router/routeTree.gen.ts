// Этот файл генерируется @tanstack/router-vite-plugin при первом `pnpm dev` или `pnpm gen`.
// Закоммиченная заглушка-плейсхолдер с минимальным корнем, чтобы typecheck проходил
// до первого запуска. Реальный плагин перезапишет его деревом из src/pages/.

import { createRootRoute, createRoute } from '@tanstack/react-router'

const rootRoute = createRootRoute()
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/' })

export const routeTree = rootRoute.addChildren([indexRoute])
