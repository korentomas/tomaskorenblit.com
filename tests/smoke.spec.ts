import { test, expect } from "@playwright/test";

const PAGES = [
  { path: "/", heading: "Tomás Korenblit" },
  { path: "/books", heading: "Books" },
  { path: "/interests", heading: "Interests" },
  { path: "/now", heading: "Now" },
  { path: "/then", heading: "Then" },
];

for (const { path, heading } of PAGES) {
  test(`${path} renders`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  });
}

test("nav links visible on home", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link", { name: "Books" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Interests" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Now" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Then" })).toBeVisible();
});
