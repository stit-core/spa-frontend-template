import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import { SessionSchema, type Session } from '../model/types'

export const sessionQueryKey = ['session'] as const

export const sessionQueryOptions = queryOptions({
  queryKey: sessionQueryKey,
  queryFn: async (): Promise<Session | null> => {
    const res = await apiClient.GET('/api/v1/session' as never)
    if (!res.response.ok) {
      if (res.response.status === 401) return null
      throw new Error(`Session fetch failed: ${res.response.status}`)
    }
    return SessionSchema.parse(res.data)
  },
  staleTime: 60_000,
})

export function useLogoutMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await apiClient.POST('/api/v1/auth/logout' as never)
    },
    onSuccess: () => {
      qc.setQueryData(sessionQueryKey, null)
      void qc.invalidateQueries()
    },
  })
}
