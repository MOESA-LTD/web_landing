import { defineConfig } from 'vitest/config'

/**
 * Acceptance checks against the production build (`.output/`): `npm run build && npm run test:acceptance`.
 * Kept out of `npm test` (vitest.config.ts, tests/unit) so unit tests pass on a fresh checkout without a build.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/acceptance/**/*.test.ts'],
    testTimeout: 60_000,
  },
})
