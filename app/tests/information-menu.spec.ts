/**
 * Information Menu E2E Tests
 *
 * Description:
 * Playwright end-to-end tests for the InformationMenu component on the Live Terrain page.
 * The InformationMenu is a unified tabbed interface providing access to 4 information
 * categories: Data (weather KPIs for selected annotation), Installations (5 tower hardware
 * status), Events (3 historical geological events), and Tracking (6 vehicles).
 *
 * Sample Input:
 * npx playwright test information-menu.spec.ts
 *
 * Expected Output:
 * All tests pass, validating that the InformationMenu correctly provides unified access
 * to Data, Installations, Events, and Tracking sections with proper tab navigation,
 * content display, and accessibility features.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('InformationMenu Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Live Terrain page where InformationMenu is accessible
    await page.goto(`${BASE_URL}/live-terrain`);
    // Wait for the page to load
    await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
    // Click the information menu toggle to open the menu
    await page.click('[data-testid="information-menu-toggle"]');
    // Wait for panel animation
    await page.waitForTimeout(500);
  });

  test.describe('Menu Toggle', () => {
    test('should be visible when toggle is clicked', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // Menu should have reasonable dimensions
      const menuBox = await menu.boundingBox();
      expect(menuBox).not.toBeNull();

      if (menuBox) {
        expect(menuBox.width).toBeGreaterThan(100);
        expect(menuBox.height).toBeGreaterThan(50);
      }
    });

    test('should have correct title "Information"', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // Check for the title
      const title = menu.locator('[data-testid="information-menu-title"]');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('Information');
    });

    test('close button should close the menu', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // Click the close button
      const closeButton = page.locator('[data-testid="information-menu-close"]');
      await expect(closeButton).toBeVisible();
      await closeButton.click();

      // Wait for close animation
      await page.waitForTimeout(400);

      // Menu should be hidden (translated off-screen)
      const transform = await menu.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      // Menu uses translate-x-full when closed
      expect(transform).not.toBe('none');
    });

    test('toggle button should close menu when clicked again', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // Click toggle to close
      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');
      await toggleButton.click();
      await page.waitForTimeout(400);

      // Menu should be hidden (off-screen)
      const transform = await menu.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      expect(transform).not.toBe('none');
    });

    test('toggle button should have Info icon', async ({ page }) => {
      // Navigate fresh to check toggle before opening
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');
      await expect(toggleButton).toBeVisible();

      // Check for SVG icon (Info icon from lucide)
      const svgIcon = toggleButton.locator('svg');
      await expect(svgIcon).toBeVisible();
    });
  });

  test.describe('Tab Navigation', () => {
    test('should display 4 tabs', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // Count tab buttons
      const tabs = menu.locator('[role="tab"]');
      await expect(tabs).toHaveCount(4);
    });

    test('should show Data, Towers, Events, Tracking tabs', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // Check each tab exists
      const dataTab = page.locator('[data-testid="info-tab-data"]');
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');

      await expect(dataTab).toBeVisible();
      await expect(towersTab).toBeVisible();
      await expect(eventsTab).toBeVisible();
      await expect(trackingTab).toBeVisible();

      // Check labels
      await expect(dataTab).toContainText('Data');
      await expect(towersTab).toContainText('Towers');
      await expect(eventsTab).toContainText('Events');
      await expect(trackingTab).toContainText('Tracking');
    });

    test('clicking Towers tab should switch content', async ({ page }) => {
      // Click on Towers tab
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      await towersTab.click();
      await page.waitForTimeout(200);

      // Towers content should be visible
      const towersContent = page.locator('[data-testid="info-content-installations"]');
      await expect(towersContent).toBeVisible();

      // Should show towers data
      const contentText = await towersContent.textContent();
      expect(contentText?.toLowerCase()).toContain('tower');
    });

    test('clicking Events tab should switch content', async ({ page }) => {
      // Click on Events tab
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      await eventsTab.click();
      await page.waitForTimeout(200);

      // Events content should be visible
      const eventsContent = page.locator('[data-testid="info-content-events"]');
      await expect(eventsContent).toBeVisible();

      // Should show events data
      const contentText = await eventsContent.textContent();
      expect(contentText?.toLowerCase()).toContain('event');
    });

    test('clicking Tracking tab should switch content', async ({ page }) => {
      // Click on Tracking tab
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      await trackingTab.click();
      await page.waitForTimeout(200);

      // Tracking content should be visible
      const trackingContent = page.locator('[data-testid="info-content-tracking"]');
      await expect(trackingContent).toBeVisible();

      // Should show vehicles data
      const contentText = await trackingContent.textContent();
      expect(contentText?.toLowerCase()).toContain('vehicle');
    });

    test('active tab should have visual highlight', async ({ page }) => {
      // Data tab should be active by default
      const dataTab = page.locator('[data-testid="info-tab-data"]');
      const ariaSelected = await dataTab.getAttribute('aria-selected');
      expect(ariaSelected).toBe('true');

      // Active tab should have sky-400 color class (active styling)
      const classes = await dataTab.getAttribute('class');
      expect(classes).toContain('sky-400');
    });

    test('only one tab should be active at a time', async ({ page }) => {
      // Click on Tracking tab
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      await trackingTab.click();
      await page.waitForTimeout(200);

      // Check aria-selected states
      const dataTab = page.locator('[data-testid="info-tab-data"]');
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      const eventsTab = page.locator('[data-testid="info-tab-events"]');

      expect(await dataTab.getAttribute('aria-selected')).toBe('false');
      expect(await towersTab.getAttribute('aria-selected')).toBe('false');
      expect(await eventsTab.getAttribute('aria-selected')).toBe('false');
      expect(await trackingTab.getAttribute('aria-selected')).toBe('true');
    });
  });

  test.describe('Data Tab Content', () => {
    test('should show placeholder when no annotation selected', async ({ page }) => {
      // Data tab is active by default
      const dataContent = page.locator('[data-testid="info-content-data"]');
      await expect(dataContent).toBeVisible();

      // Should show placeholder message
      const contentText = await dataContent.textContent();
      expect(contentText?.toLowerCase()).toContain('no point selected');
    });

    test('placeholder should indicate clicking terrain', async ({ page }) => {
      const dataContent = page.locator('[data-testid="info-content-data"]');
      await expect(dataContent).toBeVisible();

      // Should mention clicking on terrain
      const contentText = await dataContent.textContent();
      expect(contentText?.toLowerCase()).toContain('click');
      expect(contentText?.toLowerCase()).toContain('terrain');
    });
  });

  test.describe('Installations Tab Content', () => {
    test('should display 5 tower installations', async ({ page }) => {
      // Click on Towers tab
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      await towersTab.click();
      await page.waitForTimeout(200);

      const towersContent = page.locator('[data-testid="info-content-installations"]');
      await expect(towersContent).toBeVisible();

      // Should mention 5 towers
      const contentText = await towersContent.textContent();
      expect(contentText).toContain('5');
      expect(contentText?.toLowerCase()).toContain('tower');
    });

    test('towers should show status indicators', async ({ page }) => {
      // Click on Towers tab
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      await towersTab.click();
      await page.waitForTimeout(200);

      const towersContent = page.locator('[data-testid="info-content-installations"]');
      await expect(towersContent).toBeVisible();

      // Should show status counts (OK, Warn, Err)
      const contentText = await towersContent.textContent();
      expect(contentText).toContain('OK');
    });

    test('towers should be expandable', async ({ page }) => {
      // Click on Towers tab
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      await towersTab.click();
      await page.waitForTimeout(200);

      // Find a tower card button (towers have expandable cards)
      const towerCards = page.locator('[data-testid="info-content-installations"] button');
      const firstCard = towerCards.first();
      await expect(firstCard).toBeVisible();

      // Click to expand
      await firstCard.click();
      await page.waitForTimeout(300);

      // Check aria-expanded changed
      const ariaExpanded = await firstCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });
  });

  test.describe('Events Tab Content', () => {
    test('should display 3 past events', async ({ page }) => {
      // Click on Events tab
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      await eventsTab.click();
      await page.waitForTimeout(200);

      const eventsContent = page.locator('[data-testid="info-content-events"]');
      await expect(eventsContent).toBeVisible();

      // Should mention 3 events
      const contentText = await eventsContent.textContent();
      expect(contentText).toContain('3');
      expect(contentText?.toLowerCase()).toContain('event');
    });

    test('events should show similarity percentage', async ({ page }) => {
      // Click on Events tab
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      await eventsTab.click();
      await page.waitForTimeout(200);

      const eventsContent = page.locator('[data-testid="info-content-events"]');
      await expect(eventsContent).toBeVisible();

      // Should show similarity text
      const contentText = await eventsContent.textContent();
      expect(contentText?.toLowerCase()).toContain('similarity');
      // Check for percentage values (89%, 67%, 45%)
      expect(contentText).toMatch(/\d+%/);
    });

    test('events should show event type badges', async ({ page }) => {
      // Click on Events tab
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      await eventsTab.click();
      await page.waitForTimeout(200);

      const eventsContent = page.locator('[data-testid="info-content-events"]');
      await expect(eventsContent).toBeVisible();

      // Should show event types (Rockfall, Landslide, Subsidence)
      const contentText = await eventsContent.textContent();
      expect(contentText?.toLowerCase()).toContain('rockfall');
    });
  });

  test.describe('Tracking Tab Content', () => {
    test('should display 6 vehicles', async ({ page }) => {
      // Click on Tracking tab
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      await trackingTab.click();
      await page.waitForTimeout(200);

      const trackingContent = page.locator('[data-testid="info-content-tracking"]');
      await expect(trackingContent).toBeVisible();

      // Should mention 6 vehicles
      const contentText = await trackingContent.textContent();
      expect(contentText).toContain('6');
      expect(contentText?.toLowerCase()).toContain('vehicle');
    });

    test('vehicles should show status indicators', async ({ page }) => {
      // Click on Tracking tab
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      await trackingTab.click();
      await page.waitForTimeout(200);

      const trackingContent = page.locator('[data-testid="info-content-tracking"]');
      await expect(trackingContent).toBeVisible();

      // Should show status counts (Active, Idle)
      const contentText = await trackingContent.textContent();
      expect(contentText).toContain('Active');
      expect(contentText).toContain('Idle');
    });

    test('vehicles should show operator when assigned', async ({ page }) => {
      // Click on Tracking tab
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      await trackingTab.click();
      await page.waitForTimeout(200);

      const trackingContent = page.locator('[data-testid="info-content-tracking"]');
      await expect(trackingContent).toBeVisible();

      // Should show operator names (J. Smith, M. Jones, R. Brown, K. Lee)
      const contentText = await trackingContent.textContent();
      expect(contentText).toContain('Smith');
    });
  });

  test.describe('Accessibility', () => {
    test('menu should have role="dialog"', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      const role = await menu.getAttribute('role');
      expect(role).toBe('dialog');
    });

    test('menu should have aria-modal attribute', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      const ariaModal = await menu.getAttribute('aria-modal');
      expect(ariaModal).toBe('true');
    });

    test('tabs should have role="tablist"', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      const tabList = menu.locator('[role="tablist"]');
      await expect(tabList).toBeVisible();
    });

    test('tab buttons should have role="tab"', async ({ page }) => {
      const dataTab = page.locator('[data-testid="info-tab-data"]');
      await expect(dataTab).toBeVisible();

      const role = await dataTab.getAttribute('role');
      expect(role).toBe('tab');
    });

    test('content areas should have role="tabpanel"', async ({ page }) => {
      const dataContent = page.locator('[data-testid="info-content-data"]');
      await expect(dataContent).toBeVisible();

      const role = await dataContent.getAttribute('role');
      expect(role).toBe('tabpanel');
    });

    test('keyboard navigation should work between tabs', async ({ page }) => {
      // Focus on the first tab
      const dataTab = page.locator('[data-testid="info-tab-data"]');
      await dataTab.focus();

      // Press ArrowRight to move to next tab
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);

      // Towers tab should now be focused and selected
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      const ariaSelected = await towersTab.getAttribute('aria-selected');
      expect(ariaSelected).toBe('true');
    });

    test('close button should be focusable', async ({ page }) => {
      const closeButton = page.locator('[data-testid="information-menu-close"]');
      await expect(closeButton).toBeVisible();

      await closeButton.focus();

      const isFocused = await closeButton.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);
    });

    test('close button should have aria-label', async ({ page }) => {
      const closeButton = page.locator('[data-testid="information-menu-close"]');
      const ariaLabel = await closeButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain('close');
    });
  });

  test.describe('Section Switching', () => {
    test('should smoothly transition between sections', async ({ page }) => {
      // Switch through all tabs and ensure content loads
      const tabs = ['data', 'installations', 'events', 'tracking'];

      for (const tabId of tabs) {
        const tab = page.locator(`[data-testid="info-tab-${tabId}"]`);
        await tab.click();
        await page.waitForTimeout(200);

        const content = page.locator(`[data-testid="info-content-${tabId}"]`);
        await expect(content).toBeVisible();
      }
    });

    test('all 4 sections should be accessible', async ({ page }) => {
      // Verify all 4 tab contents can be accessed
      const tabs = ['data', 'installations', 'events', 'tracking'];

      for (const tabId of tabs) {
        const tab = page.locator(`[data-testid="info-tab-${tabId}"]`);
        await tab.click();
        await page.waitForTimeout(200);

        const content = page.locator(`[data-testid="info-content-${tabId}"]`);
        const contentText = await content.textContent();
        expect(contentText).toBeTruthy();
        expect(contentText?.length).toBeGreaterThan(0);
      }
    });

    test('menu should maintain state when switching tabs', async ({ page }) => {
      // Switch to Events tab
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      await eventsTab.click();
      await page.waitForTimeout(200);

      // Switch to Tracking tab
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      await trackingTab.click();
      await page.waitForTimeout(200);

      // Switch back to Events tab
      await eventsTab.click();
      await page.waitForTimeout(200);

      // Events content should still be visible and working
      const eventsContent = page.locator('[data-testid="info-content-events"]');
      await expect(eventsContent).toBeVisible();
    });
  });

  test.describe('Toggle Button', () => {
    test('should be visible on LiveTerrain page', async ({ page }) => {
      // Navigate fresh without opening the menu
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');
      await expect(toggleButton).toBeVisible();
    });

    test('should have "Information" label', async ({ page }) => {
      // Navigate fresh
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');
      await expect(toggleButton).toBeVisible();

      const buttonText = await toggleButton.textContent();
      expect(buttonText).toContain('Information');
    });

    test('should have aria-expanded attribute', async ({ page }) => {
      // Navigate fresh
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');

      // Initially should be collapsed
      const initialExpanded = await toggleButton.getAttribute('aria-expanded');
      expect(initialExpanded).toBe('false');
    });

    test('aria-expanded should update on toggle', async ({ page }) => {
      // Navigate fresh
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');

      // Initially should be collapsed
      let expandedState = await toggleButton.getAttribute('aria-expanded');
      expect(expandedState).toBe('false');

      // Click to open
      await toggleButton.click();
      await page.waitForTimeout(300);

      // Should now be expanded
      expandedState = await toggleButton.getAttribute('aria-expanded');
      expect(expandedState).toBe('true');

      // Click to close
      await toggleButton.click();
      await page.waitForTimeout(300);

      // Should be collapsed again
      expandedState = await toggleButton.getAttribute('aria-expanded');
      expect(expandedState).toBe('false');
    });

    test('toggle button should open menu when clicked', async ({ page }) => {
      // Navigate fresh
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Click toggle to open
      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');
      await toggleButton.click();
      await page.waitForTimeout(500);

      // Menu should now be visible
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();
    });
  });

  test.describe('Integration', () => {
    test('should not interfere with point cloud viewer', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // Viewer should still be accessible
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      await expect(viewer).toBeVisible();

      // Interact with the viewer (pan/rotate)
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

      // Menu should still be visible after viewer interaction
      await expect(menu).toBeVisible();
    });

    test('OnClickDataPanel should still work separately', async ({ page }) => {
      // The OnClickDataPanel and InformationMenu are separate components
      // Both should be able to coexist

      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // Menu should display without errors
      const title = menu.locator('[data-testid="information-menu-title"]');
      await expect(title).toBeVisible();
    });

    test('no console errors during interactions', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Interact with all tabs
      const tabs = ['data', 'installations', 'events', 'tracking'];
      for (const tabId of tabs) {
        const tab = page.locator(`[data-testid="info-tab-${tabId}"]`);
        await tab.click();
        await page.waitForTimeout(200);
      }

      // Open and close menu
      const toggleButton = page.locator('[data-testid="information-menu-toggle"]');
      await toggleButton.click();
      await page.waitForTimeout(300);
      await toggleButton.click();
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

    test('menu state persists after viewer interaction', async ({ page }) => {
      // Switch to Tracking tab
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      await trackingTab.click();
      await page.waitForTimeout(200);

      // Interact with the viewer
      const viewer = page.locator('[data-testid="pointcloud-viewer"]');
      const viewerBox = await viewer.boundingBox();

      if (viewerBox) {
        const centerX = viewerBox.x + viewerBox.width / 2;
        const centerY = viewerBox.y + viewerBox.height / 2;

        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 30, centerY + 20);
        await page.mouse.up();
      }

      await page.waitForTimeout(300);

      // Tab should still be on Tracking
      const ariaSelected = await trackingTab.getAttribute('aria-selected');
      expect(ariaSelected).toBe('true');
    });
  });

  test.describe('Visual Styling', () => {
    test('menu has proper glassmorphic styling', async ({ page }) => {
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      const styles = await menu.evaluate((el) => {
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

    test('active tab has distinct visual styling', async ({ page }) => {
      const activeTab = page.locator('[data-testid="info-tab-data"]');
      const inactiveTab = page.locator('[data-testid="info-tab-installations"]');

      const activeClasses = await activeTab.getAttribute('class');
      const inactiveClasses = await inactiveTab.getAttribute('class');

      // Active tab should have sky-400 color
      expect(activeClasses).toContain('sky-400');
      // Inactive tab should have slate color
      expect(inactiveClasses).toContain('slate');
    });
  });

  test.describe('Edge Cases', () => {
    test('rapid tab switching works correctly', async ({ page }) => {
      const tabs = ['data', 'installations', 'events', 'tracking'];

      // Rapidly switch through tabs multiple times
      for (let i = 0; i < 3; i++) {
        for (const tabId of tabs) {
          await page.click(`[data-testid="info-tab-${tabId}"]`);
          await page.waitForTimeout(50);
        }
      }

      await page.waitForTimeout(300);

      // Menu should be in a consistent state with tracking tab active
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      const ariaSelected = await trackingTab.getAttribute('aria-selected');
      expect(ariaSelected).toBe('true');
    });

    test('menu state resets when navigating away and back', async ({ page }) => {
      // Switch to Events tab
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      await eventsTab.click();
      await page.waitForTimeout(200);

      // Navigate away
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate back
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open menu again
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      // Menu should be visible and reset to Data tab (default)
      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      const dataTab = page.locator('[data-testid="info-tab-data"]');
      const ariaSelected = await dataTab.getAttribute('aria-selected');
      expect(ariaSelected).toBe('true');
    });

    test('keyboard navigation with Home and End keys', async ({ page }) => {
      // Focus on a middle tab
      const towersTab = page.locator('[data-testid="info-tab-installations"]');
      await towersTab.click();
      await towersTab.focus();

      // Press Home to go to first tab
      await page.keyboard.press('Home');
      await page.waitForTimeout(200);

      const dataTab = page.locator('[data-testid="info-tab-data"]');
      expect(await dataTab.getAttribute('aria-selected')).toBe('true');

      // Press End to go to last tab
      await page.keyboard.press('End');
      await page.waitForTimeout(200);

      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      expect(await trackingTab.getAttribute('aria-selected')).toBe('true');
    });

    test('ArrowLeft keyboard navigation wraps around', async ({ page }) => {
      // Focus on first tab (Data)
      const dataTab = page.locator('[data-testid="info-tab-data"]');
      await dataTab.click();
      await dataTab.focus();

      // Press ArrowLeft - should wrap to last tab (Tracking)
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(200);

      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      expect(await trackingTab.getAttribute('aria-selected')).toBe('true');
    });

    test('ArrowRight keyboard navigation wraps around', async ({ page }) => {
      // Focus on last tab (Tracking)
      const trackingTab = page.locator('[data-testid="info-tab-tracking"]');
      await trackingTab.click();
      await trackingTab.focus();

      // Press ArrowRight - should wrap to first tab (Data)
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);

      const dataTab = page.locator('[data-testid="info-tab-data"]');
      expect(await dataTab.getAttribute('aria-selected')).toBe('true');
    });
  });

  test.describe('Responsive Behavior', () => {
    test('menu is visible on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // All tabs should still be visible
      const tabs = menu.locator('[role="tab"]');
      await expect(tabs).toHaveCount(4);
    });

    test('menu is usable on smaller viewport', async ({ page }) => {
      await page.setViewportSize({ width: 400, height: 800 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open menu
      await page.click('[data-testid="information-menu-toggle"]');
      await page.waitForTimeout(500);

      const menu = page.locator('[data-testid="information-menu"]');
      await expect(menu).toBeVisible();

      // Should still be able to switch tabs
      const eventsTab = page.locator('[data-testid="info-tab-events"]');
      await eventsTab.click();
      await page.waitForTimeout(200);

      const ariaSelected = await eventsTab.getAttribute('aria-selected');
      expect(ariaSelected).toBe('true');
    });
  });
});
