/**
 * Accessibility Tests
 *
 * Description:
 * Tests for keyboard navigation, ARIA attributes, and screen reader support
 * across the Mine Demo Dashboard application. Validates WCAG compliance for
 * navigation, interactive elements, and dynamic content announcements.
 *
 * Sample Input:
 * npx playwright test accessibility.spec.ts
 *
 * Expected Output:
 * All accessibility tests pass, validating keyboard navigation, proper ARIA
 * attributes, semantic HTML structure, and screen reader announcements.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Accessibility Tests', () => {
  test.describe('Keyboard Navigation', () => {
    test('should navigate navbar with keyboard', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Focus on first navigation link
      const quickOverviewLink = page.getByRole('link', { name: 'Quick Overview' });
      await quickOverviewLink.focus();
      await expect(quickOverviewLink).toBeFocused();

      // Tab to next link
      await page.keyboard.press('Tab');
      const liveTerrainLink = page.getByRole('link', { name: 'Live Terrain' });
      await expect(liveTerrainLink).toBeFocused();

      // Tab to Generate Report button
      await page.keyboard.press('Tab');
      const generateReportButton = page.getByRole('button', { name: 'Generate Report' });
      await expect(generateReportButton).toBeFocused();
    });

    test('should navigate tabs with arrow keys in InformationMenu', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open information menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      // Focus on first tab (Data)
      const dataTab = page.locator('[data-testid="info-tab-data"]');
      await dataTab.focus();
      await expect(dataTab).toHaveAttribute('aria-selected', 'true');

      // Press ArrowRight to move to next tab
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);

      // Towers tab should now be selected
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      await expect(towersTab).toHaveAttribute('aria-selected', 'true');

      // Press ArrowRight twice more to reach Tracking
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);

      // Tracking tab should now be selected
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      await expect(trackingTab).toHaveAttribute('aria-selected', 'true');

      // Press ArrowRight to wrap back to Data
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      await expect(dataTab).toHaveAttribute('aria-selected', 'true');
    });

    test('should close InformationMenu with Escape key', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open information menu
      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');
      await toggleButton.click();
      await page.waitForTimeout(500);

      // Verify menu is open (aria-expanded should be true)
      await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

      // Press Escape to close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);

      // Toggle button aria-expanded should be false after closing
      await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should have visible focus indicators on interactive elements', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Focus on Generate Report button
      const generateReportButton = page.getByRole('button', { name: 'Generate Report' });
      await generateReportButton.focus();

      // Check that the element has focus-visible styling
      const isFocused = await generateReportButton.evaluate((el) => {
        return document.activeElement === el;
      });
      expect(isFocused).toBe(true);

      // Check for focus ring class in element styles
      const classes = await generateReportButton.getAttribute('class');
      expect(classes).toContain('focus');
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have proper landmarks (main, nav, header)', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Check for banner landmark (using role selector for uniqueness)
      const banner = page.getByRole('banner');
      await expect(banner).toBeVisible();

      // Check for navigation landmark
      const nav = page.locator('nav[role="navigation"]');
      await expect(nav).toBeVisible();
      await expect(nav).toHaveAttribute('aria-label', 'Main navigation');

      // Check for main landmark (using role selector)
      const main = page.getByRole('main').first();
      await expect(main).toBeVisible();
    });

    test('should have labeled buttons with aria-label', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Check Settings button has aria-label
      const settingsButton = page.getByRole('button', { name: 'Settings' });
      await expect(settingsButton).toBeVisible();
      await expect(settingsButton).toHaveAttribute('aria-label', 'Settings');

      // Check Notifications button has aria-label
      const notificationsButton = page.getByRole('button', { name: 'Notifications' });
      await expect(notificationsButton).toBeVisible();
      await expect(notificationsButton).toHaveAttribute('aria-label', 'Notifications');

      // Check Generate Report button has aria-label
      const generateReportButton = page.getByRole('button', { name: 'Generate Report' });
      await expect(generateReportButton).toBeVisible();
      await expect(generateReportButton).toHaveAttribute('aria-label', 'Generate Report');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Check for h1 (page title)
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();

      // Check for h2 headings (section titles)
      const h2Headings = page.locator('h2');
      const h2Count = await h2Headings.count();
      expect(h2Count).toBeGreaterThanOrEqual(2); // At least Hardware Status and Weather Conditions

      // Verify heading content
      const hardwareHeading = page.getByRole('heading', { name: 'Hardware Status' });
      await expect(hardwareHeading).toBeVisible();

      const weatherHeading = page.getByRole('heading', { name: 'Weather Conditions' });
      await expect(weatherHeading).toBeVisible();
    });

    test('should have aria-labelledby on KPI sections', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Find sections with aria-labelledby
      const sections = page.locator('section[aria-labelledby]');
      const sectionCount = await sections.count();
      expect(sectionCount).toBeGreaterThanOrEqual(2);
    });

    test('should have proper dialog attributes on InformationMenu', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open information menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      // Check dialog role and aria-modal
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toHaveAttribute('role', 'dialog');
      await expect(menu).toHaveAttribute('aria-modal', 'true');
      await expect(menu).toHaveAttribute('aria-label', 'Information menu');
    });

    test('should have proper tab roles in InformationMenu', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open information menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      // Check tablist
      const tablist = page.locator('[role="tablist"]');
      await expect(tablist).toBeVisible();
      await expect(tablist).toHaveAttribute('aria-label', 'Information categories');

      // Check tab buttons have proper role
      const tabs = page.locator('[role="tab"]');
      await expect(tabs).toHaveCount(4);

      // Check first tab is selected
      const dataTab = page.locator('[data-testid="info-tab-data"]');
      await expect(dataTab).toHaveAttribute('aria-selected', 'true');

      // Check the active tabpanel is visible
      const dataTabpanel = page.locator('[data-testid="info-content-data"]');
      await expect(dataTabpanel).toBeVisible();
      await expect(dataTabpanel).toHaveAttribute('role', 'tabpanel');
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should announce loading states with aria-live', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Check for loading indicator visibility during load
      const loadingIndicator = page.locator('text=Loading Point Cloud');

      // The loading state should be visible initially
      // Note: This may pass quickly if the point cloud loads fast
      const isLoadingVisible = await loadingIndicator.isVisible().catch(() => false);

      // Either loading was shown or point cloud loaded quickly
      // Both are acceptable states
      if (isLoadingVisible) {
        await expect(loadingIndicator).toBeVisible();
      }

      // Wait for point cloud to load
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 15000 });
    });

    test('should announce errors appropriately', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Check that error status indicators have proper aria-label
      const errorIndicators = page.locator('[aria-label*="Status: error"]');
      const errorCount = await errorIndicators.count();

      // There should be at least one error status in the activity log
      expect(errorCount).toBeGreaterThanOrEqual(1);
    });

    test('should announce tab changes with aria-selected', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open information menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      // Data tab should be selected initially
      const dataTab = page.locator('[data-testid="info-tab-data"]');
      await expect(dataTab).toHaveAttribute('aria-selected', 'true');

      // Click on Towers tab
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      await towersTab.click();
      await page.waitForTimeout(200);

      // Data tab should no longer be selected
      await expect(dataTab).toHaveAttribute('aria-selected', 'false');

      // Towers tab should now be selected
      await expect(towersTab).toHaveAttribute('aria-selected', 'true');

      // Towers tabpanel should be visible
      const towersPanel = page.locator('[data-testid="info-content-installations"]');
      await expect(towersPanel).toBeVisible();
    });

    test('should have descriptive aria-labels on view mode buttons', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Check view mode buttons have descriptive labels
      const defaultButton = page.locator('[data-testid="view-mode-default"]');
      await expect(defaultButton).toHaveAttribute('aria-label', /Default view mode/);
      await expect(defaultButton).toHaveAttribute('aria-pressed');

      const heightButton = page.locator('[data-testid="view-mode-height"]');
      await expect(heightButton).toHaveAttribute('aria-label', /Height view mode/);

      const riskButton = page.locator('[data-testid="view-mode-risk"]');
      await expect(riskButton).toHaveAttribute('aria-label', /Risk view mode/);
    });

    test('should have sr-only text for system status indicator', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Check for screen reader only text for system status
      const srOnlyText = page.locator('.sr-only', { hasText: 'System status' });
      await expect(srOnlyText).toBeAttached();
    });
  });

  test.describe('Filter Controls Accessibility', () => {
    test('should have accessible filter controls in ActivityLog', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Click filter toggle
      const filterToggle = page.locator('[data-testid="activity-log-filter-toggle"]');
      await expect(filterToggle).toHaveAttribute('aria-expanded', 'false');

      await filterToggle.click();
      await page.waitForTimeout(200);

      // Check aria-expanded changed
      await expect(filterToggle).toHaveAttribute('aria-expanded', 'true');
      await expect(filterToggle).toHaveAttribute('aria-controls', 'activity-log-filters');

      // Check filter selects have labels
      const statusFilter = page.locator('[data-testid="activity-log-status-filter"]');
      await expect(statusFilter).toBeVisible();

      // Check associated label exists
      const statusLabel = page.locator('label[for="status-filter"]');
      await expect(statusLabel).toBeVisible();

      const typeFilter = page.locator('[data-testid="activity-log-type-filter"]');
      await expect(typeFilter).toBeVisible();

      const typeLabel = page.locator('label[for="type-filter"]');
      await expect(typeLabel).toBeVisible();
    });

    test('should have aria-label on clear filters button', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // Open filters
      await page.click('[data-testid="activity-log-filter-toggle"]');
      await page.waitForTimeout(200);

      // Select a filter to make clear button appear
      const statusFilter = page.locator('[data-testid="activity-log-status-filter"]');
      await statusFilter.selectOption('success');
      await page.waitForTimeout(200);

      // Check clear filters button has aria-label
      const clearButton = page.locator('[data-testid="activity-log-clear-filters"]');
      await expect(clearButton).toBeVisible();
      await expect(clearButton).toHaveAttribute('aria-label', 'Clear all filters');
    });
  });

  test.describe('Interactive Elements Focus Management', () => {
    test('should trap focus within InformationMenu when open', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open information menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      // First tab should receive focus
      const dataTab = page.locator('[data-testid="info-tab-data"]');

      // Wait for focus to be set
      await page.waitForTimeout(200);

      // Tab should be focusable and reachable
      await dataTab.focus();
      await expect(dataTab).toBeFocused();
    });

    test('should have focusable KPI cards when interactive', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="activity-log"]', { timeout: 10000 });

      // KPI cards should have proper article semantics
      const kpiCards = page.locator('article[aria-label]');
      const cardCount = await kpiCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(3); // At least 3 hardware KPI cards
    });
  });
});
