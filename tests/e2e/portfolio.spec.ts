import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:preloaded', '1'));
});

test('navigates work, Garage, and the published resume', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Web apps');
  await page.goto('/work/agent-platform');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Invoice and Purchase Order Pipeline');
  await expect(page.getByText('Under NDA')).toBeVisible();
  await page.goto('/garage');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Garage');
  await expect(page.getByText('Suzuki Bandit 250', { exact: true })).toBeVisible();
  const resume = await request.get('/Ayan-Anees-Resume.pdf');
  expect(resume.ok()).toBeTruthy();
  expect(resume.headers()['content-type']).toContain('application/pdf');
});

test('persists theme and exposes the offline assistant state', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile', 'covered as a desktop persistence and provider-fallback flow');
  await page.goto('/');
  await page.waitForTimeout(1_000);
  const toggle = page.getByRole('switch');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByLabel('Question for the portfolio assistant').fill('What AI experience does he have?');
  await page.getByLabel('Send question').click();
  await expect(page.getByText('offline mode')).toBeVisible({ timeout: 25_000 });
});

test('mobile menu is keyboard operable and restores focus', async ({ page }) => {
  test.skip(test.info().project.name !== 'mobile', 'mobile-only interaction');
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open menu' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Site navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Site navigation' })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('reduced motion bypasses the preloader and has no serious axe findings', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByText('Full-stack & AI Agent Developer', { exact: true })).toBeVisible();
  await page.waitForTimeout(3_500);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await context.close();
});
