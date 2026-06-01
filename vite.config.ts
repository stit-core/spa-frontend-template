import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import lingui from '@lingui/vite-plugin'
import { analyzer } from 'vite-bundle-analyzer'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_TARGET ?? 'http://localhost:8080'

  return {
    plugins: [
      TanStackRouterVite({
        routesDirectory: 'src/pages',
        generatedRouteTree: 'src/app/router/routeTree.gen.ts',
        routeFileIgnorePrefix: '-',
      }),
      react({
        babel: {
          plugins: [
            ['babel-plugin-react-compiler', { compilationMode: 'all' }],
            '@lingui/babel-plugin-lingui-macro',
          ],
        },
      }),
      tailwindcss(),
      lingui(),
      mode === 'analyze' && analyzer(),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      port: 5173,
      proxy:
        env.VITE_API_MODE === 'real'
          ? {
              '/api': {
                target: apiTarget,
                changeOrigin: true,
                secure: false,
              },
            }
          : undefined,
    },

    build: {
      target: 'es2024',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            router: ['@tanstack/react-router'],
            query: ['@tanstack/react-query'],
          },
        },
      },
    },
  }
})
