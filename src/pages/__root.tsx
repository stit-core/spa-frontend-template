import { createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AppShell } from '@/widgets/app-shell'

export const Route = createRootRoute({
  component: () => (
    <>
      <AppShell />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  ),
})
