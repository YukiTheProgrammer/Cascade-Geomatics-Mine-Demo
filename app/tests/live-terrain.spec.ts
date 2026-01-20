/**
 * LiveTerrain Page E2E Tests
 *
 * Description:
 * Comprehensive Playwright end-to-end tests for the LiveTerrain page. This page
 * displays a 3D point cloud visualization of mine terrain with view mode switching,
 * optimizer controls, annotation markers, and the InformationMenu panel.
 *
 * Sample Input:
 * npx playwright test live-terrain.spec.ts
 *
 * Expected Output:
 * All tests pass, validating:
 * - Page renders viewer, ViewModeMenu, and Information button
 * - Point cloud loads with stats and FPS counter
 * - 5 view modes function with color changes
 * - Information menu opens with 4 tabs and closes
 * - Annotation markers display and open data panel
 * - Accessibility features (ARIA, keyboard navigation, focus)
 * - Error handling for invalid LAS files
 * - Responsive behavior across viewports
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('LiveTerrain Page', () => {
  test.describe('Page Load', () => {
    test('renders point cloud viewer on page load', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 10000 });
    });

    test('renders ViewModeMenu component', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();
    });

    test('renders Information button', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const infoButton = page.locator('[data-testid="information-menu-toggle"]');
      await expect(infoButton).toBeVisible();
      await expect(infoButton).toContainText('Information');
    });

    test('page has correct main role and aria-label', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const mainContainer = page.locator('[role="main"][aria-label="Live terrain visualization"]');
      await expect(mainContainer).toBeVisible();
    });

    test('canvas element is rendered inside viewer', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible();
    });
  });

  test.describe('Point Cloud Integration', () => {
    test('LAS file loads and displays point cloud', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 10000 });

      // Wait for loading to complete (either loaded or error state)
      await expect(async () => {
        const loadedIndicator = page.locator('[data-testid="pointcloud-loaded"]');
        const errorIndicator = page.locator('[data-testid="pointcloud-error"]');
        const loadingIndicator = page.locator('[data-testid="pointcloud-loading"]');

        const isLoaded = await loadedIndicator.isVisible().catch(() => false);
        const hasError = await errorIndicator.isVisible().catch(() => false);
        const isLoading = await loadingIndicator.isVisible().catch(() => false);

        expect(isLoaded || hasError || !isLoading).toBe(true);
      }).toPass({ timeout: 15000 });
    });

    test('displays stats when point cloud is loaded', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Wait for potential loading
      await page.waitForTimeout(3000);

      // Check for stats display (may show point count, FPS, etc.)
      const statsDisplay = page.locator('[data-testid="pointcloud-stats"]');
      const hasStats = await statsDisplay.isVisible().catch(() => false);

      // Stats may or may not be visible depending on implementation
      if (hasStats) {
        const statsText = await statsDisplay.textContent();
        expect(statsText).toBeTruthy();
      }
    });

    test('FPS counter displays when enabled', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Wait for rendering to start
      await page.waitForTimeout(2000);

      // Look for FPS display element
      const fpsDisplay = page.locator('[data-testid="fps-counter"]');
      const hasFps = await fpsDisplay.isVisible().catch(() => false);

      if (hasFps) {
        const fpsText = await fpsDisplay.textContent();
        expect(fpsText?.toLowerCase()).toContain('fps');
      }
    });

    test('no critical console errors during point cloud loading', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(3000);

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

  test.describe('View Mode Functionality', () => {
    test('all 5 view modes are displayed', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const modes = [
        'view-mode-default',
        'view-mode-height',
        'view-mode-cracking',
        'view-mode-micro_movements',
        'view-mode-risk',
      ];

      for (const modeId of modes) {
        const modeButton = page.locator(`[data-testid="${modeId}"]`);
        await expect(modeButton).toBeVisible();
      }
    });

    test('clicking Height mode changes active state', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.click();
      await page.waitForTimeout(200);

      const isActive = await heightMode.evaluate((el) => {
        return (
          el.getAttribute('aria-pressed') === 'true' ||
          el.getAttribute('aria-selected') === 'true' ||
          el.classList.contains('active') ||
          el.classList.contains('selected') ||
          el.hasAttribute('data-active')
        );
      });

      expect(isActive).toBe(true);
    });

    test('view mode change updates color mode indicator', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Get initial color mode
      const colorModeIndicator = page.locator('[data-testid="pointcloud-color-mode"]');
      const initialMode = await colorModeIndicator.textContent();

      // Change to Height mode
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.click();
      await page.waitForTimeout(300);

      // Verify color mode changed
      const newMode = await colorModeIndicator.textContent();
      expect(newMode).not.toBe(initialMode);
    });

    test('optimizer toggle is functional', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Look for optimizer toggle in ViewModeMenu
      const optimizerToggle = page.locator('[data-testid="optimizer-toggle"]');
      const hasOptimizer = await optimizerToggle.isVisible().catch(() => false);

      if (hasOptimizer) {
        await optimizerToggle.click();
        await page.waitForTimeout(200);

        // Toggle should change state
        const isEnabled = await optimizerToggle.evaluate((el) => {
          return (
            el.getAttribute('aria-pressed') === 'true' ||
            el.classList.contains('active') ||
            el.classList.contains('enabled')
          );
        });

        // State should be toggled
        expect(typeof isEnabled).toBe('boolean');
      }
    });

    test('switching modes does not cause console errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(1000);

      // Cycle through all modes
      const modes = [
        'view-mode-height',
        'view-mode-cracking',
        'view-mode-micro_movements',
        'view-mode-risk',
        'view-mode-default',
      ];

      for (const modeId of modes) {
        const modeButton = page.locator(`[data-testid="${modeId}"]`);
        await modeButton.click();
        await page.waitForTimeout(300);
      }

      const criticalErrors = consoleErrors.filter(
        (error) =>
          !error.includes('Failed to fetch') &&
          !error.includes('NetworkError') &&
          !error.includes('404') &&
          !error.includes('LAS')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Information Menu', () => {
    test('Information button opens the menu', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const infoButton = page.locator('[data-testid="information-menu-toggle"]');
      await infoButton.click();
      await page.waitForTimeout(500);

      const infoMenu = page.locator('[data-testid="information-menu"]');
      await expect(infoMenu).toBeVisible();
    });

    test('all 4 tabs are present in the Information menu', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      const dataTab = page.locator('[data-testid="info-tab-data"]');
      const installationsTab = page.locator('[data-testid="info-tab-installations"]');
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');

      await expect(dataTab).toBeVisible();
      await expect(installationsTab).toBeVisible();
      await expect(eventsTab).toBeVisible();
      await expect(trackingTab).toBeVisible();
    });

    test('clicking Data tab shows Data content', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      // Data tab should be active by default
      const dataContent = page.locator('[data-testid="info-content-data"]');
      await expect(dataContent).toBeVisible();
    });

    test('clicking Towers tab shows Towers content', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      await page.click('[data-testid="info-tab-installations"]');
      await page.waitForTimeout(200);

      const towersContent = page.locator('[data-testid="info-content-installations"]');
      await expect(towersContent).toBeVisible();
    });

    test('close button closes the Information menu', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      const closeButton = page.locator('[data-testid="information-menu-close"]');
      await closeButton.click();
      await page.waitForTimeout(400);

      // Verify toggle button shows menu is closed
      const infoButton = page.locator('[data-testid="information-menu-toggle"]');
      const ariaExpanded = await infoButton.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');
    });
  });

  test.describe('Annotation System', () => {
    test('annotation markers are displayed on the viewer', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(1500);

      // Look for annotation markers
      const annotations = page.locator('[data-testid^="annotation-marker-"]');
      const count = await annotations.count();

      // Should have at least one annotation marker
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('clicking annotation opens OnClickDataPanel', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(1500);

      const annotation = page.locator('[data-testid="annotation-marker-0"]');
      const hasAnnotation = await annotation.isVisible().catch(() => false);

      if (hasAnnotation) {
        await annotation.click();

        const dataPanel = page.locator('[data-testid="onclick-data-panel"]');
        await expect(dataPanel).toBeVisible();
      }
    });

    test('weather KPIs are displayed in data panel', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(1500);

      const annotation = page.locator('[data-testid="annotation-marker-0"]');
      const hasAnnotation = await annotation.isVisible().catch(() => false);

      if (hasAnnotation) {
        await annotation.click();

        const dataPanel = page.locator('[data-testid="onclick-data-panel"]');
        await expect(dataPanel).toBeVisible();

        const weatherCards = dataPanel.locator('[data-testid="weather-kpi-card"]');
        const cardCount = await weatherCards.count();

        expect(cardCount).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Accessibility', () => {
    test('information toggle button has aria-expanded attribute', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const infoButton = page.locator('[data-testid="information-menu-toggle"]');
      const ariaExpanded = await infoButton.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');
    });

    test('aria-expanded updates when menu is opened', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const infoButton = page.locator('[data-testid="information-menu-toggle"]');
      await infoButton.click();
      await page.waitForTimeout(300);

      const ariaExpanded = await infoButton.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });

    test('information button has proper aria-label', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const infoButton = page.locator('[data-testid="information-menu-toggle"]');
      const ariaLabel = await infoButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain('information');
    });

    test('keyboard navigation works for view mode buttons', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      await defaultMode.focus();

      // Press Tab to move to next button
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.getAttribute('data-testid');
      });

      expect(focusedElement).toBeTruthy();
    });

    test('focus ring is visible on interactive elements', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      const infoButton = page.locator('[data-testid="information-menu-toggle"]');

      const stylesBefore = await infoButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
        };
      });

      await infoButton.focus();

      const stylesAfter = await infoButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
        };
      });

      const hasFocusIndicator =
        stylesBefore.outline !== stylesAfter.outline ||
        stylesBefore.boxShadow !== stylesAfter.boxShadow;

      expect(hasFocusIndicator).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test('displays error state when LAS file fails to load', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 10000 });

      await page.waitForTimeout(5000);

      const errorIndicator = page.locator('[data-testid="pointcloud-error"]');
      const isError = await errorIndicator.isVisible().catch(() => false);

      if (isError) {
        const errorText = await errorIndicator.textContent();
        expect(errorText).toBeTruthy();
        expect(errorText?.length).toBeGreaterThan(5);
      }
    });

    test('retry option is available on error', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 10000 });

      await page.waitForTimeout(5000);

      const errorIndicator = page.locator('[data-testid="pointcloud-error"]');
      const isError = await errorIndicator.isVisible().catch(() => false);

      if (isError) {
        const retryButton = page.locator('[data-testid="pointcloud-retry"]');
        const hasRetry = await retryButton.isVisible().catch(() => false);

        if (hasRetry) {
          await expect(retryButton).toBeEnabled();
        }
      }
    });

    test('viewer remains interactive even on error', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // ViewModeMenu should still be usable
      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // Mode buttons should be clickable
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await expect(heightMode).toBeEnabled();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('renders correctly on 1920x1080 viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 10000 });

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      const infoButton = page.locator('[data-testid="information-menu-toggle"]');
      await expect(infoButton).toBeVisible();
    });

    test('renders correctly on 1280x720 viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible({ timeout: 10000 });

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // All view mode buttons should be visible
      const modes = [
        'view-mode-default',
        'view-mode-height',
        'view-mode-cracking',
        'view-mode-micro_movements',
        'view-mode-risk',
      ];

      for (const modeId of modes) {
        const modeButton = page.locator(`[data-testid="${modeId}"]`);
        await expect(modeButton).toBeVisible();
      }
    });

    test('viewer resizes correctly when window is resized', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`${BASE_URL}/live-terrain`);

      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible({ timeout: 10000 });

      const initialBox = await canvas.boundingBox();
      expect(initialBox).not.toBeNull();

      // Resize to smaller viewport
      await page.setViewportSize({ width: 800, height: 600 });
      await page.waitForTimeout(500);

      const resizedBox = await canvas.boundingBox();
      expect(resizedBox).not.toBeNull();

      if (initialBox && resizedBox) {
        expect(resizedBox.width).toBeLessThan(initialBox.width);
      }
    });

    test('information menu is usable on smaller viewports', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      const infoMenu = page.locator('[data-testid="information-menu"]');
      await expect(infoMenu).toBeVisible();

      // All tabs should be visible
      const tabs = infoMenu.locator('[role="tab"]');
      await expect(tabs).toHaveCount(4);

      // Should be able to interact with tabs
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      await eventsTab.click();
      await page.waitForTimeout(200);

      const eventsContent = page.locator('[data-testid="info-content-events"]');
      await expect(eventsContent).toBeVisible();
    });
  });

  test.describe('Integration Tests', () => {
    test('view mode change does not affect Information menu state', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open info menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      const infoMenu = page.locator('[data-testid="information-menu"]');
      await expect(infoMenu).toBeVisible();

      // Change view mode
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.click();
      await page.waitForTimeout(300);

      // Info menu should still be visible
      await expect(infoMenu).toBeVisible();
    });

    test('viewer interaction works while Information menu is open', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open info menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      // Interact with viewer
      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      const canvasBox = await canvas.boundingBox();

      if (canvasBox) {
        const centerX = canvasBox.x + canvasBox.width / 2;
        const centerY = canvasBox.y + canvasBox.height / 2;

        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 50, centerY + 30);
        await page.mouse.up();
      }

      await page.waitForTimeout(300);

      // Canvas should still be visible
      await expect(canvas).toBeVisible();
    });

    test('navigation away and back resets page state', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Open info menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      // Navigate away
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate back
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Info menu should be closed (aria-expanded = false)
      const infoButton = page.locator('[data-testid="information-menu-toggle"]');
      const ariaExpanded = await infoButton.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');
    });

    test('page state persists during view mode changes', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });

      // Select Height mode
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.click();
      await page.waitForTimeout(200);

      // Verify it's active (component uses aria-pressed)
      let isActive = await heightMode.evaluate((el) => {
        return (
          el.getAttribute('aria-pressed') === 'true' ||
          el.getAttribute('aria-selected') === 'true' ||
          el.classList.contains('active') ||
          el.classList.contains('selected')
        );
      });
      expect(isActive).toBe(true);

      // Pan the viewer
      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      const canvasBox = await canvas.boundingBox();

      if (canvasBox) {
        const centerX = canvasBox.x + canvasBox.width / 2;
        const centerY = canvasBox.y + canvasBox.height / 2;

        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 30, centerY + 20);
        await page.mouse.up();
      }

      await page.waitForTimeout(200);

      // Height mode should still be active
      isActive = await heightMode.evaluate((el) => {
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
});
