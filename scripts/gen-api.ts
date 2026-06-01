#!/usr/bin/env tsx
// Тонкая обёртка над @hey-api/openapi-ts. Источник схемы — env OPENAPI_URL
// (например http://localhost:8080/openapi.json) или путь к локальному файлу
// (./openapi.json).
import { createClient } from '@hey-api/openapi-ts'

const input = process.env.OPENAPI_URL ?? './openapi.json'
const output = 'src/shared/api/__generated__'

console.info(`[gen:api] input=${input} → output=${output}`)

await createClient({
  input,
  output: {
    path: output,
    format: 'biome',
    lint: false,
  },
  plugins: [
    '@hey-api/client-fetch',
    '@hey-api/sdk',
    '@hey-api/typescript',
    {
      name: '@tanstack/react-query',
      queryOptions: true,
      mutationOptions: true,
    },
    'zod',
  ],
})

console.info('[gen:api] done')
