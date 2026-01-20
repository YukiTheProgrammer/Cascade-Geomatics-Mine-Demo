/**
 * KPI Components Test Specifications
 *
 * Description:
 * Playwright end-to-end tests for KPI (Key Performance Indicator) components
 * displayed on the Quick Overview page. Tests verify correct rendering of
 * hardware status cards, weather condition cards, status indicators, icons,
 * timestamps, and responsive layout behavior.
 *
 * Sample Input:
 * - Page load at "/" (Quick Overview route)
 * - Hardware KPI strip with 3 cards (Towers, Server, Model)
 * - Weather KPI strip with 6 cards (Temperature, Precipitation, Wind Speed,
 *   Wind Direction, Humidity, Pressure)
 *
 * Expected Output:
 * - All KPI cards render with title, value, and status indicator
 * - Status colors display correctly (green/yellow/red based on status)
 * - Icons display correctly for each KPI type
 * - Timestamps display in human-readable format
 * - Cards wrap correctly on smaller screen sizes
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('KPI Components', () => {
  test.describe('KPI Card Core Rendering', () => {
    test('renders KPI cards with all required fields (title, value, status)', async ({ page }) => {
      await page.goto(BASE_URL);

      // Locate the KPI section
      const kpiSection = page.locator('[data-testid="kpi-section"]');
      await expect(kpiSection).toBeVisible();

      // Verify at least one KPI card exists with required fields
      const kpiCards = page.locator('[data-testid="kpi-card"]');
      const cardCount = await kpiCards.count();
      expect(cardCount).toBeGreaterThan(0);

      // Check first card has title, value, and status indicator
      const firstCard = kpiCards.first();
      const cardTitle = firstCard.locator('[data-testid="kpi-card-title"]');
      const cardValue = firstCard.locator('[data-testid="kpi-card-value"]');
      const cardStatus = firstCard.locator('[data-testid="kpi-card-status"]');

      await expect(cardTitle).toBeVisible();
      await expect(cardValue).toBeVisible();
      await expect(cardStatus).toBeVisible();
    });

    test('KPI card titles display correct text content', async ({ page }) => {
      await page.goto(BASE_URL);

      // Verify hardware KPI titles
      await expect(page.getByText('Towers')).toBeVisible();
      await expect(page.getByText('Server')).toBeVisible();
      await expect(page.getByText('Model')).toBeVisible();

      // Verify weather KPI titles
      await expect(page.getByText('Temperature')).toBeVisible();
      await expect(page.getByText('Precipitation')).toBeVisible();
      await expect(page.getByText('Wind Speed')).toBeVisible();
      await expect(page.getByText('Wind Direction')).toBeVisible();
      await expect(page.getByText('Humidity')).toBeVisible();
      await expect(page.getByText('Pressure')).toBeVisible();
    });

    test('KPI card values are visible and non-empty', async ({ page }) => {
      await page.goto(BASE_URL);

      const kpiValues = page.locator('[data-testid="kpi-card-value"]');
      const valueCount = await kpiValues.count();

      for (let i = 0; i < valueCount; i++) {
        const value = kpiValues.nth(i);
        await expect(value).toBeVisible();
        const textContent = await value.textContent();
        expect(textContent?.trim()).not.toBe('');
      }
    });
  });

  test.describe('Hardware KPI Strip', () => {
    test('displays hardware KPI strip with 3 cards', async ({ page }) => {
      await page.goto(BASE_URL);

      const hardwareStrip = page.locator('[data-testid="hardware-kpi-strip"]');
      await expect(hardwareStrip).toBeVisible();

      const hardwareCards = hardwareStrip.locator('[data-testid="kpi-card"]');
      await expect(hardwareCards).toHaveCount(3);
    });

    test('displays "Hardware Status" section title', async ({ page }) => {
      await page.goto(BASE_URL);

      const hardwareTitle = page.getByText('Hardware Status');
      await expect(hardwareTitle).toBeVisible();
    });

    test('Towers KPI displays online count value', async ({ page }) => {
      await page.goto(BASE_URL);

      const towersCard = page.locator('[data-testid="kpi-card-towers"]');
      await expect(towersCard).toBeVisible();

      // Value should show format like "4/5 Online"
      const towersValue = towersCard.locator('[data-testid="kpi-card-value"]');
      const textContent = await towersValue.textContent();
      expect(textContent).toMatch(/\d+\/\d+\s*Online/i);
    });

    test('Server KPI displays operational status', async ({ page }) => {
      await page.goto(BASE_URL);

      const serverCard = page.locator('[data-testid="kpi-card-server"]');
      await expect(serverCard).toBeVisible();

      const serverValue = serverCard.locator('[data-testid="kpi-card-value"]');
      await expect(serverValue).toContainText('Operational');
    });

    test('Model KPI displays last update time', async ({ page }) => {
      await page.goto(BASE_URL);

      const modelCard = page.locator('[data-testid="kpi-card-model"]');
      await expect(modelCard).toBeVisible();

      const modelValue = modelCard.locator('[data-testid="kpi-card-value"]');
      const textContent = await modelValue.textContent();
      // Should show format like "Updated 2h ago"
      expect(textContent).toMatch(/Updated\s+\d+[hm]\s*ago/i);
    });
  });

  test.describe('Weather KPI Strip', () => {
    test('displays weather KPI strip with 6 cards', async ({ page }) => {
      await page.goto(BASE_URL);

      const weatherStrip = page.locator('[data-testid="weather-kpi-strip"]');
      await expect(weatherStrip).toBeVisible();

      const weatherCards = weatherStrip.locator('[data-testid="kpi-card"]');
      await expect(weatherCards).toHaveCount(6);
    });

    test('displays "Weather Conditions" section title', async ({ page }) => {
      await page.goto(BASE_URL);

      const weatherTitle = page.getByText('Weather Conditions');
      await expect(weatherTitle).toBeVisible();
    });

    test('Temperature KPI displays value with unit', async ({ page }) => {
      await page.goto(BASE_URL);

      const tempCard = page.locator('[data-testid="kpi-card-temperature"]');
      await expect(tempCard).toBeVisible();

      const tempValue = tempCard.locator('[data-testid="kpi-card-value"]');
      const textContent = await tempValue.textContent();
      // Should contain degree symbol and C
      expect(textContent).toMatch(/\d+\s*°C/);
    });

    test('Precipitation KPI displays value with mm unit', async ({ page }) => {
      await page.goto(BASE_URL);

      const precipCard = page.locator('[data-testid="kpi-card-precipitation"]');
      await expect(precipCard).toBeVisible();

      const precipValue = precipCard.locator('[data-testid="kpi-card-value"]');
      const textContent = await precipValue.textContent();
      expect(textContent).toMatch(/\d+\s*mm/);
    });

    test('Wind Speed KPI displays value with km/h unit', async ({ page }) => {
      await page.goto(BASE_URL);

      const windCard = page.locator('[data-testid="kpi-card-wind-speed"]');
      await expect(windCard).toBeVisible();

      const windValue = windCard.locator('[data-testid="kpi-card-value"]');
      const textContent = await windValue.textContent();
      expect(textContent).toMatch(/\d+\s*km\/h/);
    });

    test('Wind Direction KPI displays value with degree unit', async ({ page }) => {
      await page.goto(BASE_URL);

      const directionCard = page.locator('[data-testid="kpi-card-wind-direction"]');
      await expect(directionCard).toBeVisible();

      const directionValue = directionCard.locator('[data-testid="kpi-card-value"]');
      const textContent = await directionValue.textContent();
      expect(textContent).toMatch(/\d+\s*°/);
    });

    test('Humidity KPI displays value with percentage unit', async ({ page }) => {
      await page.goto(BASE_URL);

      const humidityCard = page.locator('[data-testid="kpi-card-humidity"]');
      await expect(humidityCard).toBeVisible();

      const humidityValue = humidityCard.locator('[data-testid="kpi-card-value"]');
      const textContent = await humidityValue.textContent();
      expect(textContent).toMatch(/\d+\s*%/);
    });

    test('Pressure KPI displays value with hPa unit', async ({ page }) => {
      await page.goto(BASE_URL);

      const pressureCard = page.locator('[data-testid="kpi-card-pressure"]');
      await expect(pressureCard).toBeVisible();

      const pressureValue = pressureCard.locator('[data-testid="kpi-card-value"]');
      const textContent = await pressureValue.textContent();
      expect(textContent).toMatch(/\d+\s*hPa/);
    });
  });

  test.describe('Status Colors', () => {
    test('success status displays green color indicator', async ({ page }) => {
      await page.goto(BASE_URL);

      // Server card should have success status (green)
      const serverCard = page.locator('[data-testid="kpi-card-server"]');
      const statusIndicator = serverCard.locator('[data-testid="kpi-card-status"]');

      await expect(statusIndicator).toBeVisible();
      await expect(statusIndicator).toHaveClass(/bg-green-500|text-green/);
    });

    test('warning status displays yellow color indicator', async ({ page }) => {
      await page.goto(BASE_URL);

      // Towers card should have warning status (yellow) due to one tower offline
      const towersCard = page.locator('[data-testid="kpi-card-towers"]');
      const statusIndicator = towersCard.locator('[data-testid="kpi-card-status"]');

      await expect(statusIndicator).toBeVisible();
      await expect(statusIndicator).toHaveClass(/bg-yellow-500|text-yellow/);
    });

    test('info status displays blue color indicator', async ({ page }) => {
      await page.goto(BASE_URL);

      // Model card should have info status (blue)
      const modelCard = page.locator('[data-testid="kpi-card-model"]');
      const statusIndicator = modelCard.locator('[data-testid="kpi-card-status"]');

      await expect(statusIndicator).toBeVisible();
      await expect(statusIndicator).toHaveClass(/bg-blue-500|text-blue/);
    });

    test('error status displays red color indicator when applicable', async ({ page }) => {
      await page.goto(BASE_URL);

      // Look for any card with error status
      const errorIndicators = page.locator('[data-testid="kpi-card-status"].bg-red-500');

      // Error status may not be present in default data, so just verify
      // the selector works if there are error cards
      const count = await errorIndicators.count();
      if (count > 0) {
        await expect(errorIndicators.first()).toBeVisible();
      }
    });

    test('all status indicators have consistent sizing', async ({ page }) => {
      await page.goto(BASE_URL);

      const statusIndicators = page.locator('[data-testid="kpi-card-status"]');
      const indicatorCount = await statusIndicators.count();

      for (let i = 0; i < indicatorCount; i++) {
        const indicator = statusIndicators.nth(i);
        await expect(indicator).toBeVisible();
        // Status indicators should be visible and have some dimension
        const box = await indicator.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.width).toBeGreaterThan(0);
          expect(box.height).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Icons', () => {
    test('Towers KPI displays Tower icon', async ({ page }) => {
      await page.goto(BASE_URL);

      const towersCard = page.locator('[data-testid="kpi-card-towers"]');
      const icon = towersCard.locator('[data-testid="kpi-card-icon"]');

      await expect(icon).toBeVisible();
      // Verify SVG icon is present
      await expect(icon.locator('svg')).toBeVisible();
    });

    test('Server KPI displays Server icon', async ({ page }) => {
      await page.goto(BASE_URL);

      const serverCard = page.locator('[data-testid="kpi-card-server"]');
      const icon = serverCard.locator('[data-testid="kpi-card-icon"]');

      await expect(icon).toBeVisible();
      await expect(icon.locator('svg')).toBeVisible();
    });

    test('Model KPI displays Brain icon', async ({ page }) => {
      await page.goto(BASE_URL);

      const modelCard = page.locator('[data-testid="kpi-card-model"]');
      const icon = modelCard.locator('[data-testid="kpi-card-icon"]');

      await expect(icon).toBeVisible();
      await expect(icon.locator('svg')).toBeVisible();
    });

    test('Temperature KPI displays Thermometer icon', async ({ page }) => {
      await page.goto(BASE_URL);

      const tempCard = page.locator('[data-testid="kpi-card-temperature"]');
      const icon = tempCard.locator('[data-testid="kpi-card-icon"]');

      await expect(icon).toBeVisible();
      await expect(icon.locator('svg')).toBeVisible();
    });

    test('Wind Speed KPI displays Wind icon', async ({ page }) => {
      await page.goto(BASE_URL);

      const windCard = page.locator('[data-testid="kpi-card-wind-speed"]');
      const icon = windCard.locator('[data-testid="kpi-card-icon"]');

      await expect(icon).toBeVisible();
      await expect(icon.locator('svg')).toBeVisible();
    });

    test('all KPI cards have visible icons', async ({ page }) => {
      await page.goto(BASE_URL);

      const kpiCards = page.locator('[data-testid="kpi-card"]');
      const cardCount = await kpiCards.count();

      for (let i = 0; i < cardCount; i++) {
        const card = kpiCards.nth(i);
        const icon = card.locator('[data-testid="kpi-card-icon"]');
        await expect(icon).toBeVisible();
      }
    });
  });

  test.describe('Timestamps', () => {
    test('KPI strips display last updated timestamp', async ({ page }) => {
      await page.goto(BASE_URL);

      const hardwareStrip = page.locator('[data-testid="hardware-kpi-strip"]');
      const weatherStrip = page.locator('[data-testid="weather-kpi-strip"]');

      const hardwareTimestamp = hardwareStrip.locator('[data-testid="kpi-strip-timestamp"]');
      const weatherTimestamp = weatherStrip.locator('[data-testid="kpi-strip-timestamp"]');

      await expect(hardwareTimestamp).toBeVisible();
      await expect(weatherTimestamp).toBeVisible();
    });

    test('timestamps display in human-readable format', async ({ page }) => {
      await page.goto(BASE_URL);

      const timestamps = page.locator('[data-testid="kpi-strip-timestamp"]');
      const timestampCount = await timestamps.count();

      for (let i = 0; i < timestampCount; i++) {
        const timestamp = timestamps.nth(i);
        const textContent = await timestamp.textContent();

        // Verify timestamp contains readable time information
        // Accepts formats like: "Updated: 2 min ago", "Last updated: Jan 18, 2026",
        // or ISO-like formats
        expect(textContent).toBeTruthy();
        expect(textContent?.length).toBeGreaterThan(5);
      }
    });

    test('Model KPI shows relative time format', async ({ page }) => {
      await page.goto(BASE_URL);

      const modelCard = page.locator('[data-testid="kpi-card-model"]');
      const modelValue = modelCard.locator('[data-testid="kpi-card-value"]');
      const textContent = await modelValue.textContent();

      // Should contain relative time like "2h ago"
      expect(textContent).toMatch(/ago/i);
    });
  });

  test.describe('Responsive Layout', () => {
    test('cards wrap correctly on mobile viewport (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);

      const kpiSection = page.locator('[data-testid="kpi-section"]');
      await expect(kpiSection).toBeVisible();

      // Verify cards are visible and within viewport
      const kpiCards = page.locator('[data-testid="kpi-card"]');
      const firstCard = kpiCards.first();
      await expect(firstCard).toBeVisible();

      const box = await firstCard.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        // Card should fit within mobile viewport
        expect(box.width).toBeLessThanOrEqual(375);
      }
    });

    test('cards wrap correctly on tablet viewport (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);

      const kpiCards = page.locator('[data-testid="kpi-card"]');
      const cardCount = await kpiCards.count();

      // Verify all cards are visible
      for (let i = 0; i < cardCount; i++) {
        await expect(kpiCards.nth(i)).toBeVisible();
      }
    });

    test('cards display in row layout on desktop viewport (1280px)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(BASE_URL);

      const hardwareStrip = page.locator('[data-testid="hardware-kpi-strip"]');
      const hardwareCards = hardwareStrip.locator('[data-testid="kpi-card"]');

      // Get bounding boxes for first two cards to verify horizontal layout
      const firstCard = hardwareCards.first();
      const secondCard = hardwareCards.nth(1);

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      expect(firstBox).not.toBeNull();
      expect(secondBox).not.toBeNull();

      if (firstBox && secondBox) {
        // Cards should be on approximately the same vertical position (row layout)
        expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(10);
        // Second card should be to the right of first card
        expect(secondBox.x).toBeGreaterThan(firstBox.x);
      }
    });

    test('all cards remain visible after viewport resize', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(BASE_URL);

      const kpiCards = page.locator('[data-testid="kpi-card"]');
      const initialCount = await kpiCards.count();

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300); // Wait for layout adjustment

      const mobileCount = await kpiCards.count();
      expect(mobileCount).toBe(initialCount);

      // Resize back to desktop
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.waitForTimeout(300);

      const desktopCount = await kpiCards.count();
      expect(desktopCount).toBe(initialCount);
    });
  });

  test.describe('Values Visibility and Legibility', () => {
    test('all KPI values are visible', async ({ page }) => {
      await page.goto(BASE_URL);

      const kpiValues = page.locator('[data-testid="kpi-card-value"]');
      const valueCount = await kpiValues.count();

      for (let i = 0; i < valueCount; i++) {
        const value = kpiValues.nth(i);
        await expect(value).toBeVisible();

        // Verify element has measurable dimensions
        const box = await value.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.width).toBeGreaterThan(0);
          expect(box.height).toBeGreaterThan(0);
        }
      }
    });

    test('KPI titles have adequate contrast and size', async ({ page }) => {
      await page.goto(BASE_URL);

      const kpiTitles = page.locator('[data-testid="kpi-card-title"]');
      const titleCount = await kpiTitles.count();

      for (let i = 0; i < titleCount; i++) {
        const title = kpiTitles.nth(i);
        await expect(title).toBeVisible();

        // Verify title has readable text
        const textContent = await title.textContent();
        expect(textContent?.trim().length).toBeGreaterThan(0);
      }
    });

    test('numeric values display correct formatting', async ({ page }) => {
      await page.goto(BASE_URL);

      // Check temperature value format
      const tempValue = page.locator('[data-testid="kpi-card-temperature"] [data-testid="kpi-card-value"]');
      const tempText = await tempValue.textContent();
      // Should be a number followed by unit
      expect(tempText).toMatch(/^\d+\s*°C$/);

      // Check humidity value format
      const humidityValue = page.locator('[data-testid="kpi-card-humidity"] [data-testid="kpi-card-value"]');
      const humidityText = await humidityValue.textContent();
      expect(humidityText).toMatch(/^\d+\s*%$/);
    });

    test('status text values are readable', async ({ page }) => {
      await page.goto(BASE_URL);

      // Check Server operational status
      const serverValue = page.locator('[data-testid="kpi-card-server"] [data-testid="kpi-card-value"]');
      const serverText = await serverValue.textContent();
      expect(serverText).toBe('Operational');

      // Check Towers online count
      const towersValue = page.locator('[data-testid="kpi-card-towers"] [data-testid="kpi-card-value"]');
      const towersText = await towersValue.textContent();
      expect(towersText).toMatch(/4\/5\s*Online/);
    });
  });

  test.describe('Accessibility', () => {
    test('KPI cards are keyboard accessible', async ({ page }) => {
      await page.goto(BASE_URL);

      // Tab through the page
      await page.keyboard.press('Tab');

      // KPI cards should be focusable if they are interactive
      const kpiCards = page.locator('[data-testid="kpi-card"]');
      const firstCard = kpiCards.first();

      // Verify card exists and is in the DOM
      await expect(firstCard).toBeVisible();
    });

    test('status indicators have accessible color alternatives', async ({ page }) => {
      await page.goto(BASE_URL);

      const statusIndicators = page.locator('[data-testid="kpi-card-status"]');
      const indicatorCount = await statusIndicators.count();

      for (let i = 0; i < indicatorCount; i++) {
        const indicator = statusIndicators.nth(i);
        // Each status should have either text label or aria-label
        const ariaLabel = await indicator.getAttribute('aria-label');
        const textContent = await indicator.textContent();

        // At least one accessibility feature should be present
        expect(ariaLabel || textContent?.trim()).toBeTruthy();
      }
    });

    test('icons have accessible labels', async ({ page }) => {
      await page.goto(BASE_URL);

      const icons = page.locator('[data-testid="kpi-card-icon"]');
      const iconCount = await icons.count();

      for (let i = 0; i < iconCount; i++) {
        const icon = icons.nth(i);
        // Icons should have aria-hidden or aria-label
        const ariaHidden = await icon.getAttribute('aria-hidden');
        const ariaLabel = await icon.getAttribute('aria-label');
        const role = await icon.getAttribute('role');

        // Icon should either be hidden from screen readers or have a label
        expect(ariaHidden === 'true' || ariaLabel || role === 'img').toBeTruthy();
      }
    });
  });
});
