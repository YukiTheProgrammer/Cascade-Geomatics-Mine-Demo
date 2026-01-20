/**
 * Cross-Browser Tests
 *
 * Description:
 * Tests to verify functionality across different browsers.
 * Tests point cloud rendering, view modes, and panel interactions.
 * Designed to catch browser-specific rendering or JavaScript issues.
 *
 * Sample Input:
 * npx playwright test cross-browser.spec.ts --project=chromium
 * npx playwright test cross-browser.spec.ts --project=firefox
 * npx playwright test cross-browser.spec.ts --project=webkit
 *
 * Expected Output:
 * All tests pass on supported browsers (Chromium, Firefox, WebKit/Safari)
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Cross-Browser Compatibility', () => {
  test.describe('Point Cloud Loading and Rendering', () => {
    test('point cloud viewer container renders correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      // Verify the viewer has proper dimensions
      const boundingBox = await viewer.boundingBox();
      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThan(100);
        expect(boundingBox.height).toBeGreaterThan(100);
      }
    });

    test('WebGL canvas initializes successfully', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      // Wait for canvas to be added
      const canvas = viewer.locator('canvas');
      await expect(canvas).toBeVisible({ timeout: 10000 });

      // Verify WebGL context is available
      const hasWebGL = await page.evaluate(() => {
        const canvas = document.querySelector('[data-testid="pointcloud-viewer"] canvas');
        if (!canvas) return false;
        const gl = (canvas as HTMLCanvasElement).getContext('webgl2') ||
                   (canvas as HTMLCanvasElement).getContext('webgl');
        return gl !== null;
      });

      expect(hasWebGL).toBe(true);
    });

    test('point cloud loads without critical errors', async ({ page }) => {
      const criticalErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          const text = message.text();
          // Filter out expected errors (like missing files during development)
          if (!text.includes('Failed to fetch') &&
              !text.includes('NetworkError') &&
              !text.includes('404') &&
              !text.includes('net::ERR')) {
            criticalErrors.push(text);
          }
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      // Wait for loading to complete
      await page.waitForTimeout(5000);

      // No critical JavaScript errors should occur
      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('View Mode Switching', () => {
    test('view mode menu renders with all options', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // Verify all view mode buttons are present
      const viewModes = ['default', 'height', 'cracking', 'micro_movements', 'risk'];
      for (const mode of viewModes) {
        const button = page.locator(`[data-testid="view-mode-${mode}"]`);
        await expect(button).toBeVisible();
      }
    });

    test('switching view modes does not cause errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // Switch through all view modes
      const viewModes = ['height', 'cracking', 'micro_movements', 'risk', 'default'];
      for (const mode of viewModes) {
        const button = page.locator(`[data-testid="view-mode-${mode}"]`);
        await button.click();
        await page.waitForTimeout(500);
      }

      // Filter out expected network errors
      const unexpectedErrors = consoleErrors.filter(
        (error) => !error.includes('Failed to fetch') &&
                   !error.includes('NetworkError') &&
                   !error.includes('404')
      );

      expect(unexpectedErrors).toHaveLength(0);
    });

    test('active view mode is visually indicated', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Click on height view mode
      const heightButton = page.locator('[data-testid="view-mode-height"]');
      await heightButton.click();

      // Verify it has aria-pressed="true"
      await expect(heightButton).toHaveAttribute('aria-pressed', 'true');

      // Verify default is no longer active
      const defaultButton = page.locator('[data-testid="view-mode-default"]');
      await expect(defaultButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  test.describe('Panel Interactions', () => {
    test('information menu opens and closes correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');
      await expect(toggleButton).toBeVisible();

      // Open information menu
      await toggleButton.click();
      await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

      // Wait for menu animation
      await page.waitForTimeout(300);

      // Close information menu
      await toggleButton.click();
      await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('optimizer toggle works correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const optimizerToggle = page.locator('[data-testid="optimizer-toggle"]');
      await expect(optimizerToggle).toBeVisible();

      // Get initial state
      const initialState = await optimizerToggle.getAttribute('aria-pressed');
      expect(initialState).toBe('true');

      // Toggle optimizer off
      await optimizerToggle.click();
      await expect(optimizerToggle).toHaveAttribute('aria-pressed', 'false');

      // Toggle optimizer back on
      await optimizerToggle.click();
      await expect(optimizerToggle).toHaveAttribute('aria-pressed', 'true');
    });

    test('optimizer mode switching works', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Verify FPS mode button exists
      const fpsButton = page.locator('[data-testid="optimizer-mode-fps"]');
      await expect(fpsButton).toBeVisible();

      // Verify Zoom mode button exists
      const zoomButton = page.locator('[data-testid="optimizer-mode-zoom"]');
      await expect(zoomButton).toBeVisible();

      // Switch to zoom mode
      await zoomButton.click();
      await expect(zoomButton).toHaveAttribute('aria-pressed', 'true');
      await expect(fpsButton).toHaveAttribute('aria-pressed', 'false');

      // Switch back to FPS mode
      await fpsButton.click();
      await expect(fpsButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('Console Error Monitoring', () => {
    test('no JavaScript errors on initial page load', async ({ page }) => {
      const jsErrors: string[] = [];

      page.on('pageerror', (error) => {
        jsErrors.push(error.message);
      });

      await page.goto(`${BASE_URL}/live-terrain`);

      // Wait for page to fully load
      await page.waitForTimeout(3000);

      expect(jsErrors).toHaveLength(0);
    });

    test('no unhandled promise rejections', async ({ page }) => {
      const rejections: string[] = [];

      page.on('console', (message) => {
        if (message.text().includes('Unhandled') || message.text().includes('unhandled')) {
          rejections.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForTimeout(5000);

      expect(rejections).toHaveLength(0);
    });
  });

  test.describe('Performance Baseline', () => {
    test('page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      const loadTime = Date.now() - startTime;

      // Page should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });

    test('canvas renders frames without freezing', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible({ timeout: 10000 });

      // Perform some interactions to verify renderer is responsive
      const boundingBox = await canvas.boundingBox();
      if (boundingBox) {
        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;

        // Simulate mouse interactions
        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 50, centerY + 30);
        await page.mouse.up();
      }

      // Canvas should still be visible and responsive
      await expect(canvas).toBeVisible();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('viewer adapts to different viewport sizes', async ({ page }) => {
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      const desktopBox = await viewer.boundingBox();
      expect(desktopBox).not.toBeNull();

      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(300);

      const tabletBox = await viewer.boundingBox();
      expect(tabletBox).not.toBeNull();
      if (desktopBox && tabletBox) {
        expect(tabletBox.width).toBeLessThan(desktopBox.width);
      }

      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);

      const mobileBox = await viewer.boundingBox();
      expect(mobileBox).not.toBeNull();
      if (tabletBox && mobileBox) {
        expect(mobileBox.width).toBeLessThan(tabletBox.width);
      }
    });

    test('controls remain accessible on smaller viewports', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 600 });
      await page.goto(`${BASE_URL}/live-terrain`);

      // View mode menu should still be visible
      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // Information toggle should still be visible
      const infoToggle = page.locator('[data-testid="information-menu-toggle"]');
      await expect(infoToggle).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('all interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Tab to view mode buttons
      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // Verify view mode buttons can receive focus
      const heightButton = page.locator('[data-testid="view-mode-height"]');
      await heightButton.focus();

      const isFocused = await heightButton.evaluate(
        (el) => document.activeElement === el
      );
      expect(isFocused).toBe(true);

      // Verify keyboard activation works
      await page.keyboard.press('Enter');
      await expect(heightButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('elements have proper ARIA attributes', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Viewer should have aria-label
      const viewer = page.locator('[data-testid="pointcloud-viewer"]').locator('..');
      const ariaLabel = await viewer.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      // View mode menu should have role="group"
      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      const role = await viewModeMenu.getAttribute('role');
      expect(role).toBe('group');

      // Buttons should have aria-pressed
      const defaultButton = page.locator('[data-testid="view-mode-default"]');
      const ariaPressed = await defaultButton.getAttribute('aria-pressed');
      expect(ariaPressed).not.toBeNull();
    });
  });
});
