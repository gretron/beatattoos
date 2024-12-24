import { expect, test } from "@playwright/test";
import { createUser } from "~/utils/user-utilities";
import { db } from "~/lib/db";
import { findRandomDatabaseLocations } from "~/utils/e2e-test-utilities";
import LocationsInclude from "~/app/(protected)/clientele/_constants/locations-include";
import { sortAlternatenames } from "~/app/_utils/alternatename-utilities";

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

  const locations = await findRandomDatabaseLocations();

  await page.getByLabel(/First name/).fill(user.firstName);
  await page.getByLabel(/Last name/).fill(user.lastName);

  await page.getByLabel(/Country/).selectOption(locations.country.id);
  await page
    .getByLabel(/State\/province/)
    .selectOption(locations.stateProvince.id);

  // If city exists under given state/province
  if (locations.city) {
    await page.getByLabel(/City/).selectOption(locations.city.id);
  }

  await page.getByLabel(/Email address/).fill(user.emailAddress);
  await page.getByRole("button", { name: "Randomize" }).click();
  await page.getByRole("button", { name: "Add Client" }).click();

  await expect(page).toHaveURL(/clientele\/(?!new$|edit$)[a-zA-Z0-9]+/);
});

test("As a tattoo artist (admin), I want to view client accounts so that I can be aware of client information", async ({
  page,
}) => {
  const locations = await findRandomDatabaseLocations();
  const client = createUser();

  let dbClient;
  try {
    dbClient = await db.user.create({
      data: {
        role: "CLIENT",
        firstName: client.firstName,
        lastName: client.lastName,
        countryId: locations.country.id,
        stateProvinceId: locations.stateProvince.id,
        cityId: locations.city?.id,
        emailAddress: client.emailAddress,
        password: client.password,
      },
      include: LocationsInclude,
    });
  } catch (e) {
    throw new Error(
      "[ERROR]: An error occurred while creating user in database",
      { cause: e },
    );
  }

  await page.goto(`/clientele/${dbClient.id}`);

  await expect(page.getByText(dbClient.id)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: dbClient.firstName }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: dbClient.lastName }),
  ).toBeVisible();
  await expect(
    page.locator("span").filter({ hasText: dbClient.emailAddress }),
  ).toBeVisible();

  const countryDisplayName =
    dbClient.country.alternatenames.sort(sortAlternatenames)[0]?.name ??
    dbClient.country.name;
  await expect(
    page.getByText(countryDisplayName, { exact: true }),
  ).toBeVisible();

  const stateProvinceDisplayName =
    dbClient.stateProvince.alternatenames.sort(sortAlternatenames)[0]?.name ??
    dbClient.stateProvince.name;
  await expect(
    page.getByText(stateProvinceDisplayName, { exact: true }),
  ).toBeVisible();

  if (dbClient.city) {
    const cityDisplayName =
      dbClient.city.alternatenames.sort(sortAlternatenames)[0]?.name ??
      dbClient.city.name;
    await expect(
      page.getByText(cityDisplayName, { exact: true }),
    ).toBeVisible();
  }
});
