import { defineConfig } from '@playwright/test'

/**
 * E2E runs against the production build (`nuxt build` + `nuxt preview`, node-server output) on its own port,
 * so a `nuxt dev` server on :3000 is never picked up by mistake (reuseExistingServer would test the dev build).
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
    env: { PORT: String(PORT), NITRO_PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
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
