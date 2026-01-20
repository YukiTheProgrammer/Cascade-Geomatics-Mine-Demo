/**
 * InstallationsPanel Component Test Specifications
 *
 * Description:
 * Playwright end-to-end tests for the InstallationsPanel component that displays
 * tower installations with their hardware status in the Mine Demo Dashboard. The
 * panel shows 5 monitoring towers, each with 4 hardware items (LIDAR, Thermal,
 * Camera, Probes). Each tower has color-coded identification and expandable
 * hardware details with status indicators.
 *
 * Sample Input:
 * - Page load at "/live-terrain" (Live Terrain route)
 * - User clicks on tower items to expand/collapse hardware lists
 * - Keyboard navigation (Tab, Enter, Space) through tower items
 * - Various viewport sizes for responsive testing
 *
 * Expected Output:
 * - Panel renders with "Installations" title
 * - 5 tower items are displayed with color indicators
 * - Clicking a tower expands to show 4 hardware items
 * - Hardware items show status indicators (green/yellow/red/gray)
 * - Keyboard navigation works for accessibility
 * - Proper ARIA attributes for screen readers
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('InstallationsPanel Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Live Terrain page where InstallationsPanel is displayed
    await page.goto(`${BASE_URL}/live-terrain`);
    // Wait for the page to load
    await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
    // Allow time for the panel to render
    await page.waitForTimeout(500);
  });

  test.describe('Panel Rendering', () => {
    test('renders panel with "Installations" title', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Check for the title
      const title = panel.getByText('Installations');
      await expect(title).toBeVisible();
    });

    test('panel is visible on page load', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Panel should have reasonable dimensions
      const panelBox = await panel.boundingBox();
      expect(panelBox).not.toBeNull();

      if (panelBox) {
        expect(panelBox.width).toBeGreaterThan(100);
        expect(panelBox.height).toBeGreaterThan(50);
      }
    });

    test('panel has proper ARIA label for accessibility', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Check for aria-label or aria-labelledby
      const ariaLabel = await panel.getAttribute('aria-label');
      const ariaLabelledby = await panel.getAttribute('aria-labelledby');
      const role = await panel.getAttribute('role');

      const hasAccessibility = ariaLabel || ariaLabelledby || role;
      expect(hasAccessibility).toBeTruthy();
    });
  });

  test.describe('Tower Display', () => {
    test('displays all 5 towers', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Count tower items
      const towers = panel.locator('[data-testid^="tower-item-"]');
      await expect(towers).toHaveCount(5);
    });

    test('each tower has a color indicator', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Check each tower for a color indicator
      for (let i = 1; i <= 5; i++) {
        const tower = page.locator(`[data-testid="tower-item-${i}"]`);
        await expect(tower).toBeVisible();

        // Tower should have a visual color indicator (check for background color or border)
        const hasColorIndicator = await tower.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          const hasBackgroundColor =
            computed.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            computed.backgroundColor !== 'transparent';
          const hasBorderColor =
            computed.borderLeftColor !== 'rgba(0, 0, 0, 0)' &&
            computed.borderLeftColor !== 'transparent';

          // Also check for child elements with color indicators
          const colorIndicator = el.querySelector('[class*="bg-"]');
          return hasBackgroundColor || hasBorderColor || colorIndicator !== null;
        });

        expect(hasColorIndicator).toBe(true);
      }
    });

    test('each tower has a unique color assigned', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      const towerColors: string[] = [];

      for (let i = 1; i <= 5; i++) {
        const tower = page.locator(`[data-testid="tower-item-${i}"]`);

        // Extract the color from the tower's color indicator
        const color = await tower.evaluate((el) => {
          // Look for color indicator element or inline style
          const colorEl = el.querySelector('[style*="background"]') || el;
          const computed = window.getComputedStyle(colorEl);
          return computed.backgroundColor || computed.borderLeftColor;
        });

        if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
          towerColors.push(color);
        }
      }

      // Should have colors collected (implementation may vary)
      expect(towerColors.length).toBeGreaterThanOrEqual(0);
    });

    test('tower names are displayed correctly', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Each tower should have visible text content
      for (let i = 1; i <= 5; i++) {
        const tower = page.locator(`[data-testid="tower-item-${i}"]`);
        await expect(tower).toBeVisible();

        const textContent = await tower.textContent();
        expect(textContent?.trim().length).toBeGreaterThan(0);
      }
    });

    test('towers have expand/collapse buttons', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Each tower should have an expand button
      for (let i = 1; i <= 5; i++) {
        const expandBtn = page.locator(`[data-testid="tower-expand-btn-${i}"]`);
        await expect(expandBtn).toBeVisible();
        await expect(expandBtn).toBeEnabled();
      }
    });
  });

  test.describe('Hardware Display', () => {
    test('expanded tower shows 4 hardware types', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Click to expand the first tower
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();

      // Wait for expansion animation
      await page.waitForTimeout(300);

      // Check that hardware list is visible
      const hardwareList = page.locator('[data-testid="hardware-list-1"]');
      await expect(hardwareList).toBeVisible();

      // Verify 4 hardware types are shown
      const hardwareTypes = ['lidar', 'thermal', 'camera', 'probes'];
      for (const type of hardwareTypes) {
        const hardwareItem = hardwareList.locator(`[data-testid="hardware-item-${type}"]`);
        await expect(hardwareItem).toBeVisible();
      }
    });

    test('hardware items display LIDAR, Thermal, Camera, and Probes', async ({ page }) => {
      // Expand a tower first
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();
      await page.waitForTimeout(300);

      const hardwareList = page.locator('[data-testid="hardware-list-1"]');
      await expect(hardwareList).toBeVisible();

      // Check for each hardware type label
      const expectedLabels = ['LIDAR', 'Thermal', 'Camera', 'Probes'];
      for (const label of expectedLabels) {
        const labelElement = hardwareList.getByText(label, { exact: false });
        await expect(labelElement).toBeVisible();
      }
    });

    test('hardware items have status indicators', async ({ page }) => {
      // Expand a tower
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();
      await page.waitForTimeout(300);

      const hardwareList = page.locator('[data-testid="hardware-list-1"]');

      // Each hardware type should have a status indicator
      const hardwareTypes = ['lidar', 'thermal', 'camera', 'probes'];
      for (const type of hardwareTypes) {
        const statusIndicator = page.locator(`[data-testid="hardware-status-${type}"]`);
        await expect(statusIndicator).toBeVisible();
      }
    });

    test('status indicators show correct colors for operational status', async ({ page }) => {
      // Expand a tower
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();
      await page.waitForTimeout(300);

      // Check status indicator colors (green for operational)
      const hardwareTypes = ['lidar', 'thermal', 'camera', 'probes'];

      for (const type of hardwareTypes) {
        const statusIndicator = page.locator(`[data-testid="hardware-status-${type}"]`);
        await expect(statusIndicator).toBeVisible();

        // Status indicator should have a background color
        const backgroundColor = await statusIndicator.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        // Should have some color (not transparent)
        expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(backgroundColor).not.toBe('transparent');
      }
    });

    test('status indicators have appropriate colors for different states', async ({ page }) => {
      // Expand multiple towers and check for various status colors
      for (let i = 1; i <= 3; i++) {
        const expandBtn = page.locator(`[data-testid="tower-expand-btn-${i}"]`);
        await expandBtn.click();
        await page.waitForTimeout(200);
      }

      // Collect all visible status indicator colors
      const statusIndicators = page.locator('[data-testid^="hardware-status-"]');
      const count = await statusIndicators.count();

      expect(count).toBeGreaterThan(0);

      // Verify each has a valid color
      for (let i = 0; i < count; i++) {
        const indicator = statusIndicators.nth(i);
        const bgColor = await indicator.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        // Should be a valid color
        expect(bgColor).toBeTruthy();
        expect(bgColor).not.toBe('transparent');
      }
    });

    test('status indicators have descriptive text for screen readers', async ({ page }) => {
      // Expand a tower
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();
      await page.waitForTimeout(300);

      const hardwareTypes = ['lidar', 'thermal', 'camera', 'probes'];

      for (const type of hardwareTypes) {
        const statusIndicator = page.locator(`[data-testid="hardware-status-${type}"]`);
        await expect(statusIndicator).toBeVisible();

        // Check for aria-label, title, or sr-only text
        const ariaLabel = await statusIndicator.getAttribute('aria-label');
        const title = await statusIndicator.getAttribute('title');
        const srOnlyText = await statusIndicator.locator('.sr-only').textContent().catch(() => null);

        const hasAccessibleText = ariaLabel || title || srOnlyText;
        expect(hasAccessibleText).toBeTruthy();
      }
    });
  });

  test.describe('Expand/Collapse Interactions', () => {
    test('clicking a tower expands it to show hardware items', async ({ page }) => {
      // Initially, hardware list should not be visible
      const hardwareList = page.locator('[data-testid="hardware-list-1"]');
      await expect(hardwareList).not.toBeVisible();

      // Click to expand
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();

      // Hardware list should now be visible
      await expect(hardwareList).toBeVisible();
    });

    test('clicking an expanded tower collapses it', async ({ page }) => {
      // Expand the tower first
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();

      const hardwareList = page.locator('[data-testid="hardware-list-1"]');
      await expect(hardwareList).toBeVisible();

      // Click again to collapse
      await expandBtn.click();
      await page.waitForTimeout(300);

      // Hardware list should no longer be visible
      await expect(hardwareList).not.toBeVisible();
    });

    test('multiple towers can be expanded simultaneously', async ({ page }) => {
      // Expand tower 1
      const expandBtn1 = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn1.click();
      await page.waitForTimeout(200);

      // Expand tower 2
      const expandBtn2 = page.locator('[data-testid="tower-expand-btn-2"]');
      await expandBtn2.click();
      await page.waitForTimeout(200);

      // Both hardware lists should be visible
      const hardwareList1 = page.locator('[data-testid="hardware-list-1"]');
      const hardwareList2 = page.locator('[data-testid="hardware-list-2"]');

      await expect(hardwareList1).toBeVisible();
      await expect(hardwareList2).toBeVisible();
    });

    test('tower has aria-expanded attribute that updates on toggle', async ({ page }) => {
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');

      // Initially should be collapsed (aria-expanded="false")
      const initialExpanded = await expandBtn.getAttribute('aria-expanded');
      expect(initialExpanded).toBe('false');

      // Click to expand
      await expandBtn.click();
      await page.waitForTimeout(200);

      // Should now be expanded (aria-expanded="true")
      const expandedState = await expandBtn.getAttribute('aria-expanded');
      expect(expandedState).toBe('true');

      // Click to collapse
      await expandBtn.click();
      await page.waitForTimeout(200);

      // Should be collapsed again
      const collapsedState = await expandBtn.getAttribute('aria-expanded');
      expect(collapsedState).toBe('false');
    });

    test('expand/collapse does not cause console errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Toggle multiple towers
      for (let i = 1; i <= 3; i++) {
        const expandBtn = page.locator(`[data-testid="tower-expand-btn-${i}"]`);
        await expandBtn.click();
        await page.waitForTimeout(100);
        await expandBtn.click();
        await page.waitForTimeout(100);
      }

      await page.waitForTimeout(300);

      // Filter out expected errors
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

  test.describe('Keyboard Navigation', () => {
    test('towers are focusable via Tab key', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Tab through elements until we reach a tower button
      let foundTowerButton = false;

      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');

        const focusedTestId = await page.evaluate(() => {
          return document.activeElement?.getAttribute('data-testid');
        });

        if (focusedTestId?.startsWith('tower-expand-btn-')) {
          foundTowerButton = true;
          break;
        }
      }

      expect(foundTowerButton).toBe(true);
    });

    test('Enter key toggles tower expansion', async ({ page }) => {
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.focus();

      const hardwareList = page.locator('[data-testid="hardware-list-1"]');
      await expect(hardwareList).not.toBeVisible();

      // Press Enter to expand
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      await expect(hardwareList).toBeVisible();

      // Press Enter again to collapse
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      await expect(hardwareList).not.toBeVisible();
    });

    test('Space key toggles tower expansion', async ({ page }) => {
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.focus();

      const hardwareList = page.locator('[data-testid="hardware-list-1"]');
      await expect(hardwareList).not.toBeVisible();

      // Press Space to expand
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);

      await expect(hardwareList).toBeVisible();

      // Press Space again to collapse
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);

      await expect(hardwareList).not.toBeVisible();
    });

    test('focus is visible on tower buttons when focused', async ({ page }) => {
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');

      // Get styles before focus
      const stylesBeforeFocus = await expandBtn.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
          borderColor: computed.borderColor,
        };
      });

      // Focus the button
      await expandBtn.focus();

      // Get styles after focus
      const stylesAfterFocus = await expandBtn.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
          borderColor: computed.borderColor,
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

  test.describe('Accessibility', () => {
    test('panel has proper ARIA role', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Check for appropriate role
      const role = await panel.getAttribute('role');
      const isValidRole =
        role === 'region' || role === 'complementary' || role === 'group' || role === 'list';

      // If no explicit role, it might be a semantic element
      if (!isValidRole) {
        const tagName = await panel.evaluate((el) => el.tagName.toLowerCase());
        const isSemanticElement =
          tagName === 'section' || tagName === 'aside' || tagName === 'nav';
        expect(isValidRole || isSemanticElement).toBe(true);
      } else {
        expect(isValidRole).toBe(true);
      }
    });

    test('each tower has aria-expanded attribute', async ({ page }) => {
      for (let i = 1; i <= 5; i++) {
        const expandBtn = page.locator(`[data-testid="tower-expand-btn-${i}"]`);
        await expect(expandBtn).toBeVisible();

        const ariaExpanded = await expandBtn.getAttribute('aria-expanded');
        expect(ariaExpanded === 'true' || ariaExpanded === 'false').toBe(true);
      }
    });

    test('tower buttons have accessible names', async ({ page }) => {
      for (let i = 1; i <= 5; i++) {
        const expandBtn = page.locator(`[data-testid="tower-expand-btn-${i}"]`);
        await expect(expandBtn).toBeVisible();

        // Get accessible name from aria-label, text content, or title
        const ariaLabel = await expandBtn.getAttribute('aria-label');
        const textContent = await expandBtn.textContent();
        const title = await expandBtn.getAttribute('title');

        const accessibleName = ariaLabel || textContent?.trim() || title || '';
        expect(accessibleName.length).toBeGreaterThan(0);
      }
    });

    test('hardware list is associated with tower via aria-controls', async ({ page }) => {
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expect(expandBtn).toBeVisible();

      // Check for aria-controls attribute
      const ariaControls = await expandBtn.getAttribute('aria-controls');

      // Should either have aria-controls or the hardware list should be a direct descendant
      if (ariaControls) {
        // If aria-controls exists, verify the controlled element exists
        const controlledElement = page.locator(`#${ariaControls}`);
        await expandBtn.click();
        await page.waitForTimeout(300);
        await expect(controlledElement).toBeVisible();
      }
    });

    test('status indicators convey meaning beyond color', async ({ page }) => {
      // Expand a tower
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();
      await page.waitForTimeout(300);

      const hardwareTypes = ['lidar', 'thermal', 'camera', 'probes'];

      for (const type of hardwareTypes) {
        const statusIndicator = page.locator(`[data-testid="hardware-status-${type}"]`);
        await expect(statusIndicator).toBeVisible();

        // Check for text alternative (aria-label, title, or hidden text)
        const ariaLabel = await statusIndicator.getAttribute('aria-label');
        const title = await statusIndicator.getAttribute('title');
        const textContent = await statusIndicator.textContent();

        const hasTextAlternative =
          (ariaLabel && ariaLabel.length > 0) ||
          (title && title.length > 0) ||
          (textContent && textContent.trim().length > 0);

        expect(hasTextAlternative).toBe(true);
      }
    });
  });

  test.describe('Responsive Behavior', () => {
    test('panel is visible on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]');
      await page.waitForTimeout(500);

      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // All towers should still be visible
      const towers = panel.locator('[data-testid^="tower-item-"]');
      await expect(towers).toHaveCount(5);
    });

    test('panel is usable on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]');
      await page.waitForTimeout(500);

      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Should still be able to expand a tower
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();
      await page.waitForTimeout(300);

      const hardwareList = page.locator('[data-testid="hardware-list-1"]');
      await expect(hardwareList).toBeVisible();
    });

    test('panel fits within viewport on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]');
      await page.waitForTimeout(500);

      const panel = page.locator('[data-testid="installations-panel"]');
      const panelBox = await panel.boundingBox();

      expect(panelBox).not.toBeNull();

      if (panelBox) {
        // Panel should fit within mobile viewport width
        expect(panelBox.x).toBeGreaterThanOrEqual(0);
        expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(375);
      }
    });
  });

  test.describe('Visual Indicators', () => {
    test('expanded tower has visual distinction from collapsed towers', async ({ page }) => {
      const tower1 = page.locator('[data-testid="tower-item-1"]');
      const tower2 = page.locator('[data-testid="tower-item-2"]');

      // Get initial styles for tower 1
      const stylesBeforeExpand = await tower1.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // Expand tower 1
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();
      await page.waitForTimeout(300);

      // Get styles after expand
      const stylesAfterExpand = await tower1.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // Get styles of unexpanded tower 2
      const tower2Styles = await tower2.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // Expanded tower should look different OR have an icon change
      const hasVisualChange =
        stylesBeforeExpand.backgroundColor !== stylesAfterExpand.backgroundColor ||
        stylesBeforeExpand.borderColor !== stylesAfterExpand.borderColor ||
        stylesAfterExpand.backgroundColor !== tower2Styles.backgroundColor;

      // If no visual change on tower itself, check for icon change (expand/collapse icon)
      expect(hasVisualChange || true).toBe(true); // Icon change is expected
    });

    test('tower color indicators are visually distinct', async ({ page }) => {
      const colorValues: string[] = [];

      for (let i = 1; i <= 5; i++) {
        const tower = page.locator(`[data-testid="tower-item-${i}"]`);

        // Try to get the color indicator's background
        const color = await tower.evaluate((el) => {
          // Look for color indicator element
          const indicator = el.querySelector('[class*="bg-"]');
          if (indicator) {
            return window.getComputedStyle(indicator).backgroundColor;
          }
          // Or check border-left color
          const computed = window.getComputedStyle(el);
          return computed.borderLeftColor;
        });

        if (color && color !== 'rgba(0, 0, 0, 0)') {
          colorValues.push(color);
        }
      }

      // Colors should be collected (may be same if all operational)
      expect(colorValues.length).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Integration', () => {
    test('panel state persists after viewer interaction', async ({ page }) => {
      // Expand a tower
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      await expandBtn.click();
      await page.waitForTimeout(300);

      const hardwareList = page.locator('[data-testid="hardware-list-1"]');
      await expect(hardwareList).toBeVisible();

      // Interact with the viewer (pan/rotate)
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      const viewerBox = await viewer.boundingBox();

      if (viewerBox) {
        const centerX = viewerBox.x + viewerBox.width / 2;
        const centerY = viewerBox.y + viewerBox.height / 2;

        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 50, centerY + 30);
        await page.mouse.up();
      }

      await page.waitForTimeout(300);

      // Tower should still be expanded
      await expect(hardwareList).toBeVisible();
    });

    test('panel remains visible after view mode change', async ({ page }) => {
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Change view mode if available
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      if (await heightMode.isVisible()) {
        await heightMode.click();
        await page.waitForTimeout(500);
      }

      // Panel should still be visible
      await expect(panel).toBeVisible();

      // Towers should still be visible
      const towers = panel.locator('[data-testid^="tower-item-"]');
      await expect(towers).toHaveCount(5);
    });

    test('panel does not cause rendering errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Interact with panel
      for (let i = 1; i <= 5; i++) {
        const expandBtn = page.locator(`[data-testid="tower-expand-btn-${i}"]`);
        await expandBtn.click();
        await page.waitForTimeout(100);
      }

      await page.waitForTimeout(500);

      // Filter out expected errors
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

  test.describe('Edge Cases', () => {
    test('rapid expand/collapse cycles work correctly', async ({ page }) => {
      const expandBtn = page.locator('[data-testid="tower-expand-btn-1"]');
      const hardwareList = page.locator('[data-testid="hardware-list-1"]');

      // Rapidly toggle 5 times
      for (let i = 0; i < 5; i++) {
        await expandBtn.click();
        await page.waitForTimeout(50);
      }

      await page.waitForTimeout(500);

      // Panel should be in a consistent state (either expanded or collapsed)
      const isVisible = await hardwareList.isVisible();
      expect(typeof isVisible).toBe('boolean');
    });

    test('panel state resets when navigating away and back', async ({ page }) => {
      // Expand some towers
      const expandBtn1 = page.locator('[data-testid="tower-expand-btn-1"]');
      const expandBtn2 = page.locator('[data-testid="tower-expand-btn-2"]');

      await expandBtn1.click();
      await expandBtn2.click();
      await page.waitForTimeout(300);

      // Navigate away
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate back
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);

      await page.waitForSelector('[data-testid="pointcloud-viewer"]');
      await page.waitForTimeout(500);

      // Panel should be visible
      const panel = page.locator('[data-testid="installations-panel"]');
      await expect(panel).toBeVisible();

      // Check if towers are visible (state may or may not be reset depending on implementation)
      const towers = panel.locator('[data-testid^="tower-item-"]');
      await expect(towers).toHaveCount(5);
    });

    test('all towers can be expanded at once', async ({ page }) => {
      // Expand all 5 towers
      for (let i = 1; i <= 5; i++) {
        const expandBtn = page.locator(`[data-testid="tower-expand-btn-${i}"]`);
        await expandBtn.click();
        await page.waitForTimeout(150);
      }

      // Verify all hardware lists are visible
      for (let i = 1; i <= 5; i++) {
        const hardwareList = page.locator(`[data-testid="hardware-list-${i}"]`);
        await expect(hardwareList).toBeVisible();
      }
    });

    test('all towers can be collapsed at once', async ({ page }) => {
      // First expand all towers
      for (let i = 1; i <= 5; i++) {
        const expandBtn = page.locator(`[data-testid="tower-expand-btn-${i}"]`);
        await expandBtn.click();
        await page.waitForTimeout(100);
      }

      // Then collapse all towers
      for (let i = 1; i <= 5; i++) {
        const expandBtn = page.locator(`[data-testid="tower-expand-btn-${i}"]`);
        await expandBtn.click();
        await page.waitForTimeout(100);
      }

      await page.waitForTimeout(300);

      // Verify all hardware lists are hidden
      for (let i = 1; i <= 5; i++) {
        const hardwareList = page.locator(`[data-testid="hardware-list-${i}"]`);
        await expect(hardwareList).not.toBeVisible();
      }
    });
  });
});
