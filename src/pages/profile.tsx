import { createFileRoute, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PageHeader } from '@/shared/ui/page-header'
import { sessionQueryOptions, type Session } from '@/entities/session'
import { UserCard, userQueryOptions } from '@/entities/user'

export const Route = createFileRoute('/profile')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(sessionQueryOptions)
    if (!session) throw redirect({ to: '/login' })
    return { session }
  },
  loader: async ({ context }) => {
    const session = context.session as Session
    await context.queryClient.ensureQueryData(userQueryOptions(session.userId))
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { session } = Route.useRouteContext()
  return (
    <>
      <PageHeader title="Профиль" />
      <Suspense fallback={<p>Загрузка…</p>}>
        <ProfileBody userId={(session as Session).userId} />
      </Suspense>
    </>
  )
}

function ProfileBody({ userId }: { userId: string }) {
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))
  return <UserCard user={user} />
}
