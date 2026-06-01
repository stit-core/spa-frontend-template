import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import { UserSchema, type User } from '../model/types'

export const userQueryKey = (id: string) => ['user', id] as const

export function userQueryOptions(id: string) {
  return queryOptions({
    queryKey: userQueryKey(id),
    queryFn: async (): Promise<User> => {
      const res = await apiClient.GET(`/api/v1/users/${id}` as never)
      if (!res.response.ok) throw new Error(`User fetch failed: ${res.response.status}`)
      return UserSchema.parse(res.data)
    },
  })
}
