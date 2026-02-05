import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    hookTimeout: 60000, // 60s timeout for hooks (MongoDB download)
    testTimeout: 10000, // 10s timeout for individual tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', 'tests'],
    },
    setupFiles: ['./tests/setup.ts'],
  },
});
