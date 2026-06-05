// Минимальная склейка классов. Если в @sftbmb/ui экспортируется свой cn —
// предпочитаем его (см. shared/ui-lib дисциплину).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
