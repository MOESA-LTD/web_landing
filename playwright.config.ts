import { defineConfig } from '@playwright/test'

/**
 * E2E runs against the production build (`nuxt build` + `nuxt preview`, node-server output) on its own port.
 * A server already on that port is never reused: the run fails instead of silently testing a stale or dev build.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100)
const baseURL = `http://localhost:${PORT}`
/**
 * The same build served a second time with NUXT_PUBLIC_LEGAL_REVIEW_NOTES=true, as on a Pages Preview deployment
 * (tests/e2e/legal-review-notes.spec.ts, which derives the same port). The legal pages render per request, so the
 * runtime flag applies. Playwright starts the web servers in order, so this one starts after the first has built.
 */
const REVIEW_NOTES_PORT = PORT + 1

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL,
  },
  webServer: [
    {
      // NUXT_PUBLIC_LEGAL_REVIEW_NOTES is cleared so the build and this server are the production default (flag off).
      command: 'npm run build && npm run preview',
      url: baseURL,
      // Nitro's node-server output reads PORT; NITRO_PORT wins over it if set, so set both.
      // CONTACT_TRUST_XFF lets the direct API tests give each call its own client IP (X-Forwarded-For): off Cloudflare the
      // contact route ignores CF-Connecting-IP, and every call would share the socket address.
      env: { PORT: String(PORT), NITRO_PORT: String(PORT), CONTACT_TRUST_XFF: 'true', NUXT_PUBLIC_LEGAL_REVIEW_NOTES: '' },
      reuseExistingServer: false,
      timeout: 300_000,
    },
    {
      command: 'npm run preview',
      url: `http://localhost:${REVIEW_NOTES_PORT}`,
      env: { PORT: String(REVIEW_NOTES_PORT), NITRO_PORT: String(REVIEW_NOTES_PORT), NUXT_PUBLIC_LEGAL_REVIEW_NOTES: 'true' },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
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
