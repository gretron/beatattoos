import { expect, test } from "@playwright/test";
import { createUser } from "~/utils/userUtilities";
import { db } from "~/lib/db";

test.beforeAll(async () => {
  // Delete any existing client users
  await db.user.deleteMany({
    where: { role: { equals: "CLIENT" } },
  });
});

test.beforeEach(async ({ page }) => {
  // Verify authenticated state
  await page.goto("/");
  await expect(page).toHaveURL(/dashboard/);
});

test("As a tattoo artist (admin), I want to create client accounts so that I can make accounts for in-person clients", async ({
  page,
}) => {
  await page.goto("/clientele");
  await expect(page).toHaveURL(/clientele/);

  await page.getByTestId("new-client-link").click();
  await expect(page).toHaveURL(/clientele\/new/);

  const user = createUser();

  await page.getByLabel(/First name/).fill(user.firstName);
  await page.getByLabel(/Last name/).fill(user.lastName);
  await page.getByLabel(/Email address/).fill(user.emailAddress);
  await page.getByRole("button", { name: "Randomize" }).click();
  await page.getByRole("button", { name: "Add Client" }).click();

  await expect(page).toHaveURL(/clientele\/(?!new$|edit$)[a-zA-Z0-9]+/);
});
