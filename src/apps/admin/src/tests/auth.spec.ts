import { test, expect } from "@playwright/test";
import { db } from "~/lib/db";
import { createUser } from "~/utils/userUtilities";
import bcrypt from "bcryptjs";

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

  await page.getByLabel(/Admin token/).fill(process.env.ADMIN_TOKEN ?? "");
  await page.getByRole("button", { name: "Validate" }).click();

  await expect(page).toHaveURL(/auth\/register/);

  const user = createUser();

  await page.getByLabel(/First name/).fill(user.firstName);
  await page.getByLabel(/Last name/).fill(user.lastName);
  await page.getByLabel(/Email address/).fill(user.emailAddress);
  await page.getByLabel(/^Password/).fill(user.password);
  await page.getByLabel(/Confirm password/).fill(user.password);
  await page.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL(/auth\/login/);
});

test("As a tattoo artist (admin), I want to log in with my email address and password so that I can access the administrator website", async ({
  page,
}) => {
  const user = createUser();
  const hashedPassword = await bcrypt.hash(user.password, 10);

  await db.user.create({
    data: {
      role: "ADMIN",
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      password: hashedPassword,
    },
  });

  await page.getByRole("button", { name: "Log In" }).click();

  await expect(page).toHaveURL(/auth\/login/);

  await page.getByLabel(/Email address/).fill(user.emailAddress);
  await page.getByLabel(/^Password/).fill(user.password);
  await page
    .getByLabel("Log in form")
    .getByRole("button", { name: "Log In" })
    .click();

  await expect(page).toHaveURL(/dashboard/);
});
