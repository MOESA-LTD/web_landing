import { defineConfig } from '@playwright/test'

/**
 * E2E runs against the production build (`nuxt build` + `nuxt preview`, node-server output) on its own port.
 * A server already on that port is never reused: the run fails instead of silently testing a stale or dev build.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100)
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL,
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: baseURL,
    // Nitro's node-server output reads PORT; NITRO_PORT wins over it if set, so set both.
    // CONTACT_TRUST_XFF lets the direct API tests give each call its own client IP (X-Forwarded-For): off Cloudflare the
    // contact route ignores CF-Connecting-IP, and every call would share the socket address.
    env: { PORT: String(PORT), NITRO_PORT: String(PORT), CONTACT_TRUST_XFF: 'true' },
    reuseExistingServer: false,
    timeout: 300_000,
  },
  projects: [
    {
      name: 'desktop',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 } },
    },
  ],
})
