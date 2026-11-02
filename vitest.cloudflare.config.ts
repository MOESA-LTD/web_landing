import { defineConfig } from 'vitest/config'

/**
 * Checks on the Cloudflare Pages build (`dist/`): `NITRO_PRESET=cloudflare-pages npm run build && npm run test:cloudflare`.
 * Kept out of `npm test` (vitest.config.ts, tests/unit) so unit tests pass on a fresh checkout without a build.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/cloudflare/**/*.test.ts'],
  },
})
