import { test, expect } from '@playwright/test';

test('patient can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('text=Patient');
  await page.click('button:has-text("Sign in")');
  await expect(page).toHaveURL(/patient/);
});

test('doctor can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  // Click Doctor tab first
  await page.click('button:has-text("Doctor")');
  
  // Wait for credentials to update
  await page.waitForTimeout(500);
  
  // Clear and fill doctor credentials
  await page.fill('#email', 'doctor@example.com');
  await page.fill('#password', 'doctor123');
  
  // Click sign in
  await page.click('button:has-text("Sign in")');
  
  // Wait for navigation
  await page.waitForURL(/doctor/, { timeout: 10000 });
  await expect(page).toHaveURL(/doctor/);
});
