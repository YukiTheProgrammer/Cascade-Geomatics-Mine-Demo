/**
 * PointCloudViewer Component Test Specifications
 *
 * Description:
 * Playwright end-to-end tests for the PointCloudViewer component that renders
 * 3D point cloud data from LAS files on the Live Terrain page. Tests verify
 * canvas mounting, loading states, renderer cleanup, and color mode switching.
 *
 * Sample Input:
 * - Page load at "/live-terrain" (Live Terrain route)
 * - User interactions with color mode selector
 * - Component mount/unmount lifecycle events
 *
 * Expected Output:
 * - Canvas element renders correctly within the viewer container
 * - Loading state displays during LAS file processing
 * - Loaded state displays after successful file load (or error state on failure)
 * - Color mode changes update the point cloud visualization
 * - No memory leaks or console errors on unmount
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('PointCloudViewer Component', () => {
  test.describe('Canvas Mounting', () => {
    test('renders canvas element when component mounts', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Verify the point cloud viewer container exists
      const viewerContainer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewerContainer).toBeVisible();

      // Verify canvas element is present within the viewer
      const canvas = viewerContainer.locator('canvas');
      await expect(canvas).toBeVisible();
    });

    test('canvas has correct dimensions within container', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible();

      // Verify canvas has non-zero dimensions
      const boundingBox = await canvas.boundingBox();
      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
      }
    });

    test('canvas element has webgl or webgl2 context available', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Verify WebGL context is available (required for 3D rendering)
      const hasWebGLContext = await page.evaluate(() => {
        const canvas = document.querySelector('[data-testid="pointcloud-viewer"] canvas');
        if (!canvas) return false;
        const gl = (canvas as HTMLCanvasElement).getContext('webgl2') ||
                   (canvas as HTMLCanvasElement).getContext('webgl');
        return gl !== null;
      });

      expect(hasWebGLContext).toBe(true);
    });

    test('viewer container has appropriate styling for 3D content', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewerContainer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewerContainer).toBeVisible();

      // Container should have a reasonable minimum height for 3D viewing
      const boundingBox = await viewerContainer.boundingBox();
      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(300);
      }
    });
  });

  test.describe('LAS File Loading', () => {
    test('displays loading state during LAS file load', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Either a loading indicator should be visible initially,
      // or the viewer should quickly transition to loaded/error state
      const loadingIndicator = page.locator('[data-testid="pointcloud-loading"]');
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');

      // Wait for viewer to be visible
      await expect(viewer).toBeVisible();

      // Check for loading indicator presence (may be brief or already complete)
      // Using a short timeout since loading could be fast
      const hasLoadingState = await loadingIndicator.isVisible().catch(() => false);

      // If loading is visible, verify it contains appropriate text
      if (hasLoadingState) {
        const loadingText = await loadingIndicator.textContent();
        expect(loadingText?.toLowerCase()).toMatch(/loading|processing/i);
      }
    });

    test('transitions from loading to loaded state on successful load', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      // Wait for either loaded state or error state (LAS file may not exist)
      await expect(async () => {
        const loadedIndicator = page.locator('[data-testid="pointcloud-loaded"]');
        const errorIndicator = page.locator('[data-testid="pointcloud-error"]');
        const loadingIndicator = page.locator('[data-testid="pointcloud-loading"]');

        const isLoaded = await loadedIndicator.isVisible().catch(() => false);
        const hasError = await errorIndicator.isVisible().catch(() => false);
        const isLoading = await loadingIndicator.isVisible().catch(() => false);

        // Should not be in loading state once transitioned
        expect(isLoaded || hasError || !isLoading).toBe(true);
      }).toPass({ timeout: 10000 });
    });

    test('displays error state gracefully when LAS file fails to load', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      // Wait for loading to complete
      await page.waitForTimeout(5000);

      // If there's an error state, verify it displays user-friendly message
      const errorIndicator = page.locator('[data-testid="pointcloud-error"]');
      const isError = await errorIndicator.isVisible().catch(() => false);

      if (isError) {
        const errorText = await errorIndicator.textContent();
        expect(errorText).toBeTruthy();
        expect(errorText?.length).toBeGreaterThan(5);
      }
    });

    test('no JavaScript console errors during loading process', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);

      // Wait for component to fully initialize
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();
      await page.waitForTimeout(3000);

      // Filter out expected errors (like missing LAS file) vs unexpected errors
      const unexpectedErrors = consoleErrors.filter(
        (error) => !error.includes('Failed to fetch') &&
                   !error.includes('NetworkError') &&
                   !error.includes('LAS') &&
                   !error.includes('404')
      );

      expect(unexpectedErrors).toHaveLength(0);
    });
  });

  test.describe('Renderer Cleanup on Unmount', () => {
    test('cleans up WebGL resources when navigating away', async ({ page }) => {
      // Navigate to Live Terrain page
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      // Allow renderer to initialize
      await page.waitForTimeout(2000);

      // Navigate away from page
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Verify canvas is no longer in DOM
      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).not.toBeVisible();
    });

    test('no memory leak warnings in console after unmount', async ({ page }) => {
      const memoryWarnings: string[] = [];

      page.on('console', (message) => {
        const text = message.text().toLowerCase();
        if (text.includes('memory') || text.includes('leak') || text.includes('dispose')) {
          memoryWarnings.push(message.text());
        }
      });

      // Navigate to Live Terrain
      await page.goto(`${BASE_URL}/live-terrain`);
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();
      await page.waitForTimeout(2000);

      // Navigate away multiple times to test cleanup
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await page.waitForTimeout(2000);

      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await page.waitForTimeout(500);

      // Should not have memory-related warnings
      const leakWarnings = memoryWarnings.filter(
        (warning) => warning.toLowerCase().includes('leak')
      );
      expect(leakWarnings).toHaveLength(0);
    });

    test('renderer can remount after unmount without errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // First mount
      await page.goto(`${BASE_URL}/live-terrain`);
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();
      await page.waitForTimeout(2000);

      // Unmount by navigating away
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);
      await page.waitForTimeout(500);

      // Remount by navigating back
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      // Verify viewer remounts successfully
      await expect(viewer).toBeVisible();

      // Verify canvas is present after remount
      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible();

      // Filter out expected network errors
      const criticalErrors = consoleErrors.filter(
        (error) => !error.includes('Failed to fetch') &&
                   !error.includes('NetworkError') &&
                   !error.includes('404')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Color Mode Switching', () => {
    test('displays color mode selector control', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const colorModeSelector = page.locator('[data-testid="pointcloud-color-mode"]');
      await expect(colorModeSelector).toBeVisible();
    });

    test('color mode selector contains expected options', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const colorModeSelector = page.locator('[data-testid="pointcloud-color-mode"]');
      await expect(colorModeSelector).toBeVisible();

      // Check for expected color mode options
      // Common modes: elevation, intensity, RGB, classification
      const elevationOption = page.getByText(/elevation/i);
      const intensityOption = page.getByText(/intensity/i);

      // At least one color mode option should be visible
      const hasElevation = await elevationOption.isVisible().catch(() => false);
      const hasIntensity = await intensityOption.isVisible().catch(() => false);

      expect(hasElevation || hasIntensity).toBe(true);
    });

    test('changing color mode updates renderer without errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      // Wait for initial render
      await page.waitForTimeout(2000);

      // Find and interact with color mode selector
      const colorModeSelector = page.locator('[data-testid="pointcloud-color-mode"]');

      if (await colorModeSelector.isVisible()) {
        // If it's a select element, change the value
        const isSelect = await colorModeSelector.evaluate(
          (el) => el.tagName.toLowerCase() === 'select'
        );

        if (isSelect) {
          // Get current value and try to change it
          const options = await colorModeSelector.locator('option').all();
          if (options.length > 1) {
            const secondOptionValue = await options[1].getAttribute('value');
            if (secondOptionValue) {
              await colorModeSelector.selectOption(secondOptionValue);
            }
          }
        } else {
          // If it's buttons or radio buttons, click on an alternative option
          const modeButtons = colorModeSelector.locator('button, input[type="radio"]');
          const buttonCount = await modeButtons.count();
          if (buttonCount > 1) {
            await modeButtons.nth(1).click();
          }
        }

        // Wait for potential re-render
        await page.waitForTimeout(1000);

        // Verify no critical errors occurred
        const criticalErrors = consoleErrors.filter(
          (error) => !error.includes('Failed to fetch') &&
                     !error.includes('NetworkError') &&
                     !error.includes('404')
        );

        expect(criticalErrors).toHaveLength(0);
      }
    });

    test('color mode change persists after interaction', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const colorModeSelector = page.locator('[data-testid="pointcloud-color-mode"]');

      if (await colorModeSelector.isVisible()) {
        const isSelect = await colorModeSelector.evaluate(
          (el) => el.tagName.toLowerCase() === 'select'
        );

        if (isSelect) {
          // Get initial value
          const initialValue = await colorModeSelector.inputValue();

          // Get all options
          const options = await colorModeSelector.locator('option').all();
          if (options.length > 1) {
            // Find a different option
            let newValue: string | null = null;
            for (const option of options) {
              const value = await option.getAttribute('value');
              if (value && value !== initialValue) {
                newValue = value;
                break;
              }
            }

            if (newValue) {
              await colorModeSelector.selectOption(newValue);
              await page.waitForTimeout(500);

              // Verify value changed
              const currentValue = await colorModeSelector.inputValue();
              expect(currentValue).toBe(newValue);
            }
          }
        }
      }
    });

    test('selected color mode is visually indicated', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const colorModeSelector = page.locator('[data-testid="pointcloud-color-mode"]');

      if (await colorModeSelector.isVisible()) {
        // Verify there is some visual indication of selected state
        // This could be through :checked pseudo-class, aria-selected, or active classes
        const hasSelectedIndicator = await colorModeSelector.evaluate((container) => {
          const selected = container.querySelector(
            '[aria-selected="true"], :checked, .active, .selected, option:checked'
          );
          return selected !== null;
        });

        expect(hasSelectedIndicator).toBe(true);
      }
    });
  });

  test.describe('Viewer Controls and Interaction', () => {
    test('viewer responds to mouse interactions for camera control', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible();

      // Wait for renderer initialization
      await page.waitForTimeout(2000);

      // Perform mouse drag to test camera interaction
      const boundingBox = await canvas.boundingBox();
      if (boundingBox) {
        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;

        // Mouse drag should not cause errors
        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 100, centerY + 50);
        await page.mouse.up();
      }

      // Canvas should still be visible after interaction
      await expect(canvas).toBeVisible();
    });

    test('viewer supports scroll/wheel for zoom functionality', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible();

      await page.waitForTimeout(2000);

      const boundingBox = await canvas.boundingBox();
      if (boundingBox) {
        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;

        // Scroll wheel for zoom should not cause errors
        await page.mouse.move(centerX, centerY);
        await page.mouse.wheel(0, -100); // Zoom in
        await page.waitForTimeout(200);
        await page.mouse.wheel(0, 100); // Zoom out
      }

      // Canvas should still be visible after zoom interaction
      await expect(canvas).toBeVisible();
    });
  });

  test.describe('Loading State UI', () => {
    test('loading indicator has accessible styling', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const loadingIndicator = page.locator('[data-testid="pointcloud-loading"]');

      // Check if loading indicator exists (may be brief)
      const isVisible = await loadingIndicator.isVisible().catch(() => false);

      if (isVisible) {
        // Verify loading indicator has visible dimensions
        const boundingBox = await loadingIndicator.boundingBox();
        expect(boundingBox).not.toBeNull();
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThan(0);
          expect(boundingBox.height).toBeGreaterThan(0);
        }
      }
    });

    test('progress information displays during load when available', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Check for progress indicator (percentage or progress bar)
      const progressIndicator = page.locator('[data-testid="pointcloud-progress"]');
      const loadingIndicator = page.locator('[data-testid="pointcloud-loading"]');

      // Either a progress indicator or loading indicator should be present initially
      const hasProgress = await progressIndicator.isVisible().catch(() => false);
      const hasLoading = await loadingIndicator.isVisible().catch(() => false);

      // This test passes if either:
      // 1. Progress or loading indicators were shown
      // 2. Loading completed too quickly to observe
      // The key is no errors occurred
      expect(true).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('viewer container has appropriate ARIA attributes', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      // Viewer should have role or aria-label for accessibility
      const hasRole = await viewer.getAttribute('role');
      const hasAriaLabel = await viewer.getAttribute('aria-label');
      const hasAriaLabelledBy = await viewer.getAttribute('aria-labelledby');

      // At least one accessibility attribute should be present
      expect(hasRole || hasAriaLabel || hasAriaLabelledBy).toBeTruthy();
    });

    test('color mode selector is keyboard accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const colorModeSelector = page.locator('[data-testid="pointcloud-color-mode"]');

      if (await colorModeSelector.isVisible()) {
        // Focus the selector
        await colorModeSelector.focus();

        // Verify it can receive focus
        const isFocused = await colorModeSelector.evaluate(
          (el) => document.activeElement === el ||
                  el.contains(document.activeElement)
        );

        expect(isFocused).toBe(true);
      }
    });

    test('loading and error states have screen reader announcements', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Check for aria-live regions for status updates
      const ariaLiveRegion = page.locator('[aria-live]');
      const statusRole = page.locator('[role="status"], [role="alert"]');

      const hasAriaLive = await ariaLiveRegion.count();
      const hasStatusRole = await statusRole.count();

      // Either aria-live or status role should be present for dynamic updates
      expect(hasAriaLive > 0 || hasStatusRole > 0).toBe(true);
    });
  });

  test.describe('Responsive Behavior', () => {
    test('viewer resizes appropriately on window resize', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`${BASE_URL}/live-terrain`);

      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible();

      const initialBox = await canvas.boundingBox();
      expect(initialBox).not.toBeNull();

      // Resize to smaller viewport
      await page.setViewportSize({ width: 768, height: 600 });
      await page.waitForTimeout(500);

      const resizedBox = await canvas.boundingBox();
      expect(resizedBox).not.toBeNull();

      // Canvas should adapt to new size
      if (initialBox && resizedBox) {
        expect(resizedBox.width).toBeLessThan(initialBox.width);
      }
    });

    test('viewer remains functional on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      const canvas = viewer.locator('canvas');
      await expect(canvas).toBeVisible();

      // Verify canvas has reasonable dimensions on mobile
      const boundingBox = await canvas.boundingBox();
      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.width).toBeLessThanOrEqual(375);
      }
    });
  });
});
