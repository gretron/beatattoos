import { test, expect } from "@playwright/test";
import { db } from "~/lib/db";
import { createUser } from "~/utils/userUtilities";

test.beforeEach(async ({ page }) => {
  page.on("console", async (msg) => {
    const values = [];
    for (const arg of msg.args()) values.push(await arg.jsonValue());
    console.log(...values);
  });

  await db.user.deleteMany({
    where: { role: { equals: "ADMIN" } },
  });

  await page.goto("/auth");
});

test("As a tattoo artist (admin), I want to register with my email address and password during the initial setup so that I can create an account with access to the admin website", async ({
  page,
}) => {
  await page.getByRole("button", { name: "First Time Setup" }).click();

  await expect(page).toHaveURL(/auth\/token/);

  await page.getByRole("textbox").fill(process.env.ADMIN_TOKEN ?? "");
  await page.getByRole("button", { name: "Validate" }).click();

  await expect(page).toHaveURL(/auth\/register/);

  const user = createUser();

  await page.getByRole("textbox", { name: "firstName" }).fill(user.firstName);
  await page.getByRole("textbox", { name: "lastName" }).fill(user.lastName);
  await page
    .getByRole("textbox", { name: "emailAddress" })
    .fill(user.emailAddress);
  await page
    .getByRole("textbox", { name: "password", exact: true })
    .fill(user.password);
  await page
    .getByRole("textbox", { name: "confirmPassword" })
    .fill(user.password);
  await page.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL(/auth\/login/);
});
