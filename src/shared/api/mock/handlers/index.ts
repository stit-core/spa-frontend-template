import type { DB } from '../db'
import { authHandlers } from './auth'
import { userHandlers } from './users'
import { todoHandlers } from './todos'
import { errorHandlers } from './error'

export function buildHandlers(db: DB, errorMode: boolean) {
  if (errorMode) return errorHandlers()
  return [...authHandlers(db), ...userHandlers(db), ...todoHandlers(db)]
}
