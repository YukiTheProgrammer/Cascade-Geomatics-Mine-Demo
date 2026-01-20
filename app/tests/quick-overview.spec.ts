/**
 * Quick Overview Page Test Specifications
 *
 * Description:
 * Playwright end-to-end tests for the Quick Overview page, the primary dashboard
 * of the Mine Demo application. Tests verify correct rendering of all page sections
 * including page header, KPI strips (hardware and weather), and activity log.
 * Also tests navigation accessibility and responsive layout behavior.
 *
 * Sample Input:
 * - Page load at "/" (Quick Overview route)
 * - Navigation from other pages to Quick Overview
 * - Different viewport sizes (mobile, tablet, desktop)
 *
 * Expected Output:
 * - Page header renders with title and subtitle
 * - Hardware KPI strip renders with 3 cards
 * - Weather KPI strip renders with 6 cards
 * - Activity log section renders with entries
 * - Page is accessible via navigation tab
 * - Layout adapts correctly to different screen sizes
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Quick Overview Page', () => {
  test.describe('Page Header Renders', () => {
    test('renders page header with title on page load', async ({ page }) => {
      await page.goto(BASE_URL);

      const pageTitle = page.getByRole('heading', { name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();
    });

    test('renders page header with subtitle indicator', async ({ page }) => {
      await page.goto(BASE_URL);

      const subtitle = page.getByText('Real-time monitoring');
      await expect(subtitle).toBeVisible();
    });

    test('page header has correct heading level', async ({ page }) => {
      await page.goto(BASE_URL);

      const h1 = page.locator('main h1, div h1').filter({ hasText: 'Operations Overview' });
      await expect(h1).toBeVisible();
    });

    test('page header elements are horizontally aligned', async ({ page }) => {
      await page.goto(BASE_URL);

      const title = page.getByRole('heading', { name: 'Operations Overview' });
      const subtitle = page.getByText('Real-time monitoring');

      const titleBox = await title.boundingBox();
      const subtitleBox = await subtitle.boundingBox();

      expect(titleBox).not.toBeNull();
      expect(subtitleBox).not.toBeNull();

      if (titleBox && subtitleBox) {
        // Subtitle should be to the right of title (horizontal alignment)
        expect(subtitleBox.x).toBeGreaterThan(titleBox.x);
        // Both should be roughly on the same baseline (within 20px tolerance)
        expect(Math.abs((titleBox.y + titleBox.height) - (subtitleBox.y + subtitleBox.height))).toBeLessThan(20);
      }
    });
  });

  test.describe('All Sections Render on Page Load', () => {
    test('renders KPI section on page load', async ({ page }) => {
      await page.goto(BASE_URL);

      const kpiSection = page.locator('[data-testid="kpi-section"]');
      await expect(kpiSection).toBeVisible();
    });

    test('renders Hardware KPI strip with all cards', async ({ page }) => {
      await page.goto(BASE_URL);

      const hardwareStrip = page.locator('[data-testid="hardware-kpi-strip"]');
      await expect(hardwareStrip).toBeVisible();

      // Hardware strip should have 3 cards: Towers, Server, Model
      const hardwareCards = hardwareStrip.locator('[data-testid="kpi-card"]');
      await expect(hardwareCards).toHaveCount(3);
    });

    test('renders Weather KPI strip with all cards', async ({ page }) => {
      await page.goto(BASE_URL);

      const weatherStrip = page.locator('[data-testid="weather-kpi-strip"]');
      await expect(weatherStrip).toBeVisible();

      // Weather strip should have 6 cards
      const weatherCards = weatherStrip.locator('[data-testid="kpi-card"]');
      await expect(weatherCards).toHaveCount(6);
    });

    test('renders Activity Log section on page load', async ({ page }) => {
      await page.goto(BASE_URL);

      const activityLog = page.locator('[data-testid="activity-log"]');
      await expect(activityLog).toBeVisible();
    });

    test('all major sections are visible without scrolling on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(BASE_URL);

      // Page header
      const pageTitle = page.getByRole('heading', { name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();

      // KPI section
      const kpiSection = page.locator('[data-testid="kpi-section"]');
      await expect(kpiSection).toBeVisible();

      // Activity log header should be visible
      const activityLogTitle = page.locator('[data-testid="activity-log-title"]');
      await expect(activityLogTitle).toBeVisible();
    });
  });

  test.describe('Page is Accessible from Navigation', () => {
    test('Quick Overview tab navigates to the page from Live Terrain', async ({ page }) => {
      // Start at Live Terrain page
      await page.goto(`${BASE_URL}/live-terrain`);

      // Click Quick Overview tab
      const quickOverviewTab = page.getByRole('link', { name: 'Quick Overview' });
      await quickOverviewTab.click();

      // Should be at index route
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Page content should be visible
      const pageTitle = page.getByRole('heading', { name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();
    });

    test('Quick Overview is the default landing page', async ({ page }) => {
      await page.goto(BASE_URL);

      // Should be at index route
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Quick Overview content should be visible
      const pageTitle = page.getByRole('heading', { name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();
    });

    test('Quick Overview tab is highlighted as active on index route', async ({ page }) => {
      await page.goto(BASE_URL);

      const quickOverviewTab = page.getByRole('link', { name: 'Quick Overview' });
      await expect(quickOverviewTab).toHaveClass(/bg-blue-100/);
      await expect(quickOverviewTab).toHaveClass(/text-blue-700/);
    });

    test('page content persists after navigation away and back', async ({ page }) => {
      await page.goto(BASE_URL);

      // Navigate to Live Terrain
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      // Navigate back to Quick Overview
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // All sections should still be visible
      await expect(page.getByRole('heading', { name: 'Operations Overview' })).toBeVisible();
      await expect(page.locator('[data-testid="kpi-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-log"]')).toBeVisible();
    });
  });

  test.describe('Placeholder Data Displays Correctly', () => {
    test('Hardware KPI cards display placeholder values', async ({ page }) => {
      await page.goto(BASE_URL);

      // Towers should show online count
      const towersValue = page.locator('[data-testid="kpi-card-towers"] [data-testid="kpi-card-value"]');
      await expect(towersValue).toBeVisible();
      const towersText = await towersValue.textContent();
      expect(towersText).toMatch(/\d+\/\d+\s*Online/i);

      // Server should show operational status
      const serverValue = page.locator('[data-testid="kpi-card-server"] [data-testid="kpi-card-value"]');
      await expect(serverValue).toContainText('Operational');

      // Model should show update time
      const modelValue = page.locator('[data-testid="kpi-card-model"] [data-testid="kpi-card-value"]');
      const modelText = await modelValue.textContent();
      expect(modelText).toMatch(/Updated\s+\d+[hm]\s*ago/i);
    });

    test('Weather KPI cards display placeholder values with units', async ({ page }) => {
      await page.goto(BASE_URL);

      // Temperature with degrees Celsius
      const tempValue = page.locator('[data-testid="kpi-card-temperature"] [data-testid="kpi-card-value"]');
      const tempText = await tempValue.textContent();
      expect(tempText).toMatch(/\d+\s*°C/);

      // Precipitation with mm
      const precipValue = page.locator('[data-testid="kpi-card-precipitation"] [data-testid="kpi-card-value"]');
      const precipText = await precipValue.textContent();
      expect(precipText).toMatch(/\d+\s*mm/);

      // Wind Speed with km/h
      const windValue = page.locator('[data-testid="kpi-card-wind-speed"] [data-testid="kpi-card-value"]');
      const windText = await windValue.textContent();
      expect(windText).toMatch(/\d+\s*km\/h/);

      // Humidity with percentage
      const humidityValue = page.locator('[data-testid="kpi-card-humidity"] [data-testid="kpi-card-value"]');
      const humidityText = await humidityValue.textContent();
      expect(humidityText).toMatch(/\d+\s*%/);
    });

    test('Activity log displays placeholder activity entries', async ({ page }) => {
      await page.goto(BASE_URL);

      const activityLog = page.locator('[data-testid="activity-log"]');
      const activityRows = activityLog.locator('[role="listitem"]');

      const rowCount = await activityRows.count();
      expect(rowCount).toBeGreaterThan(0);

      // First activity row should have essential fields
      if (rowCount > 0) {
        const firstRow = activityRows.first();
        const timestamp = firstRow.locator('time');
        const description = firstRow.locator('p');

        await expect(timestamp).toBeVisible();
        await expect(description).toBeVisible();
      }
    });

    test('Activity log shows entry count', async ({ page }) => {
      await page.goto(BASE_URL);

      const countDisplay = page.locator('[data-testid="activity-log-count"]');
      await expect(countDisplay).toBeVisible();

      const countText = await countDisplay.textContent();
      expect(countText).toMatch(/\d+\s+of\s+\d+\s+entries/i);
    });

    test('KPI strips display section titles', async ({ page }) => {
      await page.goto(BASE_URL);

      // Hardware Status section title
      const hardwareTitle = page.getByText('Hardware Status');
      await expect(hardwareTitle).toBeVisible();

      // Weather Conditions section title
      const weatherTitle = page.getByText('Weather Conditions');
      await expect(weatherTitle).toBeVisible();
    });
  });

  test.describe('Responsive Layout', () => {
    test('page renders correctly on mobile viewport (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);

      // Page header should be visible
      const pageTitle = page.getByRole('heading', { name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();

      // KPI section should be visible
      const kpiSection = page.locator('[data-testid="kpi-section"]');
      await expect(kpiSection).toBeVisible();

      // Activity log should be visible
      const activityLog = page.locator('[data-testid="activity-log"]');
      await expect(activityLog).toBeVisible();

      // Content should fit within viewport width
      const mainContent = page.locator('.max-w-\\[1600px\\]');
      const box = await mainContent.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375);
      }
    });

    test('page renders correctly on tablet viewport (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);

      // All sections should be visible
      await expect(page.getByRole('heading', { name: 'Operations Overview' })).toBeVisible();
      await expect(page.locator('[data-testid="kpi-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-log"]')).toBeVisible();

      // KPI cards should all be visible
      const kpiCards = page.locator('[data-testid="kpi-card"]');
      const cardCount = await kpiCards.count();
      expect(cardCount).toBe(9); // 3 hardware + 6 weather
    });

    test('page renders correctly on desktop viewport (1280px)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(BASE_URL);

      // All sections should be visible
      await expect(page.getByRole('heading', { name: 'Operations Overview' })).toBeVisible();
      await expect(page.locator('[data-testid="kpi-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-log"]')).toBeVisible();

      // Hardware KPI cards should be in a horizontal row
      const hardwareStrip = page.locator('[data-testid="hardware-kpi-strip"]');
      const hardwareCards = hardwareStrip.locator('[data-testid="kpi-card"]');

      const firstCard = hardwareCards.first();
      const secondCard = hardwareCards.nth(1);

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      expect(firstBox).not.toBeNull();
      expect(secondBox).not.toBeNull();

      if (firstBox && secondBox) {
        // Cards should be on same vertical position (row layout)
        expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(10);
        // Second card should be to the right
        expect(secondBox.x).toBeGreaterThan(firstBox.x);
      }
    });

    test('KPI cards wrap correctly on narrow viewports', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);

      const kpiCards = page.locator('[data-testid="kpi-card"]');
      const firstCard = kpiCards.first();

      await expect(firstCard).toBeVisible();

      const box = await firstCard.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        // Card should fit within mobile viewport with padding
        expect(box.width).toBeLessThanOrEqual(375 - 32); // accounting for padding
      }
    });

    test('activity log remains readable on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);

      const activityLog = page.locator('[data-testid="activity-log"]');
      await expect(activityLog).toBeVisible();

      // Activity log should fit within viewport
      const box = await activityLog.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375);
      }

      // Activity rows should still be visible
      const activityRows = activityLog.locator('[role="listitem"]');
      const count = await activityRows.count();
      if (count > 0) {
        await expect(activityRows.first()).toBeVisible();
      }
    });

    test('page elements remain visible after viewport resize', async ({ page }) => {
      // Start at desktop
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(BASE_URL);

      const kpiCards = page.locator('[data-testid="kpi-card"]');
      const initialCount = await kpiCards.count();

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);

      const mobileCount = await kpiCards.count();
      expect(mobileCount).toBe(initialCount);

      // All major sections should still be visible
      await expect(page.getByRole('heading', { name: 'Operations Overview' })).toBeVisible();
      await expect(page.locator('[data-testid="kpi-section"]')).toBeVisible();
    });
  });

  test.describe('Page Layout and Spacing', () => {
    test('page has correct background color', async ({ page }) => {
      await page.goto(BASE_URL);

      const mainContainer = page.locator('.bg-slate-900').first();
      await expect(mainContainer).toBeVisible();
    });

    test('page sections have appropriate vertical spacing', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(BASE_URL);

      const pageHeader = page.locator('header').filter({ has: page.getByRole('heading', { name: 'Operations Overview' }) });
      const kpiSection = page.locator('[data-testid="kpi-section"]');

      const headerBox = await pageHeader.boundingBox();
      const kpiBox = await kpiSection.boundingBox();

      expect(headerBox).not.toBeNull();
      expect(kpiBox).not.toBeNull();

      if (headerBox && kpiBox) {
        // KPI section should be below header with spacing
        expect(kpiBox.y).toBeGreaterThan(headerBox.y + headerBox.height);
      }
    });

    test('KPI strips have vertical spacing between them', async ({ page }) => {
      await page.goto(BASE_URL);

      const hardwareStrip = page.locator('[data-testid="hardware-kpi-strip"]');
      const weatherStrip = page.locator('[data-testid="weather-kpi-strip"]');

      const hardwareBox = await hardwareStrip.boundingBox();
      const weatherBox = await weatherStrip.boundingBox();

      expect(hardwareBox).not.toBeNull();
      expect(weatherBox).not.toBeNull();

      if (hardwareBox && weatherBox) {
        // Weather strip should be below hardware strip
        expect(weatherBox.y).toBeGreaterThan(hardwareBox.y + hardwareBox.height);
        // Should have some vertical gap (at least 8px)
        const gap = weatherBox.y - (hardwareBox.y + hardwareBox.height);
        expect(gap).toBeGreaterThanOrEqual(8);
      }
    });

    test('activity log is positioned below KPI strips', async ({ page }) => {
      await page.goto(BASE_URL);

      const weatherStrip = page.locator('[data-testid="weather-kpi-strip"]');
      const activityLog = page.locator('[data-testid="activity-log"]');

      const weatherBox = await weatherStrip.boundingBox();
      const activityBox = await activityLog.boundingBox();

      expect(weatherBox).not.toBeNull();
      expect(activityBox).not.toBeNull();

      if (weatherBox && activityBox) {
        // Activity log should be below weather strip
        expect(activityBox.y).toBeGreaterThan(weatherBox.y + weatherBox.height);
      }
    });
  });

  test.describe('Accessibility', () => {
    test('page has proper heading hierarchy', async ({ page }) => {
      await page.goto(BASE_URL);

      // Main page heading should be h1
      const h1 = page.locator('h1');
      const h1Count = await h1.count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // The main page title should be present
      const pageTitle = page.getByRole('heading', { level: 1, name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();
    });

    test('sections have semantic structure', async ({ page }) => {
      await page.goto(BASE_URL);

      // Activity log should have aria-labelledby
      const activityLog = page.locator('[data-testid="activity-log"]');
      const labelledBy = await activityLog.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
    });

    test('page content is navigable via keyboard', async ({ page }) => {
      await page.goto(BASE_URL);

      // Tab through the page
      await page.keyboard.press('Tab');

      // Interactive elements should be focusable
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      // Some element should receive focus
      expect(focusedElement).toBeTruthy();
    });

    test('KPI cards have accessible titles', async ({ page }) => {
      await page.goto(BASE_URL);

      const kpiTitles = page.locator('[data-testid="kpi-card-title"]');
      const titleCount = await kpiTitles.count();

      for (let i = 0; i < titleCount; i++) {
        const title = kpiTitles.nth(i);
        await expect(title).toBeVisible();
        const text = await title.textContent();
        expect(text?.trim().length).toBeGreaterThan(0);
      }
    });
  });
});
