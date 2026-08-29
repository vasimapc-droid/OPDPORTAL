import { test, expect } from '@playwright/test';

test('patient can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('button:has-text("Patient")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/patient/, { timeout: 10000 });
  await expect(page).toHaveURL(/patient/);
});

test('patient can view doctors list', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('button:has-text("Patient")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/patient/);
  
  await page.click('text=Find Doctors');
  await page.waitForURL(/patient\/doctors/);
  await page.waitForTimeout(2000);
  
  await expect(page.locator('text=Dr. Priya Sharma').first()).toBeVisible();
});

test('patient can filter doctors by department', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('button:has-text("Patient")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/patient/);
  
  await page.click('text=Find Doctors');
  await page.waitForURL(/patient\/doctors/);
  await page.waitForTimeout(2000);
  
  await page.selectOption('select', 'Cardiology');
  await page.waitForTimeout(1000);
  
  await expect(page.locator('text=Dr. Priya Sharma')).toBeVisible();
});

test('doctor can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('button:has-text("Doctor")');
  await page.waitForTimeout(500);
  await page.fill('#email', 'doctor@example.com');
  await page.fill('#password', 'doctor123');
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/doctor/, { timeout: 10000 });
  await expect(page).toHaveURL(/doctor/);
});

test('doctor can view patient queue', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('button:has-text("Doctor")');
  await page.waitForTimeout(500);
  await page.fill('#email', 'doctor@example.com');
  await page.fill('#password', 'doctor123');
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/doctor/);
  
  await page.click('text=Queue');
  await page.waitForURL(/doctor\/queue/);
  await page.waitForTimeout(2000);
  
  await expect(page.locator('table')).toBeVisible();
});

test('doctor can view availability page', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('button:has-text("Doctor")');
  await page.waitForTimeout(500);
  await page.fill('#email', 'doctor@example.com');
  await page.fill('#password', 'doctor123');
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/doctor/);
  
  await page.click('text=Availability');
  await page.waitForURL(/doctor\/availability/);
  await page.waitForTimeout(2000);
  
  await expect(page.locator('text=Manage Availability')).toBeVisible();
});

test('patient cannot access doctor pages', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('button:has-text("Patient")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/patient/);
  
  await page.goto('http://localhost:3000/doctor');
  await page.waitForTimeout(2000);
  
  await expect(page).toHaveURL(/patient/);
});

test('doctor cannot access patient pages', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('button:has-text("Doctor")');
  await page.waitForTimeout(500);
  await page.fill('#email', 'doctor@example.com');
  await page.fill('#password', 'doctor123');
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/doctor/);
  
  await page.goto('http://localhost:3000/patient');
  await page.waitForTimeout(2000);
  
  await expect(page).toHaveURL(/doctor/);
});
