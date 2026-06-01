import type { DB } from '../db'
import { makeTodo, makeUser } from '../seeds/factories'

export type Scenario = 'empty' | 'populated' | 'authenticated' | 'error'

export function loadScenario(db: DB, scenario: Scenario): void {
  resetDb(db)
  switch (scenario) {
    case 'empty':
      return
    case 'populated':
      seedPopulated(db)
      return
    case 'authenticated':
      seedAuthenticated(db)
      return
    case 'error':
      return
  }
}

function resetDb(db: DB) {
  db.user.deleteMany({ where: {} })
  db.session.deleteMany({ where: {} })
  db.todo.deleteMany({ where: {} })
}

function seedPopulated(db: DB) {
  const me = makeUser(db, { email: 'me@example.com', password: 'password123', name: 'Я' })
  for (let i = 0; i < 5; i += 1) makeUser(db)
  for (let i = 0; i < 3; i += 1) makeTodo(db, me.id, false)
  for (let i = 0; i < 2; i += 1) makeTodo(db, me.id, true)
}

function seedAuthenticated(db: DB) {
  const me = makeUser(db, { email: 'me@example.com', password: 'password123', name: 'Я' })
  db.session.create({
    id: 'session-bootstrap',
    userId: me.id,
    email: me.email,
    createdAt: new Date().toISOString(),
  })
  for (let i = 0; i < 3; i += 1) makeTodo(db, me.id, false)
}
