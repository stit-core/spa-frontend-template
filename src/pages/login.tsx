import { createFileRoute, redirect } from '@tanstack/react-router'
import { PageHeader } from '@/shared/ui/page-header'
import { LoginForm } from '@/features/auth'
import { sessionQueryOptions } from '@/entities/session'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(sessionQueryOptions)
    if (session) throw redirect({ to: '/profile' })
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <>
      <PageHeader title="Вход" />
      <LoginForm />
    </>
  )
}
