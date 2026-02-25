import { test, expect } from "@playwright/test";

test.describe("Blog Post Expansion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("clicking a blog tile expands the post overlay", async ({ page }) => {
    const firstTile = page.locator(".tile--clickable").first();
    await firstTile.click();

    // Wait for overlay to appear
    await expect(page.locator(".post-overlay")).toBeVisible();
    await expect(page.locator(".post-title")).toBeVisible();
    await expect(page.locator(".post-content")).toBeVisible();
  });

  test("expanded post shows back button", async ({ page }) => {
    const firstTile = page.locator(".tile--clickable").first();
    await firstTile.click();

    const backBtn = page.locator(".post-back");
    await expect(backBtn).toBeVisible();
  });

  test("back button collapses the post", async ({ page }) => {
    const firstTile = page.locator(".tile--clickable").first();
    await firstTile.click();
    await expect(page.locator(".post-overlay")).toBeVisible();

    await page.locator(".post-back").click();
    await expect(page.locator(".post-overlay")).not.toBeVisible();
  });

  test("Escape key closes expanded post", async ({ page }) => {
    await page.locator(".tile--clickable").first().click();
    await expect(page.locator(".post-overlay")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(".post-overlay")).not.toBeVisible();
  });

  test("URL updates when post is opened", async ({ page }) => {
    await page.locator(".tile--clickable").first().click();
    await expect(page.locator(".post-overlay")).toBeVisible();
    await expect(page).toHaveURL(/\/blog\//);
  });

  test("URL returns to / when post is closed", async ({ page }) => {
    await page.locator(".tile--clickable").first().click();
    await expect(page).toHaveURL(/\/blog\//);

    await page.locator(".post-back").click();
    // Wait for URL to update
    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });

  test("Enter key opens blog tile", async ({ page }) => {
    const firstTile = page.locator(".tile--clickable").first();
    await firstTile.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(".post-overlay")).toBeVisible();
  });
});

test.describe("Direct Blog Route", () => {
  test("direct URL to blog post renders content", async ({ page }) => {
    await page.goto("/blog/hello-world");

    await expect(page.locator(".post-title")).toBeVisible();
    await expect(page.locator(".post-content")).toBeVisible();
  });

  test("has back link to homepage", async ({ page }) => {
    await page.goto("/blog/hello-world");

    const backLink = page.locator('a[href="/"]');
    await expect(backLink).toBeVisible();
  });

  test("has correct meta title", async ({ page }) => {
    await page.goto("/blog/hello-world");
    await expect(page).toHaveTitle(/Starting something new/);
  });
});
