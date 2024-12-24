import { expect, test as setup } from "@playwright/test";
import { createUser } from "~/utils/user-utilities";
import { db } from "~/lib/db";
import { STORAGE_STATE } from "../../playwright.config";

const user = createUser({ role: "ADMIN" });

setup(
  "As a tattoo artist (admin), I want to register with my email address and password during the initial setup so that I can create an account with access to the admin website",
  async ({ page }) => {
    // Delete any existing admin user
    await db.user.deleteMany({
      where: { role: { equals: "ADMIN" } },
    });

    const country = await db.country.findFirst({
      include: {
        stateProvinces: {
          include: {
            cities: true,
          },
        },
      },
    });

    if (!country) {
      throw new Error("ERROR: No available country in database");
    }

    const stateProvince = country.stateProvinces[0];

    if (!stateProvince) {
      throw new Error(
        "ERROR: No available state/province for given country in database",
      );
    }

    const city = stateProvince.cities[0];

    await page.goto("/auth/token");
    await page.getByLabel(/Admin token/).fill(process.env.ADMIN_TOKEN ?? "");
    await page.getByRole("button", { name: "Validate" }).click();
    await expect(page).toHaveURL(/auth\/register/);
    await page.getByLabel(/First name/).fill(user.firstName);
    await page.getByLabel(/Last name/).fill(user.lastName);

    await page.getByLabel(/Country/).selectOption(country.id);
    await page.getByLabel(/State\/province/).selectOption(stateProvince.id);

    // If city exists under given state/province
    if (city) {
      await page.getByLabel(/City/).selectOption(city.id);
    }

    await page.getByLabel(/Email address/).fill(user.emailAddress);
    await page.getByLabel(/^Password/).fill(user.password);
    await page.getByLabel(/Confirm password/).fill(user.password);
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page).toHaveURL(/auth\/login/);
  },
);

setup(
  "As a tattoo artist (admin), I want to log in with my email address and password so that I can access the administrator website",
  async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel(/Email address/).fill(user.emailAddress);
    await page.getByLabel(/^Password/).fill(user.password);
    await page
      .getByLabel("Log in form")
      .getByRole("button", { name: "Log In" })
      .click();
    await expect(page).toHaveURL(/dashboard/);
    await page.context().storageState({ path: STORAGE_STATE });
  },
);
