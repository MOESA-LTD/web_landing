/**
 * Renders public/og-default.png (1200×630), the default Open Graph / Twitter image of every page.
 *
 * An HTML template on the dark navy ground (#102C49) with the DS `bars` motif (LineMotif.vue: two slanted bars,
 * cyan over blue) and the typeset name "MOESA LTD." plus the EN descriptor from data/brand_tokens.json, in Manrope
 * (the self-hosted @fontsource-variable/manrope file, embedded as a data URI). No network access: everything the
 * page uses comes from the repo. Screenshot by Playwright's Chromium.
 *
 *   npm run og:image
 *
 * Commit the regenerated PNG.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'

const root = resolve(import.meta.dirname, '..')
const brand = JSON.parse(
  readFileSync(resolve(root, 'MOESA_Website_Package_v1.0/MOESA_Website_Package_v1.0/data/brand_tokens.json'), 'utf8'),
) as { name: string; descriptor_en: string; colors: Record<string, string> }
const font = readFileSync(
  resolve(root, 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'),
).toString('base64')

const { dark_navy: navy, cyan_accent: cyan, primary_blue: blue } = brand.colors

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Manrope'; font-weight: 200 800; src: url(data:font/woff2;base64,${font}) format('woff2'); }
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  body { background: ${navy}; color: #fff; font-family: 'Manrope', sans-serif; position: relative; }
  .bars { position: absolute; right: -40px; bottom: 72px; width: 560px; height: auto; }
  .text { position: absolute; left: 88px; top: 0; bottom: 80px; display: flex; flex-direction: column; justify-content: center; width: 760px; }
  .rule { width: 72px; height: 6px; background: ${cyan}; margin-bottom: 40px; }
  .name { font-size: 104px; font-weight: 800; letter-spacing: 0.02em; line-height: 1; margin: 0; }
  .descriptor { font-size: 34px; font-weight: 500; line-height: 1.35; margin: 32px 0 0; color: #d5e3ed; }
  .domain { position: absolute; left: 88px; bottom: 64px; font-size: 24px; font-weight: 600; letter-spacing: 0.06em; color: ${cyan}; }
</style>
</head>
<body>
  <svg class="bars" viewBox="0 0 696 142" aria-hidden="true">
    <polygon fill="${cyan}" points="75,0 535,0 520,59 60,59" />
    <polygon fill="${blue}" points="156,83 616,83 601,142 141,142" />
  </svg>
  <div class="text">
    <div class="rule"></div>
    <h1 class="name">${escape(brand.name)}</h1>
    <p class="descriptor">${escape(brand.descriptor_en)}</p>
  </div>
  <div class="domain">www.moesaltd.com</div>
</body>
</html>`

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  // Block every request: the template must not depend on anything outside this file.
  await page.route('**/*', (route) => route.abort())
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const out = resolve(root, 'public/og-default.png')
  await page.screenshot({ path: out, type: 'png' })
  console.log(`wrote ${out}`)
} finally {
  await browser.close()
}
