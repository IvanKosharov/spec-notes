import { test, expect } from '@playwright/test'

test.describe('Sign Up Flow (US1)', () => {
  test('successful sign-up redirects to /notes', async ({ page }) => {
    await page.goto('/')
    await page.fill('[data-testid="email-input"]', 'newuser@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-button"]')
    await expect(page).toHaveURL('/notes')
    await expect(page.getByText('Welcome')).toBeVisible()
  })

  test('invalid email stays on sign-up page with error', async ({ page }) => {
    await page.goto('/')
    await page.fill('[data-testid="email-input"]', 'notanemail')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-button"]')
    await expect(page).toHaveURL('/')
    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('short password stays on sign-up page with error', async ({ page }) => {
    await page.goto('/')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'short')
    await page.click('[data-testid="submit-button"]')
    await expect(page).toHaveURL('/')
    await expect(page.getByText(/8 characters/i)).toBeVisible()
  })
})

test.describe('Sign In Flow (US2)', () => {
  test('valid credentials redirect to /notes', async ({ page }) => {
    await page.goto('/signin')
    await page.fill('[data-testid="email-input"]', 'user@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-button"]')
    await expect(page).toHaveURL('/notes')
    await expect(page.getByText('Welcome')).toBeVisible()
  })

  test('wrong credentials stay on sign-in page with error', async ({ page }) => {
    await page.goto('/signin')
    await page.fill('[data-testid="email-input"]', 'wrong@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-button"]')
    await expect(page).toHaveURL('/signin')
    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  })
})

test.describe('Navigation Toggle (US3)', () => {
  test('sign-up page has link to sign-in', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sign in')
    await expect(page).toHaveURL('/signin')
  })

  test('sign-in page has link to sign-up', async ({ page }) => {
    await page.goto('/signin')
    await page.click('text=Sign up')
    await expect(page).toHaveURL('/')
  })
})
