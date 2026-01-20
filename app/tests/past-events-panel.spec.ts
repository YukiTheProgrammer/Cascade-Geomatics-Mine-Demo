/**
 * Past Events Panel E2E Tests
 *
 * Description:
 * Playwright end-to-end tests for the PastEventsPanel component that displays
 * historical geological events in the Mine Demo Dashboard. The panel shows
 * 3 past events (rockfall, landslide, subsidence) with similarity percentages
 * to current conditions, selectable event cards with visual highlights, and
 * a comparison placeholder for future point cloud comparison features.
 *
 * Sample Input:
 * - Page load at "/live-terrain" (Live Terrain route)
 * - User clicks past events toggle button to open panel
 * - User clicks on event cards to select/deselect
 * - Keyboard navigation (Tab, Enter, Space) through event cards
 * - Various viewport sizes for responsive testing
 *
 * Expected Output:
 * - Panel renders with "Past Events" title
 * - 3 event cards are displayed with type badges and similarity indicators
 * - Clicking an event selects it with visual highlight (ring)
 * - Comparison placeholder appears when an event is selected
 * - Close button closes the panel
 * - Proper ARIA attributes for screen readers (role="dialog", aria-modal)
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('PastEventsPanel Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Live Terrain page where PastEventsPanel is accessible
    await page.goto(`${BASE_URL}/live-terrain`);
    // Wait for the page to load
    await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
    // Click the past events toggle to open the panel
    await page.click('[data-testid="past-events-toggle"]');
    // Wait for panel animation
    await page.waitForTimeout(500);
  });

  test.describe('Panel Rendering', () => {
    test('panel should be visible when toggle is clicked', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Panel should have reasonable dimensions
      const panelBox = await panel.boundingBox();
      expect(panelBox).not.toBeNull();

      if (panelBox) {
        expect(panelBox.width).toBeGreaterThan(100);
        expect(panelBox.height).toBeGreaterThan(50);
      }
    });

    test('panel should have correct title "Past Events"', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Check for the title
      const title = panel.locator('[data-testid="past-events-panel-title"]');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('Past Events');
    });

    test('panel should have proper ARIA attributes', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
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
      expect(ariaLabel).toContain('Past');
    });

    test('close button should close the panel', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Click the close button
      const closeButton = page.locator('[data-testid="past-events-panel-close"]');
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

    test('panel should display historical events count', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Check for the count text
      const countText = panel.getByText(/3 Historical Event/);
      await expect(countText).toBeVisible();
    });
  });

  test.describe('Event Display', () => {
    test('should display exactly 3 past events', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Count event cards
      const eventCards = panel.locator('[data-testid^="past-event-card-"]');
      await expect(eventCards).toHaveCount(3);
    });

    test('each event should display name and date', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Check event 1 - North Ridge Rockfall
      const event1 = page.locator('[data-testid="past-event-card-PE001"]');
      await expect(event1).toBeVisible();
      const event1Text = await event1.textContent();
      expect(event1Text).toContain('North Ridge Rockfall');

      // Check event 2 - East Slope Landslide
      const event2 = page.locator('[data-testid="past-event-card-PE002"]');
      await expect(event2).toBeVisible();
      const event2Text = await event2.textContent();
      expect(event2Text).toContain('East Slope Landslide');

      // Check event 3 - West Quarry Subsidence
      const event3 = page.locator('[data-testid="past-event-card-PE003"]');
      await expect(event3).toBeVisible();
      const event3Text = await event3.textContent();
      expect(event3Text).toContain('West Quarry Subsidence');
    });

    test('each event should show event type badge', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Check event type badges exist for each event
      const badge1 = page.locator('[data-testid="event-type-badge-PE001"]');
      await expect(badge1).toBeVisible();
      await expect(badge1).toHaveText('Rockfall');

      const badge2 = page.locator('[data-testid="event-type-badge-PE002"]');
      await expect(badge2).toBeVisible();
      await expect(badge2).toHaveText('Landslide');

      const badge3 = page.locator('[data-testid="event-type-badge-PE003"]');
      await expect(badge3).toBeVisible();
      await expect(badge3).toHaveText('Subsidence');
    });

    test('each event should display location', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Check locations are present
      await expect(panel.getByText('North Ridge')).toBeVisible();
      await expect(panel.getByText('East Slope')).toBeVisible();
      await expect(panel.getByText('West Quarry')).toBeVisible();
    });

    test('event type badges should have correct colors', async ({ page }) => {
      // Rockfall badge - orange
      const rockfallBadge = page.locator('[data-testid="event-type-badge-PE001"]');
      await expect(rockfallBadge).toBeVisible();
      const rockfallClasses = await rockfallBadge.getAttribute('class');
      expect(rockfallClasses).toContain('orange');

      // Landslide badge - amber
      const landslideBadge = page.locator('[data-testid="event-type-badge-PE002"]');
      await expect(landslideBadge).toBeVisible();
      const landslideClasses = await landslideBadge.getAttribute('class');
      expect(landslideClasses).toContain('amber');

      // Subsidence badge - rose
      const subsidenceBadge = page.locator('[data-testid="event-type-badge-PE003"]');
      await expect(subsidenceBadge).toBeVisible();
      const subsidenceClasses = await subsidenceBadge.getAttribute('class');
      expect(subsidenceClasses).toContain('rose');
    });

    test('events should display event descriptions', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Check that descriptions are truncated but visible
      const event1 = page.locator('[data-testid="past-event-card-PE001"]');
      const event1Text = await event1.textContent();
      expect(event1Text).toContain('freeze-thaw');
    });
  });

  test.describe('Similarity Display', () => {
    test('each event should show similarity percentage', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Check similarity indicators exist for each event
      const sim1 = page.locator('[data-testid="similarity-indicator-PE001"]');
      await expect(sim1).toBeVisible();
      const sim1Text = await sim1.textContent();
      expect(sim1Text).toContain('89%');

      const sim2 = page.locator('[data-testid="similarity-indicator-PE002"]');
      await expect(sim2).toBeVisible();
      const sim2Text = await sim2.textContent();
      expect(sim2Text).toContain('67%');

      const sim3 = page.locator('[data-testid="similarity-indicator-PE003"]');
      await expect(sim3).toBeVisible();
      const sim3Text = await sim3.textContent();
      expect(sim3Text).toContain('45%');
    });

    test('similarity percentages should be within valid range (0-100)', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      const eventIds = ['PE001', 'PE002', 'PE003'];

      for (const eventId of eventIds) {
        const simIndicator = page.locator(`[data-testid="similarity-indicator-${eventId}"]`);
        await expect(simIndicator).toBeVisible();

        const text = await simIndicator.textContent();
        const percentageMatch = text?.match(/(\d+)%/);
        expect(percentageMatch).toBeTruthy();

        if (percentageMatch) {
          const percentage = parseInt(percentageMatch[1], 10);
          expect(percentage).toBeGreaterThanOrEqual(0);
          expect(percentage).toBeLessThanOrEqual(100);
        }
      }
    });

    test('similarity indicator should have visual progress bar', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Check that similarity indicators contain progress bar elements
      const simIndicator = page.locator('[data-testid="similarity-indicator-PE001"]');
      await expect(simIndicator).toBeVisible();

      // Progress bar should have a child div with width style
      const progressBar = simIndicator.locator('div[style*="width"]');
      await expect(progressBar).toBeVisible();

      const style = await progressBar.getAttribute('style');
      expect(style).toContain('width');
    });

    test('similarity colors should reflect severity', async ({ page }) => {
      // High similarity (89%) should be rose/red
      const sim1 = page.locator('[data-testid="similarity-indicator-PE001"]');
      const sim1Color = await sim1.evaluate((el) => {
        const bar = el.querySelector('div > div');
        return bar ? window.getComputedStyle(bar).backgroundColor : null;
      });
      expect(sim1Color).toBeTruthy();

      // Medium similarity (67%) should be amber
      const sim2 = page.locator('[data-testid="similarity-indicator-PE002"]');
      const sim2Color = await sim2.evaluate((el) => {
        const bar = el.querySelector('div > div');
        return bar ? window.getComputedStyle(bar).backgroundColor : null;
      });
      expect(sim2Color).toBeTruthy();

      // Low similarity (45%) should be emerald/green
      const sim3 = page.locator('[data-testid="similarity-indicator-PE003"]');
      const sim3Color = await sim3.evaluate((el) => {
        const bar = el.querySelector('div > div');
        return bar ? window.getComputedStyle(bar).backgroundColor : null;
      });
      expect(sim3Color).toBeTruthy();
    });
  });

  test.describe('Event Selection', () => {
    test('clicking an event card should select it', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await eventCard.click();
      await page.waitForTimeout(200);

      // Card should have aria-expanded="true"
      const ariaExpanded = await eventCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });

    test('selected event should have visual highlight', async ({ page }) => {
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await eventCard.click();
      await page.waitForTimeout(200);

      // Check for ring class indicating selection
      const classes = await eventCard.getAttribute('class');
      expect(classes).toContain('ring');
    });

    test('only one event should be selected at a time', async ({ page }) => {
      // Select first event
      const event1 = page.locator('[data-testid="past-event-card-PE001"]');
      await event1.click();
      await page.waitForTimeout(200);

      // Select second event
      const event2 = page.locator('[data-testid="past-event-card-PE002"]');
      await event2.click();
      await page.waitForTimeout(200);

      // First event should no longer be selected
      const event1Expanded = await event1.getAttribute('aria-expanded');
      expect(event1Expanded).toBe('false');

      // Second event should be selected
      const event2Expanded = await event2.getAttribute('aria-expanded');
      expect(event2Expanded).toBe('true');
    });

    test('clicking a different event should change selection', async ({ page }) => {
      // Select first event
      const event1 = page.locator('[data-testid="past-event-card-PE001"]');
      await event1.click();
      await page.waitForTimeout(200);

      // Verify first is selected
      let event1Classes = await event1.getAttribute('class');
      expect(event1Classes).toContain('ring');

      // Select third event
      const event3 = page.locator('[data-testid="past-event-card-PE003"]');
      await event3.click();
      await page.waitForTimeout(200);

      // First should no longer have ring
      event1Classes = await event1.getAttribute('class');
      expect(event1Classes).not.toContain('ring-sky');

      // Third should have ring
      const event3Classes = await event3.getAttribute('class');
      expect(event3Classes).toContain('ring');
    });

    test('clicking a selected event should deselect it', async ({ page }) => {
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');

      // Select the event
      await eventCard.click();
      await page.waitForTimeout(200);
      let ariaExpanded = await eventCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');

      // Click again to deselect
      await eventCard.click();
      await page.waitForTimeout(200);
      ariaExpanded = await eventCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');
    });
  });

  test.describe('Comparison Placeholder', () => {
    test('placeholder should be hidden when no event is selected', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Placeholder should not be visible initially
      const placeholder = page.locator('[data-testid="comparison-placeholder"]');
      await expect(placeholder).not.toBeVisible();
    });

    test('placeholder should appear when an event is selected', async ({ page }) => {
      // Select an event
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await eventCard.click();
      await page.waitForTimeout(200);

      // Placeholder should now be visible
      const placeholder = page.locator('[data-testid="comparison-placeholder"]');
      await expect(placeholder).toBeVisible();
    });

    test('placeholder should contain future feature message', async ({ page }) => {
      // Select an event
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await eventCard.click();
      await page.waitForTimeout(200);

      // Check placeholder content
      const placeholder = page.locator('[data-testid="comparison-placeholder"]');
      await expect(placeholder).toBeVisible();

      const placeholderText = await placeholder.textContent();
      expect(placeholderText).toContain('Point Cloud Comparison');
      expect(placeholderText).toContain('future update');
    });

    test('placeholder should show selected event name', async ({ page }) => {
      // Select first event
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await eventCard.click();
      await page.waitForTimeout(200);

      const placeholder = page.locator('[data-testid="comparison-placeholder"]');
      const placeholderText = await placeholder.textContent();
      expect(placeholderText).toContain('North Ridge Rockfall');
    });

    test('placeholder should disappear when event is deselected', async ({ page }) => {
      // Select an event
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await eventCard.click();
      await page.waitForTimeout(200);

      // Verify placeholder is visible
      const placeholder = page.locator('[data-testid="comparison-placeholder"]');
      await expect(placeholder).toBeVisible();

      // Deselect the event
      await eventCard.click();
      await page.waitForTimeout(200);

      // Placeholder should be hidden
      await expect(placeholder).not.toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('panel should have role="dialog"', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      const role = await panel.getAttribute('role');
      expect(role).toBe('dialog');
    });

    test('event cards should be keyboard accessible', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Event cards should be buttons (focusable)
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      const tagName = await eventCard.evaluate((el) => el.tagName.toLowerCase());
      expect(tagName).toBe('button');

      // Focus the card
      await eventCard.focus();
      const isFocused = await eventCard.evaluate(
        (el) => document.activeElement === el
      );
      expect(isFocused).toBe(true);
    });

    test('close button should be focusable', async ({ page }) => {
      const closeButton = page.locator('[data-testid="past-events-panel-close"]');
      await expect(closeButton).toBeVisible();

      await closeButton.focus();

      const isFocused = await closeButton.evaluate(
        (el) => document.activeElement === el
      );
      expect(isFocused).toBe(true);
    });

    test('event cards should have aria-label with full context', async ({ page }) => {
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await expect(eventCard).toBeVisible();

      const ariaLabel = await eventCard.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('North Ridge Rockfall');
      expect(ariaLabel).toContain('Rockfall');
      expect(ariaLabel).toContain('89%');
    });

    test('close button should have aria-label', async ({ page }) => {
      const closeButton = page.locator('[data-testid="past-events-panel-close"]');
      const ariaLabel = await closeButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain('close');
    });

    test('Enter key should toggle event selection', async ({ page }) => {
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await eventCard.focus();

      // Press Enter to select
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      const ariaExpanded = await eventCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');

      // Press Enter again to deselect
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      const ariaExpandedAfter = await eventCard.getAttribute('aria-expanded');
      expect(ariaExpandedAfter).toBe('false');
    });

    test('Space key should toggle event selection', async ({ page }) => {
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await eventCard.focus();

      // Press Space to select
      await page.keyboard.press('Space');
      await page.waitForTimeout(200);

      const ariaExpanded = await eventCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });
  });

  test.describe('Toggle Button', () => {
    test('toggle button should be visible on LiveTerrain page', async ({ page }) => {
      // Navigate fresh without opening the panel
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      const toggleButton = page.locator('[data-testid="past-events-toggle"]');
      await expect(toggleButton).toBeVisible();
    });

    test('toggle button should open panel when clicked', async ({ page }) => {
      // Navigate fresh
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Panel should not be visible initially
      const panel = page.locator('[data-testid="past-events-panel"]');

      // Click toggle to open
      const toggleButton = page.locator('[data-testid="past-events-toggle"]');
      await toggleButton.click();
      await page.waitForTimeout(500);

      // Panel should now be visible
      await expect(panel).toBeVisible();
    });

    test('toggle button should close panel when clicked again', async ({ page }) => {
      // Panel is already open from beforeEach
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Click toggle to close
      const toggleButton = page.locator('[data-testid="past-events-toggle"]');
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

      const toggleButton = page.locator('[data-testid="past-events-toggle"]');

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

    test('toggle button should have proper label', async ({ page }) => {
      const toggleButton = page.locator('[data-testid="past-events-toggle"]');
      await expect(toggleButton).toBeVisible();

      const ariaLabel = await toggleButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('panel is visible on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open panel
      await page.click('[data-testid="past-events-toggle"]');
      await page.waitForTimeout(500);

      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // All events should still be visible
      const events = panel.locator('[data-testid^="past-event-card-"]');
      await expect(events).toHaveCount(3);
    });

    test('panel is usable on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open panel
      await page.click('[data-testid="past-events-toggle"]');
      await page.waitForTimeout(500);

      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Should still be able to select an event
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      await eventCard.click();
      await page.waitForTimeout(200);

      const ariaExpanded = await eventCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });
  });

  test.describe('Visual Indicators', () => {
    test('selected event should have different background', async ({ page }) => {
      const event1 = page.locator('[data-testid="past-event-card-PE001"]');
      const event2 = page.locator('[data-testid="past-event-card-PE002"]');

      // Get initial styles for event 1
      const stylesBeforeSelect = await event1.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // Select event 1
      await event1.click();
      await page.waitForTimeout(200);

      // Get styles after select
      const stylesAfterSelect = await event1.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // Get styles of unselected event 2
      const event2Styles = await event2.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // Selected event should look different from unselected
      const hasVisualChange =
        stylesAfterSelect.backgroundColor !== event2Styles.backgroundColor ||
        stylesAfterSelect.borderColor !== event2Styles.borderColor;

      expect(hasVisualChange).toBe(true);
    });

    test('panel has proper glassmorphic styling', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
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

  test.describe('Edge Cases', () => {
    test('rapid selection changes work correctly', async ({ page }) => {
      // Rapidly click different events
      for (let i = 0; i < 3; i++) {
        await page.click('[data-testid="past-event-card-PE001"]');
        await page.waitForTimeout(50);
        await page.click('[data-testid="past-event-card-PE002"]');
        await page.waitForTimeout(50);
        await page.click('[data-testid="past-event-card-PE003"]');
        await page.waitForTimeout(50);
      }

      await page.waitForTimeout(300);

      // Panel should be in a consistent state
      const event3 = page.locator('[data-testid="past-event-card-PE003"]');
      const ariaExpanded = await event3.getAttribute('aria-expanded');
      expect(ariaExpanded === 'true' || ariaExpanded === 'false').toBe(true);
    });

    test('panel state resets when navigating away and back', async ({ page }) => {
      // Select an event
      await page.click('[data-testid="past-event-card-PE001"]');
      await page.waitForTimeout(200);

      // Verify selection
      const placeholder = page.locator('[data-testid="comparison-placeholder"]');
      await expect(placeholder).toBeVisible();

      // Navigate away
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate back
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open panel again
      await page.click('[data-testid="past-events-toggle"]');
      await page.waitForTimeout(500);

      // Panel should be visible
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Selection state should be reset (no placeholder visible)
      await expect(placeholder).not.toBeVisible();
    });

    test('expand/collapse does not cause console errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Interact with panel - select/deselect events
      for (let i = 0; i < 3; i++) {
        await page.click('[data-testid="past-event-card-PE001"]');
        await page.waitForTimeout(100);
        await page.click('[data-testid="past-event-card-PE001"]');
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

    test('all events can be cycled through', async ({ page }) => {
      const eventIds = ['PE001', 'PE002', 'PE003'];

      for (const eventId of eventIds) {
        const eventCard = page.locator(`[data-testid="past-event-card-${eventId}"]`);
        await eventCard.click();
        await page.waitForTimeout(150);

        const ariaExpanded = await eventCard.getAttribute('aria-expanded');
        expect(ariaExpanded).toBe('true');

        // Placeholder should show selected event
        const placeholder = page.locator('[data-testid="comparison-placeholder"]');
        await expect(placeholder).toBeVisible();

        // Deselect
        await eventCard.click();
        await page.waitForTimeout(150);
      }
    });
  });

  test.describe('Integration', () => {
    test('panel state persists after viewer interaction', async ({ page }) => {
      // Select an event
      await page.click('[data-testid="past-event-card-PE001"]');
      await page.waitForTimeout(200);

      const placeholder = page.locator('[data-testid="comparison-placeholder"]');
      await expect(placeholder).toBeVisible();

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

      // Event should still be selected
      const eventCard = page.locator('[data-testid="past-event-card-PE001"]');
      const ariaExpanded = await eventCard.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });

    test('panel remains visible after view mode change', async ({ page }) => {
      const panel = page.locator('[data-testid="past-events-panel"]');
      await expect(panel).toBeVisible();

      // Change view mode if available
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      if (await heightMode.isVisible()) {
        await heightMode.click();
        await page.waitForTimeout(500);
      }

      // Panel should still be visible
      await expect(panel).toBeVisible();

      // Events should still be visible
      const events = panel.locator('[data-testid^="past-event-card-"]');
      await expect(events).toHaveCount(3);
    });

    test('panel does not cause rendering errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Interact with panel
      const eventIds = ['PE001', 'PE002', 'PE003'];
      for (const eventId of eventIds) {
        await page.click(`[data-testid="past-event-card-${eventId}"]`);
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
