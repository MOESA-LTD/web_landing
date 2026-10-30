import { expect, type Page } from '@playwright/test'

/** Opens the header language dropdown. Retries the click because a click before hydration does nothing. */
export async function openLanguageMenu(page: Page) {
  const button = page.locator('#lang-button')
  const menu = page.locator('#lang-menu')
  await expect(async () => {
    if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click()
    await expect(menu).toBeVisible({ timeout: 1000 })
  }).toPass({ timeout: 15_000 })
}

/** Switches the page language through the header dropdown (a real link click). */
export async function switchLanguage(page: Page, to: 'en' | 'tr') {
  await openLanguageMenu(page)
  await page.locator(`#lang-menu a[hreflang="${to}"]`).click()
}
