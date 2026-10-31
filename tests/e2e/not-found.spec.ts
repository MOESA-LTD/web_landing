import { expect, test } from '@playwright/test'

/**
 * Unknown paths answer a real HTTP 404 from the production build (not a 200 soft-404), in the locale of the
 * requested path: `/tr/*` gives the TR 404 copy, everything else EN. The 404 page is not indexable.
 */
test.describe('404', () => {
  test('GET /this-does-not-exist returns 404 with the EN 404 copy', async ({ request }) => {
    const res = await request.get('/this-does-not-exist')
    expect(res.status()).toBe(404)
    const body = await res.text()
    expect(body).toContain('The page could not be found.')
    expect(body).toMatch(/<html[^>]*lang="en"/)
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
})
