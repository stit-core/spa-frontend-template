import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import { sessionQueryKey, SessionSchema } from '@/entities/session'
import type { LoginInput } from '../model/schema'

export function useLoginMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const res = await apiClient.POST('/api/v1/auth/login' as never, {
        body: input as never,
      })
      if (!res.response.ok) {
        if (res.response.status === 401) throw new Error('Неверный email или пароль')
        throw new Error(`Login failed: ${res.response.status}`)
      }
      return SessionSchema.parse(res.data)
    },
    onSuccess: (session) => {
      qc.setQueryData(sessionQueryKey, session)
      void qc.invalidateQueries()
    },
  })
}
