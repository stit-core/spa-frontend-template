import { defineConfig } from 'steiger/config'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      'fsd/forbidden-imports': 'error',
      'fsd/no-public-api-sidestep': 'error',
      'fsd/public-api': 'error',
      'fsd/insignificant-slice': 'warn',
      'fsd/excessive-slicing': 'warn',
      'fsd/ambiguous-slice-names': 'error',
      'fsd/inconsistent-naming': 'error',
      'fsd/no-segmentless-slices': 'error',
      'fsd/no-reserved-folder-names': 'error',
      'fsd/typo-in-layer-name': 'error',
    },
  },
  {
    files: ['src/shared/api/__generated__/**', 'src/app/router/routeTree.gen.ts'],
    rules: { 'fsd/public-api': 'off' },
  },
])
