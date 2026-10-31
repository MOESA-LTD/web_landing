import { expect, test } from '@playwright/test'

/**
 * Unknown paths answer a real HTTP 404 from the production build (not a 200 soft-404), in the locale of the
 * requested path: `/tr/*` gives the TR 404 copy, `/de/*` the DE copy, everything else EN. The 404 page is not indexable.
 */
test.describe('404', () => {
  test('GET /this-does-not-exist returns 404 with the EN 404 copy', async ({ request }) => {
    const res = await request.get('/this-does-not-exist')
    expect(res.status()).toBe(404)
    const body = await res.text()
    expect(body).toContain('The page could not be found.')
    expect(body).toMatch(/<html[^>]*lang="en"/)
  })

  test('the 404 response is noindex in the meta and the X-Robots-Tag header', async ({ request }) => {
    for (const path of ['/this-does-not-exist', '/tr/olmayan-sayfa']) {
      const res = await request.get(path, { headers: { accept: 'text/html' } })
      expect(res.status()).toBe(404)
      expect(res.headers()['x-robots-tag'], path).toMatch(/^noindex/)
      expect(await res.text()).toContain('<meta name="robots" content="noindex, follow">')
    }
  })

  test('GET /tr/olmayan-sayfa returns 404 with the TR 404 heading', async ({ request }) => {
    const res = await request.get('/tr/olmayan-sayfa')
    expect(res.status()).toBe(404)
    const body = await res.text()
    expect(body).toContain('Sayfa bulunamadı.')
    expect(body).toMatch(/<html[^>]*lang="tr"/)
  })

  test('an unknown service slug also returns 404', async ({ request }) => {
    const res = await request.get('/services/not-a-service')
    expect(res.status()).toBe(404)
    expect(await res.text()).toContain('The page could not be found.')
  })

  test('EN 404 page: title, no canonical, one h1, links work', async ({ page }) => {
    const res = await page.goto('/this-does-not-exist')
    expect(res?.status()).toBe(404)
    await expect(page).toHaveTitle('Page Not Found | MOESA Ltd.')
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('The page could not be found.')
    await expect(page.locator('#main')).toContainText('Need help finding the right information?')
    await page.locator('[data-message-list] a', { hasText: 'Explore Services' }).click()
    await expect(page).toHaveURL(/\/services$/)
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('TR 404 page: TR title, TR header, html lang tr', async ({ page }) => {
    const res = await page.goto('/tr/olmayan-sayfa')
    expect(res?.status()).toBe(404)
    await expect(page).toHaveTitle('404 | MOESA Ltd.')
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
    await expect(page.locator('h1')).toHaveText('Sayfa bulunamadı.')
    await expect(page.locator('#main')).toContainText('Projeyi görüşelim.')
    await expect(page.locator('[data-message-list] a', { hasText: 'Hizmetler' })).toHaveAttribute('href', '/tr/hizmetler')
  })

  test('GET /de/gibt-es-nicht returns 404 with the DE 404 copy, lang de and noindex', async ({ request }) => {
    const res = await request.get('/de/gibt-es-nicht', { headers: { accept: 'text/html' } })
    expect(res.status()).toBe(404)
    expect(res.headers()['x-robots-tag']).toMatch(/^noindex/)
    const body = await res.text()
    expect(body).toContain('Die Seite wurde nicht gefunden.')
    expect(body).toMatch(/<html[^>]*lang="de"/)
    expect(body).toContain('<meta name="robots" content="noindex, follow">')
  })

  test('DE 404 page: DE title, DE links, no canonical', async ({ page }) => {
    const res = await page.goto('/de/gibt-es-nicht')
    expect(res?.status()).toBe(404)
    await expect(page).toHaveTitle('Seite nicht gefunden | MOESA Ltd.')
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
    await expect(page.locator('h1')).toHaveText('Die Seite wurde nicht gefunden.')
    await expect(page.locator('#main')).toContainText('Brauchen Sie Hilfe, die richtigen Informationen zu finden?')
    await expect(page.locator('[data-message-list] a', { hasText: 'Leistungen entdecken' })).toHaveAttribute('href', '/de/leistungen')
  })

  test('unknown or wrong-locale DE service slugs answer 404', async ({ request }) => {
    for (const path of ['/de/leistungen/gibt-es-nicht', '/de/leistungen/operations-supply-chain', '/de/leistungen/operasyon-ve-tedarik-zinciri', '/services/operations-und-lieferkette', '/tr/hizmetler/operations-und-lieferkette']) {
      expect((await request.get(path)).status(), path).toBe(404)
    }
  })
})
