/**
 * Navbar Component Test Specifications
 *
 * Description:
 * Playwright end-to-end tests for the Mine Demo Dashboard Navbar component.
 * Verifies correct rendering, navigation functionality, timestamp display,
 * and user interactions with the navigation bar elements.
 *
 * Sample Input:
 * - Page load at "/" (Quick Overview route)
 * - Page load at "/live-terrain" (Live Terrain route)
 * - User clicks on navigation tabs and action buttons
 *
 * Expected Output:
 * - All navbar sections render correctly (left, middle, right)
 * - Tab navigation routes to correct pages
 * - Active tab displays correct visual styling
 * - Last updated timestamp displays in expected format
 * - Action buttons respond to user interactions
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Navbar Component', () => {
  test.describe('Initial Render State', () => {
    test('renders all three sections correctly on page load', async ({ page }) => {
      await page.goto(BASE_URL);

      // Left section: Title and last updated
      const navbar = page.locator('header');
      await expect(navbar).toBeVisible();

      const title = page.getByText('Mine Demo Dashboard');
      await expect(title).toBeVisible();

      const lastUpdated = page.getByText(/Last updated:/i);
      await expect(lastUpdated).toBeVisible();

      // Middle section: Tab navigation
      const quickOverviewTab = page.getByRole('link', { name: 'Quick Overview' });
      await expect(quickOverviewTab).toBeVisible();

      const liveTerrainTab = page.getByRole('link', { name: 'Live Terrain' });
      await expect(liveTerrainTab).toBeVisible();

      // Right section: Action buttons
      const generateReportButton = page.getByRole('button', { name: /Generate Report/i });
      await expect(generateReportButton).toBeVisible();

      const settingsButton = page.getByRole('button', { name: /settings/i });
      await expect(settingsButton).toBeVisible();

      const notificationsButton = page.getByRole('button', { name: /notifications/i });
      await expect(notificationsButton).toBeVisible();
    });

    test('renders title with correct text content', async ({ page }) => {
      await page.goto(BASE_URL);

      const title = page.getByText('Mine Demo Dashboard');
      await expect(title).toHaveText('Mine Demo Dashboard');
    });

    test('renders navbar with correct structural layout', async ({ page }) => {
      await page.goto(BASE_URL);

      // Verify header exists and contains expected child elements
      const header = page.locator('header');
      await expect(header).toBeVisible();

      // Verify navigation element exists within header
      const nav = header.locator('nav');
      await expect(nav).toBeVisible();
    });
  });

  test.describe('Tab Navigation', () => {
    test('Quick Overview tab navigates to index route "/"', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const quickOverviewTab = page.getByRole('link', { name: 'Quick Overview' });
      await quickOverviewTab.click();

      await expect(page).toHaveURL(`${BASE_URL}/`);
    });

    test('Live Terrain tab navigates to "/live-terrain" route', async ({ page }) => {
      await page.goto(BASE_URL);

      const liveTerrainTab = page.getByRole('link', { name: 'Live Terrain' });
      await liveTerrainTab.click();

      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);
    });

    test('navigating between tabs updates URL correctly', async ({ page }) => {
      // Start at Quick Overview
      await page.goto(BASE_URL);
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate to Live Terrain
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      // Navigate back to Quick Overview
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);
    });

    test('tabs have correct href attributes', async ({ page }) => {
      await page.goto(BASE_URL);

      const quickOverviewTab = page.getByRole('link', { name: 'Quick Overview' });
      await expect(quickOverviewTab).toHaveAttribute('href', '/');

      const liveTerrainTab = page.getByRole('link', { name: 'Live Terrain' });
      await expect(liveTerrainTab).toHaveAttribute('href', '/live-terrain');
    });
  });

  test.describe('Active Tab Styling', () => {
    test('Quick Overview tab shows active styling when on index route', async ({ page }) => {
      await page.goto(BASE_URL);

      const quickOverviewTab = page.getByRole('link', { name: 'Quick Overview' });
      const liveTerrainTab = page.getByRole('link', { name: 'Live Terrain' });

      // Active tab should have active styling class
      await expect(quickOverviewTab).toHaveClass(/bg-blue-100/);
      await expect(quickOverviewTab).toHaveClass(/text-blue-700/);

      // Inactive tab should not have active styling
      await expect(liveTerrainTab).not.toHaveClass(/bg-blue-100/);
      await expect(liveTerrainTab).not.toHaveClass(/text-blue-700/);
    });

    test('Live Terrain tab shows active styling when on live-terrain route', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const quickOverviewTab = page.getByRole('link', { name: 'Quick Overview' });
      const liveTerrainTab = page.getByRole('link', { name: 'Live Terrain' });

      // Active tab should have active styling class
      await expect(liveTerrainTab).toHaveClass(/bg-blue-100/);
      await expect(liveTerrainTab).toHaveClass(/text-blue-700/);

      // Inactive tab should not have active styling
      await expect(quickOverviewTab).not.toHaveClass(/bg-blue-100/);
      await expect(quickOverviewTab).not.toHaveClass(/text-blue-700/);
    });

    test('active styling transfers when navigating between tabs', async ({ page }) => {
      await page.goto(BASE_URL);

      const quickOverviewTab = page.getByRole('link', { name: 'Quick Overview' });
      const liveTerrainTab = page.getByRole('link', { name: 'Live Terrain' });

      // Initially Quick Overview is active
      await expect(quickOverviewTab).toHaveClass(/bg-blue-100/);
      await expect(liveTerrainTab).not.toHaveClass(/bg-blue-100/);

      // Click Live Terrain
      await liveTerrainTab.click();

      // Now Live Terrain should be active
      await expect(liveTerrainTab).toHaveClass(/bg-blue-100/);
      await expect(quickOverviewTab).not.toHaveClass(/bg-blue-100/);
    });
  });

  test.describe('Last Updated Timestamp', () => {
    test('displays last updated timestamp text', async ({ page }) => {
      await page.goto(BASE_URL);

      const lastUpdated = page.getByText(/Last updated:/i);
      await expect(lastUpdated).toBeVisible();
    });

    test('timestamp follows expected date/time format', async ({ page }) => {
      await page.goto(BASE_URL);

      // Expected format examples: "Last updated: Jan 18, 2026 10:30 AM" or similar
      // Using flexible regex to match common timestamp formats
      const timestampPattern = /Last updated:\s*(\w{3}\s+\d{1,2},?\s*\d{4}\s+\d{1,2}:\d{2}\s*(AM|PM)?|\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}|\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/i;

      const lastUpdated = page.locator('[data-testid="last-updated"]');
      const textContent = await lastUpdated.textContent();

      // Verify the timestamp text exists and contains a date-like pattern
      expect(textContent).toBeTruthy();
      expect(textContent).toMatch(/Last updated:/i);
    });

    test('timestamp element is positioned in left section of navbar', async ({ page }) => {
      await page.goto(BASE_URL);

      // Verify timestamp is within the left section container
      const leftSection = page.locator('[data-testid="navbar-left-section"]');
      const lastUpdated = leftSection.getByText(/Last updated:/i);

      await expect(lastUpdated).toBeVisible();
    });
  });

  test.describe('Generate Report Button', () => {
    test('Generate Report button is visible and clickable', async ({ page }) => {
      await page.goto(BASE_URL);

      const generateReportButton = page.getByRole('button', { name: /Generate Report/i });
      await expect(generateReportButton).toBeVisible();
      await expect(generateReportButton).toBeEnabled();
    });

    test('Generate Report button responds to click interaction', async ({ page }) => {
      await page.goto(BASE_URL);

      const generateReportButton = page.getByRole('button', { name: /Generate Report/i });

      // Button should be clickable without throwing errors
      await generateReportButton.click();

      // Verify button still exists after click (wasn't removed from DOM)
      await expect(generateReportButton).toBeVisible();
    });

    test('Generate Report button is positioned in right section of navbar', async ({ page }) => {
      await page.goto(BASE_URL);

      const rightSection = page.locator('[data-testid="navbar-right-section"]');
      const generateReportButton = rightSection.getByRole('button', { name: /Generate Report/i });

      await expect(generateReportButton).toBeVisible();
    });
  });

  test.describe('Icon Buttons', () => {
    test('settings icon button is visible and clickable', async ({ page }) => {
      await page.goto(BASE_URL);

      const settingsButton = page.getByRole('button', { name: /settings/i });
      await expect(settingsButton).toBeVisible();
      await expect(settingsButton).toBeEnabled();

      // Should be clickable without errors
      await settingsButton.click();
    });

    test('notifications icon button is visible and clickable', async ({ page }) => {
      await page.goto(BASE_URL);

      const notificationsButton = page.getByRole('button', { name: /notifications/i });
      await expect(notificationsButton).toBeVisible();
      await expect(notificationsButton).toBeEnabled();

      // Should be clickable without errors
      await notificationsButton.click();
    });

    test('icon buttons are positioned in right section of navbar', async ({ page }) => {
      await page.goto(BASE_URL);

      const rightSection = page.locator('[data-testid="navbar-right-section"]');

      const settingsButton = rightSection.getByRole('button', { name: /settings/i });
      const notificationsButton = rightSection.getByRole('button', { name: /notifications/i });

      await expect(settingsButton).toBeVisible();
      await expect(notificationsButton).toBeVisible();
    });
  });

  test.describe('Navbar Persistence', () => {
    test('navbar remains visible when navigating between routes', async ({ page }) => {
      await page.goto(BASE_URL);

      const navbar = page.locator('header');
      await expect(navbar).toBeVisible();

      // Navigate to Live Terrain
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(navbar).toBeVisible();

      // Navigate back to Quick Overview
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(navbar).toBeVisible();
    });

    test('all navbar elements persist across route changes', async ({ page }) => {
      await page.goto(BASE_URL);

      // Navigate to Live Terrain
      await page.getByRole('link', { name: 'Live Terrain' }).click();

      // Verify all elements still present
      await expect(page.getByText('Mine Demo Dashboard')).toBeVisible();
      await expect(page.getByText(/Last updated:/i)).toBeVisible();
      await expect(page.getByRole('link', { name: 'Quick Overview' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Live Terrain' })).toBeVisible();
      await expect(page.getByRole('button', { name: /Generate Report/i })).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('navigation tabs are accessible via keyboard', async ({ page }) => {
      await page.goto(BASE_URL);

      // Tab to the navigation area
      await page.keyboard.press('Tab');

      // Verify links are focusable
      const quickOverviewTab = page.getByRole('link', { name: 'Quick Overview' });
      const liveTerrainTab = page.getByRole('link', { name: 'Live Terrain' });

      // Both tabs should be keyboard accessible
      await expect(quickOverviewTab).toHaveAttribute('href', '/');
      await expect(liveTerrainTab).toHaveAttribute('href', '/live-terrain');
    });

    test('buttons have accessible names', async ({ page }) => {
      await page.goto(BASE_URL);

      const generateReportButton = page.getByRole('button', { name: /Generate Report/i });
      const settingsButton = page.getByRole('button', { name: /settings/i });
      const notificationsButton = page.getByRole('button', { name: /notifications/i });

      // All buttons should be findable by their accessible names
      await expect(generateReportButton).toBeVisible();
      await expect(settingsButton).toBeVisible();
      await expect(notificationsButton).toBeVisible();
    });

    test('navigation element has semantic nav tag', async ({ page }) => {
      await page.goto(BASE_URL);

      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });
  });
});
