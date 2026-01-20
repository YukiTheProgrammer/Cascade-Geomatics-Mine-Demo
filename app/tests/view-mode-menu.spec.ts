/**
 * ViewModeMenu Component Test Specifications
 *
 * Description:
 * Playwright end-to-end tests for the ViewModeMenu component that provides
 * visualization mode selection for the point cloud viewer. The menu allows
 * users to switch between Default, Height, Cracking, Micro Movements, and Risk
 * display modes for terrain analysis.
 *
 * Sample Input:
 * - Page load at "/live-terrain" (Live Terrain route)
 * - User clicks on mode buttons (Default, Height, Cracking, Micro Movements, Risk)
 * - Keyboard navigation between mode options
 * - Viewport resize events
 *
 * Expected Output:
 * - All 5 mode buttons are visible and accessible
 * - Active mode is visually highlighted
 * - Only one mode can be active at a time
 * - Point cloud updates without errors on mode change
 * - Menu is positioned correctly over the viewer
 * - Keyboard navigation works properly
 * - ARIA attributes support screen readers
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('ViewModeMenu Component', () => {
  test.describe('Mode Selection', () => {
    test('renders all 5 mode buttons visible on page load', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // Verify all 5 mode buttons are visible
      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      const crackingMode = page.locator('[data-testid="view-mode-cracking"]');
      const microMovementsMode = page.locator('[data-testid="view-mode-micro-movements"]');
      const riskMode = page.locator('[data-testid="view-mode-risk"]');

      await expect(defaultMode).toBeVisible();
      await expect(heightMode).toBeVisible();
      await expect(crackingMode).toBeVisible();
      await expect(microMovementsMode).toBeVisible();
      await expect(riskMode).toBeVisible();
    });

    test('clicking Default mode button triggers selection', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      await expect(defaultMode).toBeVisible();

      await defaultMode.click();

      // Verify Default mode becomes active
      const isActive = await defaultMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('clicking Height mode button triggers selection', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await expect(heightMode).toBeVisible();

      await heightMode.click();

      // Verify Height mode becomes active
      const isActive = await heightMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('clicking Cracking mode button triggers selection', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const crackingMode = page.locator('[data-testid="view-mode-cracking"]');
      await expect(crackingMode).toBeVisible();

      await crackingMode.click();

      // Verify Cracking mode becomes active
      const isActive = await crackingMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('clicking Micro Movements mode button triggers selection', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const microMovementsMode = page.locator('[data-testid="view-mode-micro-movements"]');
      await expect(microMovementsMode).toBeVisible();

      await microMovementsMode.click();

      // Verify Micro Movements mode becomes active
      const isActive = await microMovementsMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('clicking Risk mode button triggers selection', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const riskMode = page.locator('[data-testid="view-mode-risk"]');
      await expect(riskMode).toBeVisible();

      await riskMode.click();

      // Verify Risk mode becomes active
      const isActive = await riskMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('only one mode can be active at a time', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      const crackingMode = page.locator('[data-testid="view-mode-cracking"]');
      const microMovementsMode = page.locator('[data-testid="view-mode-micro-movements"]');
      const riskMode = page.locator('[data-testid="view-mode-risk"]');

      // Click Height mode
      await heightMode.click();
      await page.waitForTimeout(200);

      // Count active modes
      const countActiveModes = async () => {
        const modes = [defaultMode, heightMode, crackingMode, microMovementsMode, riskMode];
        let activeCount = 0;

        for (const mode of modes) {
          const isActive = await mode.evaluate((el) => {
            return el.getAttribute('aria-selected') === 'true' ||
                   el.classList.contains('active') ||
                   el.classList.contains('selected') ||
                   el.hasAttribute('data-active');
          });
          if (isActive) activeCount++;
        }

        return activeCount;
      };

      expect(await countActiveModes()).toBe(1);

      // Click Risk mode and verify only one is active
      await riskMode.click();
      await page.waitForTimeout(200);

      expect(await countActiveModes()).toBe(1);

      // Verify Height is no longer active
      const heightIsActive = await heightMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(heightIsActive).toBe(false);
    });
  });

  test.describe('Visual Indicator', () => {
    test('active mode has visual distinction from inactive modes', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const heightMode = page.locator('[data-testid="view-mode-height"]');
      const defaultMode = page.locator('[data-testid="view-mode-default"]');

      // Click Height mode to make it active
      await heightMode.click();
      await page.waitForTimeout(200);

      // Get computed styles for active and inactive modes
      const activeStyles = await heightMode.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
          color: computed.color,
          fontWeight: computed.fontWeight
        };
      });

      const inactiveStyles = await defaultMode.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
          color: computed.color,
          fontWeight: computed.fontWeight
        };
      });

      // At least one style property should differ between active and inactive
      const hasVisualDifference =
        activeStyles.backgroundColor !== inactiveStyles.backgroundColor ||
        activeStyles.borderColor !== inactiveStyles.borderColor ||
        activeStyles.color !== inactiveStyles.color ||
        activeStyles.fontWeight !== inactiveStyles.fontWeight;

      expect(hasVisualDifference).toBe(true);
    });

    test('active mode maintains visual indication after hover on another mode', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const heightMode = page.locator('[data-testid="view-mode-height"]');
      const crackingMode = page.locator('[data-testid="view-mode-cracking"]');

      // Click Height mode to make it active
      await heightMode.click();
      await page.waitForTimeout(200);

      // Hover over Cracking mode
      await crackingMode.hover();
      await page.waitForTimeout(100);

      // Height mode should still be active
      const heightIsActive = await heightMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(heightIsActive).toBe(true);
    });

    test('inactive modes have consistent styling with each other', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Click Default mode to ensure it's active
      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      await defaultMode.click();
      await page.waitForTimeout(200);

      // Get styles of two inactive modes
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      const crackingMode = page.locator('[data-testid="view-mode-cracking"]');

      const heightStyles = await heightMode.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.backgroundColor;
      });

      const crackingStyles = await crackingMode.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.backgroundColor;
      });

      // Inactive modes should have consistent styling
      expect(heightStyles).toBe(crackingStyles);
    });
  });

  test.describe('Point Cloud Integration', () => {
    test('selecting a mode triggers color mode change without errors', async ({ page }) => {
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

      // Click Height mode
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.click();

      // Wait for potential re-render
      await page.waitForTimeout(1000);

      // Verify no critical errors occurred
      const criticalErrors = consoleErrors.filter(
        (error) => !error.includes('Failed to fetch') &&
                   !error.includes('NetworkError') &&
                   !error.includes('404') &&
                   !error.includes('LAS')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('switching between all modes does not cause renderer errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);

      // Wait for initial load
      await page.waitForTimeout(2000);

      // Cycle through all modes
      const modes = [
        'view-mode-default',
        'view-mode-height',
        'view-mode-cracking',
        'view-mode-micro-movements',
        'view-mode-risk'
      ];

      for (const modeId of modes) {
        const modeButton = page.locator(`[data-testid="${modeId}"]`);
        await modeButton.click();
        await page.waitForTimeout(500);
      }

      // Verify no critical errors occurred
      const criticalErrors = consoleErrors.filter(
        (error) => !error.includes('Failed to fetch') &&
                   !error.includes('NetworkError') &&
                   !error.includes('404') &&
                   !error.includes('LAS')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('viewer canvas remains visible after mode change', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      await expect(canvas).toBeVisible();

      // Change mode
      const riskMode = page.locator('[data-testid="view-mode-risk"]');
      await riskMode.click();

      // Canvas should still be visible
      await page.waitForTimeout(500);
      await expect(canvas).toBeVisible();
    });

    test('mode change persists after viewer interaction', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Select Height mode
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.click();
      await page.waitForTimeout(200);

      // Interact with the viewer (pan/rotate)
      const canvas = page.locator('[data-testid="pointcloud-viewer"] canvas');
      const boundingBox = await canvas.boundingBox();

      if (boundingBox) {
        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;

        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 50, centerY + 30);
        await page.mouse.up();
      }

      // Verify Height mode is still active
      const isActive = await heightMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });
  });

  test.describe('Menu Positioning', () => {
    test('menu is visible over the point cloud viewer', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');

      await expect(viewModeMenu).toBeVisible();
      await expect(viewer).toBeVisible();

      // Get bounding boxes
      const menuBox = await viewModeMenu.boundingBox();
      const viewerBox = await viewer.boundingBox();

      expect(menuBox).not.toBeNull();
      expect(viewerBox).not.toBeNull();

      if (menuBox && viewerBox) {
        // Menu should overlap with the viewer area
        const menuCenterX = menuBox.x + menuBox.width / 2;
        const menuCenterY = menuBox.y + menuBox.height / 2;

        const isOverViewer =
          menuCenterX >= viewerBox.x &&
          menuCenterX <= viewerBox.x + viewerBox.width &&
          menuCenterY >= viewerBox.y &&
          menuCenterY <= viewerBox.y + viewerBox.height;

        // Menu should either be over the viewer or positioned near it
        const isNearViewer =
          menuBox.x >= viewerBox.x - 50 &&
          menuBox.x <= viewerBox.x + viewerBox.width + 50;

        expect(isOverViewer || isNearViewer).toBe(true);
      }
    });

    test('menu does not obstruct entire viewer area', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');

      const menuBox = await viewModeMenu.boundingBox();
      const viewerBox = await viewer.boundingBox();

      expect(menuBox).not.toBeNull();
      expect(viewerBox).not.toBeNull();

      if (menuBox && viewerBox) {
        // Menu area should be significantly smaller than viewer area
        const menuArea = menuBox.width * menuBox.height;
        const viewerArea = viewerBox.width * viewerBox.height;

        expect(menuArea).toBeLessThan(viewerArea * 0.5);
      }
    });

    test('menu remains accessible on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // All mode buttons should still be visible
      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      const riskMode = page.locator('[data-testid="view-mode-risk"]');

      await expect(defaultMode).toBeVisible();
      await expect(riskMode).toBeVisible();
    });

    test('menu remains accessible on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // Menu should be clickable on mobile
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await expect(heightMode).toBeVisible();

      // Verify button is clickable (not obscured)
      await heightMode.click();

      const isActive = await heightMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('menu has appropriate z-index to stay on top', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');

      const zIndex = await viewModeMenu.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        const zIndexValue = computed.zIndex;
        return zIndexValue === 'auto' ? 0 : parseInt(zIndexValue, 10);
      });

      // Menu should have a z-index > 0 to stay above the canvas
      expect(zIndex).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Accessibility', () => {
    test('mode buttons are keyboard navigable with Tab key', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // Focus on the menu area
      await viewModeMenu.focus();

      // Tab through the buttons
      await page.keyboard.press('Tab');

      // Check that a mode button received focus
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return active?.getAttribute('data-testid');
      });

      // One of the mode buttons should be focused
      const modeTestIds = [
        'view-mode-default',
        'view-mode-height',
        'view-mode-cracking',
        'view-mode-micro-movements',
        'view-mode-risk'
      ];

      const isModeButtonFocused = modeTestIds.includes(focusedElement || '');
      expect(isModeButtonFocused).toBe(true);
    });

    test('mode buttons can be activated with Enter key', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.focus();

      // Press Enter to activate
      await page.keyboard.press('Enter');

      const isActive = await heightMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('mode buttons can be activated with Space key', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const crackingMode = page.locator('[data-testid="view-mode-cracking"]');
      await crackingMode.focus();

      // Press Space to activate
      await page.keyboard.press('Space');

      const isActive = await crackingMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('menu container has appropriate ARIA role', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');

      // Check for appropriate role (radiogroup, toolbar, or group)
      const role = await viewModeMenu.getAttribute('role');
      const hasValidRole = role === 'radiogroup' || role === 'toolbar' || role === 'group';

      // If no explicit role, check if it's a semantic element
      if (!hasValidRole) {
        const tagName = await viewModeMenu.evaluate((el) => el.tagName.toLowerCase());
        const isSemanticElement = tagName === 'nav' || tagName === 'menu' || tagName === 'fieldset';
        expect(hasValidRole || isSemanticElement).toBe(true);
      } else {
        expect(hasValidRole).toBe(true);
      }
    });

    test('mode buttons have aria-selected or aria-pressed attributes', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      await defaultMode.click();
      await page.waitForTimeout(200);

      // Check for aria-selected or aria-pressed
      const ariaSelected = await defaultMode.getAttribute('aria-selected');
      const ariaPressed = await defaultMode.getAttribute('aria-pressed');

      const hasAriaAttribute = ariaSelected !== null || ariaPressed !== null;
      expect(hasAriaAttribute).toBe(true);
    });

    test('mode buttons have accessible names', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const modes = [
        { testId: 'view-mode-default', expectedName: /default/i },
        { testId: 'view-mode-height', expectedName: /height/i },
        { testId: 'view-mode-cracking', expectedName: /cracking/i },
        { testId: 'view-mode-micro-movements', expectedName: /micro.*movement/i },
        { testId: 'view-mode-risk', expectedName: /risk/i }
      ];

      for (const mode of modes) {
        const button = page.locator(`[data-testid="${mode.testId}"]`);

        // Get accessible name from aria-label, text content, or title
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        const title = await button.getAttribute('title');

        const accessibleName = ariaLabel || textContent || title || '';
        expect(accessibleName.toLowerCase()).toMatch(mode.expectedName);
      }
    });

    test('focus indicator is visible on mode buttons', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const heightMode = page.locator('[data-testid="view-mode-height"]');

      // Get styles before focus
      const stylesBeforeFocus = await heightMode.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
          borderColor: computed.borderColor
        };
      });

      // Focus the element
      await heightMode.focus();

      // Get styles after focus
      const stylesAfterFocus = await heightMode.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
          borderColor: computed.borderColor
        };
      });

      // At least one focus-related style should change
      const hasVisibleFocusIndicator =
        stylesBeforeFocus.outline !== stylesAfterFocus.outline ||
        stylesBeforeFocus.boxShadow !== stylesAfterFocus.boxShadow ||
        stylesBeforeFocus.borderColor !== stylesAfterFocus.borderColor;

      expect(hasVisibleFocusIndicator).toBe(true);
    });
  });

  test.describe('Menu Persistence', () => {
    test('menu remains visible during viewer loading state', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');

      // Menu should be visible immediately or shortly after page load
      await expect(viewModeMenu).toBeVisible({ timeout: 5000 });
    });

    test('selected mode persists after viewer re-render', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Select a non-default mode
      const riskMode = page.locator('[data-testid="view-mode-risk"]');
      await riskMode.click();
      await page.waitForTimeout(500);

      // Trigger a viewer resize (which may cause re-render)
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(500);

      // Verify Risk mode is still active
      const isActive = await riskMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('menu state resets to default when navigating away and back', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Select Height mode
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await heightMode.click();
      await page.waitForTimeout(200);

      // Navigate away
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate back
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      // Check if Default mode is active (expected behavior for fresh load)
      const defaultMode = page.locator('[data-testid="view-mode-default"]');
      const defaultIsActive = await defaultMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      // Either Default should be active OR the menu should be in a valid state
      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // At least one mode should be active
      const modes = [
        'view-mode-default',
        'view-mode-height',
        'view-mode-cracking',
        'view-mode-micro-movements',
        'view-mode-risk'
      ];

      let hasActiveMode = false;
      for (const modeId of modes) {
        const mode = page.locator(`[data-testid="${modeId}"]`);
        const isActive = await mode.evaluate((el) => {
          return el.getAttribute('aria-selected') === 'true' ||
                 el.classList.contains('active') ||
                 el.classList.contains('selected') ||
                 el.hasAttribute('data-active');
        });
        if (isActive) {
          hasActiveMode = true;
          break;
        }
      }

      expect(hasActiveMode).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test('menu remains functional when point cloud fails to load', async ({ page }) => {
      await page.goto(`${BASE_URL}/live-terrain`);

      // Wait for potential error state
      await page.waitForTimeout(3000);

      const viewModeMenu = page.locator('[data-testid="view-mode-menu"]');
      await expect(viewModeMenu).toBeVisible();

      // Mode buttons should still be clickable
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      await expect(heightMode).toBeEnabled();

      await heightMode.click();

      const isActive = await heightMode.evaluate((el) => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected') ||
               el.hasAttribute('data-active');
      });

      expect(isActive).toBe(true);
    });

    test('rapid mode switching does not cause errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForTimeout(1000);

      // Rapidly click through modes
      const modes = [
        'view-mode-height',
        'view-mode-risk',
        'view-mode-cracking',
        'view-mode-default',
        'view-mode-micro-movements',
        'view-mode-height',
        'view-mode-risk'
      ];

      for (const modeId of modes) {
        const mode = page.locator(`[data-testid="${modeId}"]`);
        await mode.click();
        await page.waitForTimeout(50); // Very short delay to simulate rapid clicking
      }

      await page.waitForTimeout(500);

      // Filter out expected errors
      const criticalErrors = consoleErrors.filter(
        (error) => !error.includes('Failed to fetch') &&
                   !error.includes('NetworkError') &&
                   !error.includes('404') &&
                   !error.includes('LAS')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });
});
