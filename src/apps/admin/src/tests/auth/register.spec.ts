import { test, expect } from "@playwright/test";
import { db } from "~/lib/db";

test("registration process", async ({ page }) => {
  const { count } = await db.user.deleteMany({
    where: { role: { equals: "ADMIN" } },
  });

  await page.goto("/auth");

  await page.getByRole("button", { name: "First Time Setup" }).click();

  await expect(page).toHaveURL(/auth\/token/);

  await page.getByRole("textbox").fill(process.env.ADMIN_TOKEN ?? "");
  await page.getByRole("button", { name: "Validate" }).click();

  await expect(page).toHaveURL(/auth\/register/);
});
