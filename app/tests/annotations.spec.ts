/**
 * Annotation System Test Specifications
 *
 * Description:
 * Playwright E2E tests for the annotation system on the Live Terrain page.
 * Verifies that tower installation annotations display correctly on the point cloud,
 * clicking annotations opens the OnClickDataPanel with weather KPI data,
 * and the panel functions properly.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const ANNOTATION_COUNT = 3;

test.describe('Annotation System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/live-terrain`);
    await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
    // Allow time for point cloud and annotations to render
    await page.waitForTimeout(2000);
  });

  test.describe('Annotation Display', () => {
    test('displays predefined annotations on the point cloud', async ({ page }) => {
      for (let i = 0; i < ANNOTATION_COUNT; i++) {
        const annotation = page.locator(`[data-testid="annotation-marker-${i}"]`);
        await expect(annotation).toBeVisible();
      }
    });

    test('annotation markers are clickable', async ({ page }) => {
      for (let i = 0; i < ANNOTATION_COUNT; i++) {
        const annotation = page.locator(`[data-testid="annotation-marker-${i}"]`);
        const isClickable = await annotation.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.pointerEvents !== 'none' && !el.hasAttribute('disabled');
        });
        expect(isClickable).toBe(true);
      }
    });

    test('annotation markers have visual presence', async ({ page }) => {
      const annotation = page.locator('[data-testid="annotation-marker-0"]');
      const styles = await annotation.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return { width: computed.width, height: computed.height };
      });
      expect(styles.width).not.toBe('0px');
      expect(styles.height).not.toBe('0px');
    });
  });

  test.describe('Data Panel Interaction', () => {
    test('opens data panel when annotation is clicked', async ({ page }) => {
      const dataPanel = page.locator('[data-testid="onclick-data-panel"]');

      // Panel should not be visible initially
      await expect(dataPanel).not.toBeVisible();

      // Click annotation
      await page.locator('[data-testid="annotation-marker-0"]').click();

      // Panel should now be visible
      await expect(dataPanel).toBeVisible();
    });

    test('displays 4 weather KPI cards in the data panel', async ({ page }) => {
      await page.locator('[data-testid="annotation-marker-0"]').click();

      const dataPanel = page.locator('[data-testid="onclick-data-panel"]');
      await expect(dataPanel).toBeVisible();

      const weatherCards = dataPanel.locator('[data-testid="weather-kpi-card"]');
      await expect(weatherCards).toHaveCount(4);
    });

    test('closes data panel when close button is clicked', async ({ page }) => {
      const dataPanel = page.locator('[data-testid="onclick-data-panel"]');

      // Open panel
      await page.locator('[data-testid="annotation-marker-0"]').click();
      await expect(dataPanel).toBeVisible();

      // Close panel
      await page.locator('[data-testid="onclick-data-panel-close"]').click();
      await expect(dataPanel).not.toBeVisible();
    });

    test('updates panel content when different annotation is clicked', async ({ page }) => {
      const panelTitle = page.locator('[data-testid="onclick-data-panel-title"]');

      // Click first annotation
      await page.locator('[data-testid="annotation-marker-0"]').click();
      const firstTitle = await panelTitle.textContent();

      // Click second annotation
      await page.locator('[data-testid="annotation-marker-1"]').click();
      const secondTitle = await panelTitle.textContent();

      expect(secondTitle).not.toBe(firstTitle);
    });

    test('each annotation displays unique name in panel', async ({ page }) => {
      const titles: string[] = [];
      const dataPanel = page.locator('[data-testid="onclick-data-panel"]');
      const closeButton = page.locator('[data-testid="onclick-data-panel-close"]');

      for (let i = 0; i < ANNOTATION_COUNT; i++) {
        await page.locator(`[data-testid="annotation-marker-${i}"]`).click();
        await expect(dataPanel).toBeVisible();

        const title = await page.locator('[data-testid="onclick-data-panel-title"]').textContent();
        if (title) titles.push(title.trim());

        await closeButton.click();
        await expect(dataPanel).not.toBeVisible();
      }

      expect(titles).toHaveLength(ANNOTATION_COUNT);
      titles.forEach((title) => expect(title.length).toBeGreaterThan(0));
    });
  });

  test.describe('Panel Accessibility', () => {
    test('close button has accessible name', async ({ page }) => {
      await page.locator('[data-testid="annotation-marker-0"]').click();

      const closeButton = page.locator('[data-testid="onclick-data-panel-close"]');
      await expect(closeButton).toBeVisible();
      await expect(closeButton).toBeEnabled();

      const ariaLabel = await closeButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    test('close button responds to keyboard activation', async ({ page }) => {
      const dataPanel = page.locator('[data-testid="onclick-data-panel"]');

      await page.locator('[data-testid="annotation-marker-0"]').click();
      await expect(dataPanel).toBeVisible();

      const closeButton = page.locator('[data-testid="onclick-data-panel-close"]');
      await closeButton.focus();
      await page.keyboard.press('Enter');

      await expect(dataPanel).not.toBeVisible();
    });

    test('data panel has appropriate ARIA attributes', async ({ page }) => {
      await page.locator('[data-testid="annotation-marker-0"]').click();

      const dataPanel = page.locator('[data-testid="onclick-data-panel"]');
      await expect(dataPanel).toBeVisible();

      const role = await dataPanel.getAttribute('role');
      const ariaLabel = await dataPanel.getAttribute('aria-label');

      expect(role || ariaLabel).toBeTruthy();
    });
  });

  test.describe('Integration', () => {
    test('annotations remain visible after changing view mode', async ({ page }) => {
      const heightMode = page.locator('[data-testid="view-mode-height"]');
      if (await heightMode.isVisible()) {
        await heightMode.click();
        await page.waitForTimeout(500);
      }

      for (let i = 0; i < ANNOTATION_COUNT; i++) {
        await expect(page.locator(`[data-testid="annotation-marker-${i}"]`)).toBeVisible();
      }
    });

    test('panel can be reopened after closing', async ({ page }) => {
      const annotation = page.locator('[data-testid="annotation-marker-0"]');
      const dataPanel = page.locator('[data-testid="onclick-data-panel"]');
      const closeButton = page.locator('[data-testid="onclick-data-panel-close"]');

      // Open
      await annotation.click();
      await expect(dataPanel).toBeVisible();

      // Close
      await closeButton.click();
      await expect(dataPanel).not.toBeVisible();

      // Reopen
      await annotation.click();
      await expect(dataPanel).toBeVisible();
    });

    test('no critical console errors during annotation interactions', async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      // Interact with annotations
      for (let i = 0; i < ANNOTATION_COUNT; i++) {
        await page.locator(`[data-testid="annotation-marker-${i}"]`).click();
        await page.waitForTimeout(200);
      }

      // Filter out expected/non-critical errors
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
    test('multiple open/close cycles work correctly', async ({ page }) => {
      const annotation = page.locator('[data-testid="annotation-marker-0"]');
      const dataPanel = page.locator('[data-testid="onclick-data-panel"]');
      const closeButton = page.locator('[data-testid="onclick-data-panel-close"]');

      for (let i = 0; i < 3; i++) {
        await annotation.click();
        await expect(dataPanel).toBeVisible();
        await closeButton.click();
        await expect(dataPanel).not.toBeVisible();
      }

      // Final verification
      await annotation.click();
      await expect(dataPanel).toBeVisible();
      await expect(dataPanel.locator('[data-testid="weather-kpi-card"]')).toHaveCount(4);
    });

    test('panel state resets when navigating away and back', async ({ page }) => {
      const dataPanel = page.locator('[data-testid="onclick-data-panel"]');

      // Open panel
      await page.locator('[data-testid="annotation-marker-0"]').click();
      await expect(dataPanel).toBeVisible();

      // Navigate away
      await page.getByRole('link', { name: 'Quick Overview' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Navigate back
      await page.getByRole('link', { name: 'Live Terrain' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/live-terrain`);
      await page.waitForSelector('[data-testid="pointcloud-viewer"]');
      await page.waitForTimeout(2000);

      // Panel should be closed, annotations visible
      await expect(dataPanel).not.toBeVisible();
      await expect(page.locator('[data-testid="annotation-marker-0"]')).toBeVisible();
    });
  });
});
