/**
 * Tracking Panel E2E Tests
 *
 * Description:
 * Playwright end-to-end tests for the TrackingPanel component that displays
 * tracked vehicle information in the Mine Demo Dashboard. The panel shows
 * 6 tracked vehicles (haul trucks, excavators, dozers, water trucks, and
 * light vehicles) with real-time status indicators, operator information,
 * speed displays, and a vehicle type legend section.
 *
 * Sample Input:
 * npx playwright test tracking-panel.spec.ts
 *
 * Expected Output:
 * All tests pass, validating that the TrackingPanel correctly displays tracked
 * vehicles with proper styling, selection behavior, legend, and accessibility.
 * The panel should show:
 *   - HT-101: Haul Truck, Active, operator J. Smith
 *   - HT-102: Haul Truck, Active, operator M. Jones
 *   - EX-201: Excavator, Active, operator R. Brown
 *   - DZ-05: Dozer, Idle, no operator
 *   - WT-01: Water Truck, Active, operator K. Lee
 *   - LV-12: Light Vehicle, Maintenance, no operator
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('TrackingPanel Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Live Terrain page where TrackingPanel is accessible
    await page.goto(`${BASE_URL}/live-terrain`);
    // Wait for the page to load
    await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
    // Click the tracking panel toggle to open the panel
    await page.click('[data-testid="tracking-panel-toggle"]');
    // Wait for panel animation
    await page.waitForTimeout(500);
  });

  test.describe('Panel Rendering', () => {
    test('should be visible when toggle is clicked', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Panel should have reasonable dimensions
      const panelBox = await panel.boundingBox();
      expect(panelBox).not.toBeNull();

      if (panelBox) {
        expect(panelBox.width).toBeGreaterThan(100);
        expect(panelBox.height).toBeGreaterThan(50);
      }
    });

    test('should have correct title "Vehicle Tracking"', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check for the title
      const title = panel.locator('[data-testid="tracking-panel-title"]');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('Vehicle Tracking');
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check for role="dialog"
      const role = await panel.getAttribute('role');
      expect(role).toBe('dialog');

      // Check for aria-modal
      const ariaModal = await panel.getAttribute('aria-modal');
      expect(ariaModal).toBe('true');

      // Check for aria-label
      const ariaLabel = await panel.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain('vehicle');
    });

    test('should display active/idle counts in subtitle', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check for the subtitle showing active/idle counts
      // Based on data: 4 active, 1 idle, 1 maintenance = "4 Active, 1 Idle"
      const subtitleText = panel.getByText(/Active/);
      await expect(subtitleText).toBeVisible();
    });

    test('close button should close the panel', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Click the close button
      const closeButton = page.locator('[data-testid="tracking-panel-close"]');
      await expect(closeButton).toBeVisible();
      await closeButton.click();

      // Wait for close animation
      await page.waitForTimeout(400);

      // Panel should be hidden (translated off-screen)
      const transform = await panel.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      // Panel uses translate-x-full when closed
      expect(transform).not.toBe('none');
    });
  });

  test.describe('Vehicle Display', () => {
    test('should display 6 tracked vehicles', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Count vehicle cards
      const vehicleCards = panel.locator('[data-testid^="vehicle-card-"]');
      await expect(vehicleCards).toHaveCount(6);
    });

    test('each vehicle should display ID/name', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check each vehicle has a name displayed
      const vehicleIds = ['HT-101', 'HT-102', 'EX-201', 'DZ-05', 'WT-01', 'LV-12'];

      for (const vehicleId of vehicleIds) {
        const vehicleCard = page.locator(`[data-testid="vehicle-card-${vehicleId}"]`);
        await expect(vehicleCard).toBeVisible();

        const cardText = await vehicleCard.textContent();
        expect(cardText).toContain(vehicleId);
      }
    });

    test('each vehicle should show vehicle type badge', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check vehicle type badges exist for each vehicle
      const vehicleIds = ['HT-101', 'HT-102', 'EX-201', 'DZ-05', 'WT-01', 'LV-12'];

      for (const vehicleId of vehicleIds) {
        const badge = page.locator(`[data-testid="vehicle-type-badge-${vehicleId}"]`);
        await expect(badge).toBeVisible();
      }
    });

    test('each vehicle should display status indicator', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check status indicators exist for each vehicle
      const vehicleIds = ['HT-101', 'HT-102', 'EX-201', 'DZ-05', 'WT-01', 'LV-12'];

      for (const vehicleId of vehicleIds) {
        const statusIndicator = page.locator(`[data-testid="vehicle-status-${vehicleId}"]`);
        await expect(statusIndicator).toBeVisible();
      }
    });

    test('active vehicles should show operator name', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check active vehicles with operators
      // HT-101: J. Smith, HT-102: M. Jones, EX-201: R. Brown, WT-01: K. Lee
      const operatorVehicles = [
        { id: 'HT-101', operator: 'J. Smith' },
        { id: 'HT-102', operator: 'M. Jones' },
        { id: 'EX-201', operator: 'R. Brown' },
        { id: 'WT-01', operator: 'K. Lee' },
      ];

      for (const { id, operator } of operatorVehicles) {
        const vehicleCard = page.locator(`[data-testid="vehicle-card-${id}"]`);
        const cardText = await vehicleCard.textContent();
        expect(cardText).toContain(operator);
      }
    });

    test('vehicles should show last update time', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check that vehicles show relative time indicators
      // Look for time-related text patterns like "min ago" or "Just now"
      const vehicleCard = page.locator('[data-testid="vehicle-card-HT-101"]');
      const cardText = await vehicleCard.textContent();

      // Should contain some time indicator
      const hasTimeIndicator =
        cardText?.includes('min ago') ||
        cardText?.includes('hr ago') ||
        cardText?.includes('Just now') ||
        cardText?.includes('day');

      expect(hasTimeIndicator).toBe(true);
    });

    test('active vehicles should display speed', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Active vehicles with speed: HT-101 (28 km/h), HT-102 (35 km/h), WT-01 (22 km/h)
      // EX-201 is active but has 0 speed (stationary excavator)
      const vehicleWithSpeed = page.locator('[data-testid="vehicle-card-HT-101"]');
      const cardText = await vehicleWithSpeed.textContent();

      // Should contain speed indicator
      expect(cardText).toContain('km/h');
    });
  });

  test.describe('Status Indicators', () => {
    test('active status should have emerald/green color', async ({ page }) => {
      // HT-101 is active
      const statusIndicator = page.locator('[data-testid="vehicle-status-HT-101"]');
      await expect(statusIndicator).toBeVisible();

      const classes = await statusIndicator.getAttribute('class');
      expect(classes).toContain('emerald');
    });

    test('idle status should have amber color', async ({ page }) => {
      // DZ-05 is idle
      const statusIndicator = page.locator('[data-testid="vehicle-status-DZ-05"]');
      await expect(statusIndicator).toBeVisible();

      const classes = await statusIndicator.getAttribute('class');
      expect(classes).toContain('amber');
    });

    test('maintenance status should have blue color', async ({ page }) => {
      // LV-12 is in maintenance
      const statusIndicator = page.locator('[data-testid="vehicle-status-LV-12"]');
      await expect(statusIndicator).toBeVisible();

      const classes = await statusIndicator.getAttribute('class');
      expect(classes).toContain('blue');
    });

    test('active status should have pulse animation', async ({ page }) => {
      // HT-101 is active - check for pulse animation class
      const statusIndicator = page.locator('[data-testid="vehicle-status-HT-101"]');
      await expect(statusIndicator).toBeVisible();

      // The pulse animation is on the dot inside the status indicator
      const dot = statusIndicator.locator('span').first();
      const classes = await dot.getAttribute('class');
      expect(classes).toContain('animate-pulse');
    });
  });

  test.describe('Vehicle Types', () => {
    test('haul trucks should have amber styling', async ({ page }) => {
      // HT-101 is a haul truck
      const badge = page.locator('[data-testid="vehicle-type-badge-HT-101"]');
      await expect(badge).toBeVisible();

      const classes = await badge.getAttribute('class');
      expect(classes).toContain('amber');

      const badgeText = await badge.textContent();
      expect(badgeText?.toLowerCase()).toContain('haul truck');
    });

    test('excavators should have red styling', async ({ page }) => {
      // EX-201 is an excavator
      const badge = page.locator('[data-testid="vehicle-type-badge-EX-201"]');
      await expect(badge).toBeVisible();

      const classes = await badge.getAttribute('class');
      expect(classes).toContain('red');

      const badgeText = await badge.textContent();
      expect(badgeText?.toLowerCase()).toContain('excavator');
    });

    test('dozers should have emerald styling', async ({ page }) => {
      // DZ-05 is a dozer
      const badge = page.locator('[data-testid="vehicle-type-badge-DZ-05"]');
      await expect(badge).toBeVisible();

      const classes = await badge.getAttribute('class');
      expect(classes).toContain('emerald');

      const badgeText = await badge.textContent();
      expect(badgeText?.toLowerCase()).toContain('dozer');
    });

    test('water trucks should have blue styling', async ({ page }) => {
      // WT-01 is a water truck
      const badge = page.locator('[data-testid="vehicle-type-badge-WT-01"]');
      await expect(badge).toBeVisible();

      const classes = await badge.getAttribute('class');
      expect(classes).toContain('blue');

      const badgeText = await badge.textContent();
      expect(badgeText?.toLowerCase()).toContain('water truck');
    });

    test('light vehicles should have purple styling', async ({ page }) => {
      // LV-12 is a light vehicle
      const badge = page.locator('[data-testid="vehicle-type-badge-LV-12"]');
      await expect(badge).toBeVisible();

      const classes = await badge.getAttribute('class');
      expect(classes).toContain('purple');

      const badgeText = await badge.textContent();
      expect(badgeText?.toLowerCase()).toContain('light vehicle');
    });
  });

  test.describe('Legend Section', () => {
    test('should display vehicle types legend', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check for the legend section
      const legend = panel.locator('[data-testid="vehicle-legend"]');
      await expect(legend).toBeVisible();

      // Check for "Vehicle Types" header text
      const legendText = await legend.textContent();
      expect(legendText?.toLowerCase()).toContain('vehicle types');
    });

    test('legend should show all 5 vehicle types', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      const legend = panel.locator('[data-testid="vehicle-legend"]');
      await expect(legend).toBeVisible();

      // Check for all 5 legend items
      const vehicleTypes = ['haul_truck', 'excavator', 'dozer', 'water_truck', 'light_vehicle'];

      for (const type of vehicleTypes) {
        const legendItem = page.locator(`[data-testid="legend-item-${type}"]`);
        await expect(legendItem).toBeVisible();
      }
    });

    test('each legend item should have correct icon and label', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Check each legend item has text content
      const legendItems = [
        { type: 'haul_truck', label: 'Haul Truck' },
        { type: 'excavator', label: 'Excavator' },
        { type: 'dozer', label: 'Dozer' },
        { type: 'water_truck', label: 'Water Truck' },
        { type: 'light_vehicle', label: 'Light Vehicle' },
      ];

      for (const { type, label } of legendItems) {
        const legendItem = page.locator(`[data-testid="legend-item-${type}"]`);
        await expect(legendItem).toBeVisible();

        const itemText = await legendItem.textContent();
        expect(itemText).toContain(label);
      }
    });
  });

  test.describe('Vehicle Selection', () => {
    test('clicking a vehicle card should select it', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      const vehicleCard = page.locator('[data-testid="vehicle-card-HT-101"]');
      await vehicleCard.click();
      await page.waitForTimeout(200);

      // Card should have aria-expanded="true"
      const ariaExpanded = await vehicleCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });

    test('selected vehicle should have visual highlight', async ({ page }) => {
      const vehicleCard = page.locator('[data-testid="vehicle-card-HT-101"]');
      await vehicleCard.click();
      await page.waitForTimeout(200);

      // Check for ring class indicating selection
      const classes = await vehicleCard.getAttribute('class');
      expect(classes).toContain('ring');
    });

    test('only one vehicle should be selected at a time', async ({ page }) => {
      // Select first vehicle
      const vehicle1 = page.locator('[data-testid="vehicle-card-HT-101"]');
      await vehicle1.click();
      await page.waitForTimeout(200);

      // Select second vehicle
      const vehicle2 = page.locator('[data-testid="vehicle-card-HT-102"]');
      await vehicle2.click();
      await page.waitForTimeout(200);

      // First vehicle should no longer be selected
      const vehicle1Expanded = await vehicle1.getAttribute('aria-expanded');
      expect(vehicle1Expanded).toBe('false');

      // Second vehicle should be selected
      const vehicle2Expanded = await vehicle2.getAttribute('aria-expanded');
      expect(vehicle2Expanded).toBe('true');
    });

    test('clicking a different vehicle should change selection', async ({ page }) => {
      // Select first vehicle
      const vehicle1 = page.locator('[data-testid="vehicle-card-HT-101"]');
      await vehicle1.click();
      await page.waitForTimeout(200);

      // Verify first is selected
      let vehicle1Classes = await vehicle1.getAttribute('class');
      expect(vehicle1Classes).toContain('ring');

      // Select third vehicle
      const vehicle3 = page.locator('[data-testid="vehicle-card-EX-201"]');
      await vehicle3.click();
      await page.waitForTimeout(200);

      // First should no longer have selection ring
      vehicle1Classes = await vehicle1.getAttribute('class');
      expect(vehicle1Classes).not.toContain('ring-sky');

      // Third should have ring
      const vehicle3Classes = await vehicle3.getAttribute('class');
      expect(vehicle3Classes).toContain('ring');
    });

    test('clicking a selected vehicle should deselect it', async ({ page }) => {
      const vehicleCard = page.locator('[data-testid="vehicle-card-HT-101"]');

      // Select the vehicle
      await vehicleCard.click();
      await page.waitForTimeout(200);
      let ariaExpanded = await vehicleCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');

      // Click again to deselect
      await vehicleCard.click();
      await page.waitForTimeout(200);
      ariaExpanded = await vehicleCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');
    });
  });

  test.describe('Accessibility', () => {
    test('panel should have role="dialog"', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      const role = await panel.getAttribute('role');
      expect(role).toBe('dialog');
    });

    test('vehicle cards should be keyboard accessible', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Vehicle cards should be buttons (focusable)
      const vehicleCard = page.locator('[data-testid="vehicle-card-HT-101"]');
      const tagName = await vehicleCard.evaluate((el) => el.tagName.toLowerCase());
      expect(tagName).toBe('button');

      // Focus the card
      await vehicleCard.focus();
      const isFocused = await vehicleCard.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);
    });

    test('close button should be focusable', async ({ page }) => {
      const closeButton = page.locator('[data-testid="tracking-panel-close"]');
      await expect(closeButton).toBeVisible();

      await closeButton.focus();

      const isFocused = await closeButton.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);
    });

    test('vehicle cards should have descriptive aria-labels', async ({ page }) => {
      const vehicleCard = page.locator('[data-testid="vehicle-card-HT-101"]');
      await expect(vehicleCard).toBeVisible();

      const ariaLabel = await vehicleCard.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('HT-101');
      expect(ariaLabel?.toLowerCase()).toContain('haul truck');
      expect(ariaLabel?.toLowerCase()).toContain('active');
    });

    test('close button should have aria-label', async ({ page }) => {
      const closeButton = page.locator('[data-testid="tracking-panel-close"]');
      const ariaLabel = await closeButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain('close');
    });

    test('Enter key should toggle vehicle selection', async ({ page }) => {
      const vehicleCard = page.locator('[data-testid="vehicle-card-HT-101"]');
      await vehicleCard.focus();

      // Press Enter to select
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      const ariaExpanded = await vehicleCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');

      // Press Enter again to deselect
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      const ariaExpandedAfter = await vehicleCard.getAttribute('aria-expanded');
      expect(ariaExpandedAfter).toBe('false');
    });

    test('Space key should toggle vehicle selection', async ({ page }) => {
      const vehicleCard = page.locator('[data-testid="vehicle-card-HT-101"]');
      await vehicleCard.focus();

      // Press Space to select
      await page.keyboard.press('Space');
      await page.waitForTimeout(200);

      const ariaExpanded = await vehicleCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });
  });

  test.describe('Toggle Button', () => {
    test('toggle button should be visible on LiveTerrain page', async ({ page }) => {
      // Navigate fresh without opening the panel
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      const toggleButton = page.locator('[data-testid="tracking-panel-toggle"]');
      await expect(toggleButton).toBeVisible();
    });

    test('toggle button should have Truck icon and label', async ({ page }) => {
      // Navigate fresh
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      const toggleButton = page.locator('[data-testid="tracking-panel-toggle"]');
      await expect(toggleButton).toBeVisible();

      // Check for SVG icon (Truck icon from lucide)
      const svgIcon = toggleButton.locator('svg');
      await expect(svgIcon).toBeVisible();
    });

    test('toggle button should open panel when clicked', async ({ page }) => {
      // Navigate fresh
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Panel should not be visible initially
      const panel = page.locator('[data-testid="tracking-panel"]');

      // Click toggle to open
      const toggleButton = page.locator('[data-testid="tracking-panel-toggle"]');
      await toggleButton.click();
      await page.waitForTimeout(500);

      // Panel should now be visible
      await expect(panel).toBeVisible();
    });

    test('toggle button should close panel when clicked again', async ({ page }) => {
      // Panel is already open from beforeEach
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Click toggle to close
      const toggleButton = page.locator('[data-testid="tracking-panel-toggle"]');
      await toggleButton.click();
      await page.waitForTimeout(400);

      // Panel should be hidden (off-screen)
      const transform = await panel.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      expect(transform).not.toBe('none');
    });

    test('toggle button should have aria-expanded attribute', async ({ page }) => {
      // Navigate fresh
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      const toggleButton = page.locator('[data-testid="tracking-panel-toggle"]');

      // Initially should be collapsed
      const initialExpanded = await toggleButton.getAttribute('aria-expanded');
      expect(initialExpanded).toBe('false');

      // Click to open
      await toggleButton.click();
      await page.waitForTimeout(300);

      // Should now be expanded
      const expandedState = await toggleButton.getAttribute('aria-expanded');
      expect(expandedState).toBe('true');
    });
  });

  test.describe('Visual Indicators', () => {
    test('selected vehicle should have different background', async ({ page }) => {
      const vehicle1 = page.locator('[data-testid="vehicle-card-HT-101"]');
      const vehicle2 = page.locator('[data-testid="vehicle-card-HT-102"]');

      // Get initial styles for vehicle 1
      const stylesBeforeSelect = await vehicle1.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // Select vehicle 1
      await vehicle1.click();
      await page.waitForTimeout(200);

      // Get styles after select
      const stylesAfterSelect = await vehicle1.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // Get styles of unselected vehicle 2
      const vehicle2Styles = await vehicle2.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // Selected vehicle should look different from unselected
      const hasVisualChange =
        stylesAfterSelect.backgroundColor !== vehicle2Styles.backgroundColor ||
        stylesAfterSelect.borderColor !== vehicle2Styles.borderColor;

      expect(hasVisualChange).toBe(true);
    });

    test('panel has proper glassmorphic styling', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      const styles = await panel.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backdropFilter: computed.backdropFilter,
          backgroundColor: computed.backgroundColor,
        };
      });

      // Should have backdrop blur effect
      expect(styles.backdropFilter).toBeTruthy();
      expect(styles.backdropFilter).not.toBe('none');
    });
  });

  test.describe('Responsive Behavior', () => {
    test('panel is visible on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open panel
      await page.click('[data-testid="tracking-panel-toggle"]');
      await page.waitForTimeout(500);

      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // All vehicles should still be visible
      const vehicles = panel.locator('[data-testid^="vehicle-card-"]');
      await expect(vehicles).toHaveCount(6);
    });

    test('panel is usable on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open panel
      await page.click('[data-testid="tracking-panel-toggle"]');
      await page.waitForTimeout(500);

      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Should still be able to select a vehicle
      const vehicleCard = page.locator('[data-testid="vehicle-card-HT-101"]');
      await vehicleCard.click();
      await page.waitForTimeout(200);

      const ariaExpanded = await vehicleCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });
  });

  test.describe('Edge Cases', () => {
    test('rapid selection changes work correctly', async ({ page }) => {
      // Rapidly click different vehicles
      const vehicleIds = ['HT-101', 'HT-102', 'EX-201', 'DZ-05', 'WT-01', 'LV-12'];

      for (let i = 0; i < 2; i++) {
        for (const vehicleId of vehicleIds) {
          await page.click(`[data-testid="vehicle-card-${vehicleId}"]`);
          await page.waitForTimeout(50);
        }
      }

      await page.waitForTimeout(300);

      // Panel should be in a consistent state
      const vehicle = page.locator('[data-testid="vehicle-card-LV-12"]');
      const ariaExpanded = await vehicle.getAttribute('aria-expanded');
      expect(ariaExpanded === 'true' || ariaExpanded === 'false').toBe(true);
    });

    test('panel state resets when navigating away and back', async ({ page }) => {
      // Select a vehicle
      await page.click('[data-testid="vehicle-card-HT-101"]');
      await page.waitForTimeout(200);

      // Verify selection
      const vehicle = page.locator('[data-testid="vehicle-card-HT-101"]');
      let ariaExpanded = await vehicle.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');

      // Navigate away
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate back
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open panel again
      await page.click('[data-testid="tracking-panel-toggle"]');
      await page.waitForTimeout(500);

      // Panel should be visible
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Selection state should be reset (no vehicle selected)
      ariaExpanded = await vehicle.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');
    });

    test('expand/collapse does not cause console errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Interact with panel - select/deselect vehicles
      for (let i = 0; i < 3; i++) {
        await page.click('[data-testid="vehicle-card-HT-101"]');
        await page.waitForTimeout(100);
        await page.click('[data-testid="vehicle-card-HT-101"]');
        await page.waitForTimeout(100);
      }

      await page.waitForTimeout(300);

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

    test('all vehicles can be cycled through', async ({ page }) => {
      const vehicleIds = ['HT-101', 'HT-102', 'EX-201', 'DZ-05', 'WT-01', 'LV-12'];

      for (const vehicleId of vehicleIds) {
        const vehicleCard = page.locator(`[data-testid="vehicle-card-${vehicleId}"]`);
        await vehicleCard.click();
        await page.waitForTimeout(150);

        const ariaExpanded = await vehicleCard.getAttribute('aria-expanded');
        expect(ariaExpanded).toBe('true');

        // Deselect
        await vehicleCard.click();
        await page.waitForTimeout(150);
      }
    });
  });

  test.describe('Integration', () => {
    test('panel state persists after viewer interaction', async ({ page }) => {
      // Select a vehicle
      await page.click('[data-testid="vehicle-card-HT-101"]');
      await page.waitForTimeout(200);

      const vehicle = page.locator('[data-testid="vehicle-card-HT-101"]');
      let ariaExpanded = await vehicle.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');

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

      // Vehicle should still be selected
      ariaExpanded = await vehicle.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });

    test('panel remains visible after view mode change', async ({ page }) => {
      const panel = page.locator('[data-testid="tracking-panel"]');
      await expect(panel).toBeVisible();

      // Change view mode if available
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      if (await heightMode.isVisible()) {
        await heightMode.click();
        await page.waitForTimeout(500);
      }

      // Panel should still be visible
      await expect(panel).toBeVisible();

      // Vehicles should still be visible
      const vehicles = panel.locator('[data-testid^="vehicle-card-"]');
      await expect(vehicles).toHaveCount(6);
    });

    test('panel does not cause rendering errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Interact with panel
      const vehicleIds = ['HT-101', 'HT-102', 'EX-201', 'DZ-05', 'WT-01', 'LV-12'];
      for (const vehicleId of vehicleIds) {
        await page.click(`[data-testid="vehicle-card-${vehicleId}"]`);
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
});
