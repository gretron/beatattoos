import { test, expect } from "@playwright/test";

test("registration process", async ({ page }) => {
  await page.goto("http://localhost:3000/auth");

  await expect(page).toHaveTitle(/beatattoos/);
});
