import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '@/shared/api'
import { TodoSchema, type NewTodo, type Todo } from '../model/types'

export const todosQueryKey = ['todos'] as const

export const todosQueryOptions = queryOptions({
  queryKey: todosQueryKey,
  queryFn: async (): Promise<Todo[]> => {
    const res = await apiClient.GET('/api/v1/todos' as never)
    if (!res.response.ok) throw new Error(`Todos fetch failed: ${res.response.status}`)
    return z.array(TodoSchema).parse(res.data)
  },
})

export function useCreateTodoMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: NewTodo): Promise<Todo> => {
      const res = await apiClient.POST('/api/v1/todos' as never, { body: input as never })
      if (!res.response.ok) throw new Error('Create todo failed')
      return TodoSchema.parse(res.data)
    },
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: todosQueryKey })
      const previous = qc.getQueryData<Todo[]>(todosQueryKey) ?? []
      const optimistic: Todo = {
        id: `optimistic-${Date.now()}`,
        title: input.title,
        done: false,
        createdAt: new Date().toISOString(),
      }
      qc.setQueryData<Todo[]>(todosQueryKey, [optimistic, ...previous])
      return { previous }
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) qc.setQueryData(todosQueryKey, ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: todosQueryKey }),
  })
}

export function useToggleTodoMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const res = await apiClient.PATCH(`/api/v1/todos/${id}` as never, {
        body: { done } as never,
      })
      if (!res.response.ok) throw new Error('Toggle todo failed')
      return TodoSchema.parse(res.data)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: todosQueryKey }),
  })
}

export function useDeleteTodoMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.DELETE(`/api/v1/todos/${id}` as never)
      if (!res.response.ok) throw new Error('Delete todo failed')
    },
    onSettled: () => qc.invalidateQueries({ queryKey: todosQueryKey }),
  })
}
