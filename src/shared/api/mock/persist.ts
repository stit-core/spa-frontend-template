import type { DB } from './db'

const KEY = 'app.mock.db.v1'

interface Snapshot {
  users: ReturnType<DB['user']['getAll']>
  sessions: ReturnType<DB['session']['getAll']>
  todos: ReturnType<DB['todo']['getAll']>
}

export function loadSnapshot(db: DB): boolean {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return false
    const snap = JSON.parse(raw) as Snapshot
    snap.users.forEach((u) => db.user.create(u))
    snap.sessions.forEach((s) => db.session.create(s))
    snap.todos.forEach((t) => db.todo.create(t))
    return true
  } catch {
    return false
  }
}

export function saveSnapshot(db: DB): void {
  const snap: Snapshot = {
    users: db.user.getAll(),
    sessions: db.session.getAll(),
    todos: db.todo.getAll(),
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(snap))
  } catch {
    // out-of-quota — игнорируем
  }
}

export function clearSnapshot(): void {
  localStorage.removeItem(KEY)
}
