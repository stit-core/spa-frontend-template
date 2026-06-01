// TODO: backend proxy. fsd/stack-deep-dive решает, активировать ли.
// Идея: фронт батчит OTel spans / logs и шлёт на /api/telemetry — бэк
// форвардит в OTel-collector со своим service-token. Так токен не светится
// в браузере и коллектор доверяет только бэкенду.

export function sendTelemetry(_event: unknown): void {
  // noop
}
