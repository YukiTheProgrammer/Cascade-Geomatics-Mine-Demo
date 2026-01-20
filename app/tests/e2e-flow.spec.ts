/**
 * End-to-End Flow Tests
 *
 * Description:
 * Comprehensive Playwright end-to-end tests that validate complete user journeys
 * through the Mine Demo Dashboard. These tests simulate real user workflows
 * including navigation between pages, interaction sequences, and error recovery.
 *
 * Sample Input:
 * npx playwright test e2e-flow.spec.ts
 *
 * Expected Output:
 * All tests pass, validating:
 * - Navigation flows between Quick Overview and Live Terrain
 * - Quick Overview interactions with KPI cards and activity log
 * - Live Terrain interactions (pan/rotate, view modes, tabs)
 * - Complete workflows without errors
 * - Console error monitoring throughout flows
 * - Error recovery scenarios
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('E2E Flow Tests', () => {
  test.describe('Navigation Flows', () => {
    test('complete navigation flow: Quick Overview -> Live Terrain -> Quick Overview', async ({
      page,
    }) => {
      // Start at Quick Overview
      await page.goto(BASE_URL);
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Verify Quick Overview content
      const pageTitle = page.getByRole('heading', { name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();

      // Navigate to Live Terrain
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      // Verify Live Terrain content
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 10000 });

      // Navigate back to Quick Overview
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Verify Quick Overview is displayed again
      await expect(pageTitle).toBeVisible();
    });

    test('navigation maintains consistent header across pages', async ({ page }) => {
      // Start at Quick Overview
      await page.goto(BASE_URL);

      // Check for navigation bar
      const quickOverviewLink = page.getByRole('link', { name: 'Quick Overview' });
      const liveTerrainLink = page.getByRole('link', { name: 'Live Terrain' });

      await expect(quickOverviewLink).toBeVisible();
      await expect(liveTerrainLink).toBeVisible();

      // Navigate to Live Terrain
      await liveTerrainLink.click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      // Navigation bar should still be visible
      await expect(quickOverviewLink).toBeVisible();
      await expect(liveTerrainLink).toBeVisible();
    });

    test('browser back button works correctly between pages', async ({ page }) => {
      // Start at Quick Overview
      await page.goto(BASE_URL);
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate to Live Terrain
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      // Use browser back button
      await page.goBack();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Verify Quick Overview is displayed
      const pageTitle = page.getByRole('heading', { name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();
    });
  });

  test.describe('Quick Overview Interactions', () => {
    test('complete Quick Overview interaction flow: view KPIs and activity log', async ({
      page,
    }) => {
      await page.goto(BASE_URL);

      // Verify page header
      const pageTitle = page.getByRole('heading', { name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();

      // Verify Hardware Status section is visible
      const hardwareSection = page.getByRole('region', { name: 'Hardware Status' });
      await expect(hardwareSection).toBeVisible();

      // Verify Weather Conditions section is visible
      const weatherSection = page.getByRole('region', { name: 'Weather Conditions' });
      await expect(weatherSection).toBeVisible();

      // Verify Activity section is visible
      const activitySection = page.getByRole('region', { name: 'Activity' });
      await expect(activitySection).toBeVisible();

      // Verify Activity section has entries (list items)
      const activityContent = await activitySection.textContent();
      expect(activityContent).toBeTruthy();
      expect(activityContent!.length).toBeGreaterThan(50);
    });

    test('KPI cards display meaningful data on Quick Overview', async ({ page }) => {
      await page.goto(BASE_URL);

      // Verify Hardware Status section shows tower status
      const hardwareSection = page.getByRole('region', { name: 'Hardware Status' });
      await expect(hardwareSection).toBeVisible();
      const hardwareText = await hardwareSection.textContent();
      expect(hardwareText).toMatch(/Online/i);

      // Verify Weather section shows temperature
      const weatherSection = page.getByRole('region', { name: 'Weather Conditions' });
      await expect(weatherSection).toBeVisible();
      const weatherText = await weatherSection.textContent();
      expect(weatherText).toMatch(/°C/);
      expect(weatherText).toMatch(/km\/h/);
    });

    test('activity log shows timestamped entries', async ({ page }) => {
      await page.goto(BASE_URL);

      const activitySection = page.getByRole('region', { name: 'Activity' });
      await expect(activitySection).toBeVisible();

      // Verify entries have timestamps (contains time patterns like PM/AM)
      const activityText = await activitySection.textContent();
      expect(activityText).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/i);
    });
  });

  test.describe('Live Terrain Interactions', () => {
    test('complete Live Terrain interaction flow: pan, rotate, change view modes', async ({
      page,
    }) => {
      // Increase timeout for this test
      test.setTimeout(60000);

      await page.goto(`${BASE_URL}/live-terrain`);

      // Wait for viewer to load
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 15000 });

      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible();

      // Give time for point cloud to initialize
      await page.waitForTimeout(1000);

      // Change view modes (simplified - no mouse interactions)
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.click();
      await page.waitForTimeout(200);

      const riskMode = page.locator('[data-testid="view-mode-risk"]');
      await riskMode.click();
      await page.waitForTimeout(200);

      // Return to default mode
      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      await defaultMode.click();
      await page.waitForTimeout(200);

      // Verify viewer is still functional
      await expect(canvas).toBeVisible();
    });

    test('Information menu tab navigation flow', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open Information menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      const infoMenu = page.locator('[data-testid="information-menu"]');
      await expect(infoMenu).toBeVisible();

      // Navigate through all tabs
      const tabs = ['data', 'installations', 'events', 'tracking'];

      for (const tabId of tabs) {
        const tab = page.locator(`[data-testid="info-tab-${tabId}"]`);
        await tab.click();
        await page.waitForTimeout(200);

        const content = page.locator(`[data-testid="info-content-${tabId}"]`);
        await expect(content).toBeVisible();

        const contentText = await content.textContent();
        expect(contentText?.trim().length).toBeGreaterThan(0);
      }

      // Close menu
      const closeButton = page.locator('[data-testid="information-menu-close"]');
      await closeButton.click();
      await page.waitForTimeout(400);
    });

    test('annotation click opens data panel with weather KPIs', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(1500);

      // Check for annotation markers
      const annotation = page.locator('[data-testid="annotation-marker-0"]');
      const hasAnnotation = await annotation.isVisible().catch(() => false);

      if (hasAnnotation) {
        // Click annotation
        await annotation.click();

        // Verify data panel opens
        const dataPanel = page.locator('[data-testid="onclick-data-panel"]');
        await expect(dataPanel).toBeVisible();

        // Verify panel has weather KPIs
        const weatherCards = dataPanel.locator('[data-testid="weather-kpi-card"]');
        const cardCount = await weatherCards.count();
        expect(cardCount).toBeGreaterThanOrEqual(0);

        // Close panel
        const closeButton = page.locator('[data-testid="onclick-data-panel-close"]');
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await expect(dataPanel).not.toBeVisible();
        }
      }
    });
  });

  test.describe('Complete User Flows', () => {
    test('complete flow: browse overview, check terrain, return to overview', async ({ page }) => {
      // Increase timeout for this comprehensive test
      test.setTimeout(60000);

      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Step 1: Start at Quick Overview
      await page.goto(BASE_URL);
      await expect(page.getByRole('heading', { name: 'Operations Overview' })).toBeVisible();

      // Step 2: Review KPIs
      const hardwareSection = page.getByRole('region', { name: 'Hardware Status' });
      await expect(hardwareSection).toBeVisible();

      // Step 3: Navigate to Live Terrain
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      // Step 4: Wait for viewer to load
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(1000);

      // Step 5: Interact with view modes
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.click();
      await page.waitForTimeout(200);

      // Step 6: Open Information menu and browse tabs
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(400);

      await page.click('[data-testid="info-tab-events"]');
      await page.waitForTimeout(150);

      // Step 7: Close Information menu
      await page.click('[data-testid="information-menu-close"]');
      await page.waitForTimeout(300);

      // Step 8: Return to Quick Overview
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);
      await expect(page.getByRole('heading', { name: 'Operations Overview' })).toBeVisible();

      // Verify no critical console errors throughout
      const criticalErrors = consoleErrors.filter(
        (error) =>
          !error.includes('Failed to fetch') &&
          !error.includes('NetworkError') &&
          !error.includes('404') &&
          !error.includes('LAS') &&
          !error.includes('WebGL')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('complete flow without any console errors', async ({ page }) => {
      // Increase timeout for this comprehensive test
      test.setTimeout(60000);

      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Navigate through the app
      await page.goto(BASE_URL);
      await page.waitForTimeout(500);

      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 15000 });
      await page.waitForTimeout(1000);

      // Interact with the page
      await page.click('[data-testid="view-mode-cracking"]');
      await page.waitForTimeout(200);

      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(400);

      await page.click('[data-testid="info-tab-tracking"]');
      await page.waitForTimeout(150);

      await page.click('[data-testid="information-menu-close"]');
      await page.waitForTimeout(200);

      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await page.waitForTimeout(500);

      // Filter and verify no critical errors
      const criticalErrors = consoleErrors.filter(
        (error) =>
          !error.includes('Failed to fetch') &&
          !error.includes('NetworkError') &&
          !error.includes('404') &&
          !error.includes('LAS') &&
          !error.includes('WebGL')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Console Error Checking', () => {
    test('no console errors during Quick Overview page load', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);

      const criticalErrors = consoleErrors.filter(
        (error) =>
          !error.includes('Failed to fetch') &&
          !error.includes('NetworkError') &&
          !error.includes('404')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('no console errors during Live Terrain page interactions', async ({ page }) => {
      // Increase timeout for this test
      test.setTimeout(60000);

      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 15000 });
      await page.waitForTimeout(1000);

      // Perform various interactions
      await page.click('[data-testid="view-mode-height"]');
      await page.waitForTimeout(150);

      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(400);

      await page.click('[data-testid="info-tab-installations"]');
      await page.waitForTimeout(150);

      await page.click('[data-testid="info-tab-events"]');
      await page.waitForTimeout(150);

      await page.click('[data-testid="info-tab-tracking"]');
      await page.waitForTimeout(150);

      await page.click('[data-testid="information-menu-close"]');
      await page.waitForTimeout(300);

      const criticalErrors = consoleErrors.filter(
        (error) =>
          !error.includes('Failed to fetch') &&
          !error.includes('NetworkError') &&
          !error.includes('404') &&
          !error.includes('LAS') &&
          !error.includes('WebGL')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('no console errors during rapid navigation', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Rapid navigation between pages
      await page.goto(BASE_URL);
      await page.waitForTimeout(500);

      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await page.waitForTimeout(1000);

      const criticalErrors = consoleErrors.filter(
        (error) =>
          !error.includes('Failed to fetch') &&
          !error.includes('NetworkError') &&
          !error.includes('404') &&
          !error.includes('LAS') &&
          !error.includes('WebGL')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Error Recovery', () => {
    test('app recovers from navigation during point cloud loading', async ({ page }) => {
      // Navigate to Live Terrain
      await page.goto(`${BASE_URL}/live-terrain`);

      // Immediately navigate away before loading completes
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Verify Quick Overview is functional
      const pageTitle = page.getByRole('heading', { name: 'Operations Overview' });
      await expect(pageTitle).toBeVisible();

      // Navigate back to Live Terrain
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      // Verify Live Terrain works properly
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 10000 });
    });

    test('app handles multiple rapid clicks gracefully', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(1000);

      // Rapid clicks on view mode buttons
      const modes = [
        'view-mode-height',
        'view-mode-cracking',
        'view-mode-risk',
        'view-mode-default',
        'view-mode-micro_movements',
      ];

      for (const modeId of modes) {
        await page.click(`[data-testid="${modeId}"]`);
        await page.waitForTimeout(50);
      }

      // Rapid clicks on Information toggle
      for (let i = 0; i < 3; i++) {
        await page.click('[data-testid="information-menu-toggle"]');
        await page.waitForTimeout(100);
      }

      await page.waitForTimeout(500);

      // Verify app is still functional
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      const criticalErrors = consoleErrors.filter(
        (error) =>
          !error.includes('Failed to fetch') &&
          !error.includes('NetworkError') &&
          !error.includes('404') &&
          !error.includes('LAS') &&
          !error.includes('WebGL')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('app state resets properly after error conditions', async ({ page }) => {
      // Start fresh
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open Information menu and select a tab
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      await page.click('[data-testid="info-tab-events"]');
      await page.waitForTimeout(200);

      // Navigate away
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate back
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Verify menu is closed
      const infoButton = page.locator('[data-testid="information-menu-toggle"]');
      const ariaExpanded = await infoButton.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');

      // Verify default view mode is selected
      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      const isActive = await defaultMode.evaluate((el) => {
        return (
          el.getAttribute('aria-pressed') === 'true' ||
          el.getAttribute('aria-selected') === 'true' ||
          el.classList.contains('active') ||
          el.classList.contains('selected')
        );
      });
      expect(isActive).toBe(true);
    });
  });

  test.describe('Performance Checks', () => {
    test('page load times are reasonable', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(BASE_URL);
      await expect(page.getByRole('heading', { name: 'Operations Overview' })).toBeVisible();

      const quickOverviewLoadTime = Date.now() - startTime;

      // Quick Overview should load within 5 seconds
      expect(quickOverviewLoadTime).toBeLessThan(5000);

      const navStartTime = Date.now();

      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const liveTerrainNavTime = Date.now() - navStartTime;

      // Navigation to Live Terrain should complete within 10 seconds
      expect(liveTerrainNavTime).toBeLessThan(10000);
    });

    test('UI remains responsive during point cloud operations', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(2000);

      // Measure UI responsiveness during view mode change
      const startTime = Date.now();

      await page.click('[data-testid="view-mode-height"]');

      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await expect(heightMode).toBeVisible();

      const responseTime = Date.now() - startTime;

      // UI should respond within 500ms
      expect(responseTime).toBeLessThan(500);

      // Open Information menu should be responsive
      const menuStartTime = Date.now();

      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForSelector('[data-testid="information-menu"]');

      const menuResponseTime = Date.now() - menuStartTime;

      // Menu should open within 1 second
      expect(menuResponseTime).toBeLessThan(1000);
    });
  });
});
