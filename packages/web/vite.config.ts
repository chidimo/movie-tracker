import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const omdbApiKey = env.OMDB_API_KEY

  return {
    plugins: [
      devtools(),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      viteReact(),
      {
        name: 'omdb-dev-proxy',
        configureServer(server) {
          server.middlewares.use('/api/omdb', async (req, res, next) => {
            if (!omdbApiKey) {
              res.statusCode = 500
              res.setHeader('content-type', 'text/plain')
              res.end('OMDB API key is not configured.')
              return
            }

            if (!req.url) {
              next()
              return
            }

            const url = new URL(req.url, 'http://localhost')
            url.searchParams.set('apikey', omdbApiKey)

            try {
              const omdbRes = await fetch(`https://www.omdbapi.com/${url.search}`)
              res.statusCode = omdbRes.status
              res.setHeader(
                'content-type',
                omdbRes.headers.get('content-type') || 'application/json',
              )
              res.end(await omdbRes.text())
            } catch (error) {
              res.statusCode = 502
              res.setHeader('content-type', 'text/plain')
              res.end(
                error instanceof Error
                  ? error.message
                  : 'Failed to reach OMDB.',
              )
            }
          })
        },
      },
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
