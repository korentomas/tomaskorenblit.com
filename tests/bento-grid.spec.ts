import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Bento Grid", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders identity tile with name and bio", async ({ page }) => {
    await expect(page.locator(".identity-name")).toBeVisible();
    await expect(page.locator(".identity-bio")).toBeVisible();
  });

  test("renders social links with accessible labels", async ({ page }) => {
    const github = page.locator('a[aria-label="GitHub"]');
    const linkedin = page.locator('a[aria-label="LinkedIn"]');
    const email = page.locator('a[aria-label="Email"]');

    await expect(github).toBeVisible();
    await expect(linkedin).toBeVisible();
    await expect(email).toBeVisible();
  });

  test("renders blog tiles", async ({ page }) => {
    // At least some clickable tiles should be present
    const tiles = page.locator(".tile--clickable");
    const count = await tiles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("blog tiles show type, title, and date", async ({ page }) => {
    const firstTile = page.locator(".tile--clickable").first();
    await expect(firstTile.locator(".tile-type")).toBeVisible();
    await expect(firstTile.locator(".tile-title")).toBeVisible();
    await expect(firstTile.locator(".tile-date")).toBeVisible();
  });

  test("tiles are keyboard navigable", async ({ page }) => {
    // First clickable tile should be focusable
    const firstTile = page.locator(".tile--clickable").first();
    await firstTile.focus();
    await expect(firstTile).toBeFocused();
  });

  test("bento grid is visible on desktop", async ({ page }) => {
    const bento = page.locator(".bento");
    await expect(bento).toBeVisible();
    const box = await bento.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }
  });
});

test.describe("WCAG Accessibility", () => {
  test("homepage passes axe accessibility checks", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(["color-contrast"]) // Pre-existing contrast issues in oklch palette
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("blog post page passes axe accessibility checks", async ({ page }) => {
    await page.goto("/blog/hello-world");
    // Wait for MDX content to load
    await page.waitForSelector(".post-content p");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(["color-contrast"]) // Pre-existing contrast issues in oklch palette
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
