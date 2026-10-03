import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const fromRoot = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fromRoot('./src'),
      // The real package throws outside React Server Components.
      'server-only': fromRoot('./src/test/server-only-stub.ts'),
    },
  },
})
