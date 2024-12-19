import { fireEvent, render, screen, act } from "@testing-library/react";
import { expect, it, vi, describe, beforeEach, afterEach } from "vitest";
import * as clienteleActions from "~/app/(protected)/clientele/new/actions";
import * as locationActions from "~/app/actions";
import { User } from "@prisma/client";
import { createUser } from "~/utils/user-utilities";
import { auth } from "~/lib/__mocks__/auth";
import { db } from "~/lib/__mocks__/db";
import { CREATE_CLIENT_SUCCESS } from "~/app/(protected)/clientele/new/_constants/actionResponses";
import {
  AUTHENTICATION_ERROR,
  EMAIL_IN_USE_ERROR,
  INVALID_CITY_ERROR,
  INVALID_STATE_PROVINCE_ERROR,
  MISSING_COUNTRY_ERROR,
  REQUIRED_CITY_ERROR,
} from "~/app/_constants/actionResponses";
import {
  createCity,
  createCountry,
  createStateProvince,
} from "~/utils/location-utilities";
import { faker } from "@faker-js/faker";
import {
  City,
  CityAlternatename,
  StateProvince,
  StateProvinceAlternatename,
} from "@beatattoos/db";
import NewClientForm from "~/app/(protected)/clientele/new/_components/NewClientForm";
import { userSchema } from "~/app/_constants/schemas";

// Mock modules
vi.mock("~/lib/db");
vi.mock("~/lib/auth");
vi.mock("next/navigation");

// Create action spies
const createClientSpy = vi.spyOn(clienteleActions, "createClient");
const getStateProvincesSpy = vi.spyOn(
  locationActions,
  "getStatesProvincesUsingCountryId",
);
const getCitiesSpy = vi.spyOn(locationActions, "getCitiesUsingStateProvinceId");

// Create randomized locations (country, state/province, city)
const countries = Array.from(
  { length: faker.number.int({ min: 3, max: 5 }) },
  () => createCountry(),
);
const stateProvinces = countries.reduce(
  (
    acc: {
      [key: string]: (StateProvince & {
        alternatenames: StateProvinceAlternatename[];
        _count: { cities: number };
      })[];
    },
    country,
  ) => {
    acc[country.id] = Array.from(
      { length: faker.number.int({ min: 3, max: 5 }) },
      () => createStateProvince(country),
    );

    return acc;
  },
  {},
);
const cities = Object.values(stateProvinces).reduce(
  (
    acc: {
      [key: string]: (City & {
        alternatenames: CityAlternatename[];
      })[];
    },
    stateProvinces,
  ) => {
    stateProvinces.map((stateProvince) => {
      acc[stateProvince.id] = Array.from(
        { length: stateProvince._count.cities },
        () => createCity(stateProvince),
      );
    });

    return acc;
  },
  {},
);

// Select locations from randomized locations
const selectedCountry = faker.helpers.arrayElement(countries);
const selectedStateProvince = faker.helpers.arrayElement(
  stateProvinces[selectedCountry.id] ?? [],
);
const selectedCity = faker.helpers.arrayElement(
  cities[selectedStateProvince.id] ?? [],
);

/**
 * To get error message from user schema given a user
 * @param user user to generate error message from
 */
const getUserSchemaErrorMessage = (user: User) => {
  return JSON.parse(userSchema.safeParse(user)?.error?.message ?? "")[0]
    .message;
};

/**
 * To fill client form with credentials and submit
 * @param user user credentials to fill form with
 * @param excludeCountry to exclude filling country field
 * @param excludeStateProvince to exclude filling state/province field
 * @param excludeCity to exclude filling city
 */
const fillClientFormAndSubmit = async (
  user: User,
  excludeCountry?: boolean,
  excludeStateProvince?: boolean,
  excludeCity?: boolean,
) => {
  const registerForm = screen.getByRole("form");
  const firstNameInput = screen.getByLabelText(/First name/i);
  const lastNameInput = screen.getByLabelText(/Last name/);
  const countryInput = screen.getByLabelText(/Country/);
  const emailAddressInput = screen.getByLabelText(/Email address/i);
  const passwordInput = screen.getByLabelText(/^Password/i);

  fireEvent.change(firstNameInput, { target: { value: user.firstName } });
  fireEvent.change(lastNameInput, { target: { value: user.lastName } });
  fireEvent.change(emailAddressInput, {
    target: { value: user.emailAddress },
  });
  fireEvent.change(passwordInput, {
    target: { value: user.password },
  });

  if (!excludeCountry) {
    fireEvent.change(countryInput, { target: { value: selectedCountry.id } });
  }

  if (!excludeStateProvince) {
    await act(async () => {
      // Instantly resolve debounce timer
      await vi.runOnlyPendingTimersAsync();
      // Await get states/provinces call
      await getStateProvincesSpy.mock.results[0]?.value;
    });
    const stateProvinceInput = screen.getByLabelText(/State\/province/i);
    fireEvent.change(stateProvinceInput, {
      target: { value: selectedStateProvince.id },
    });
  }

  if (!excludeCity) {
    await act(async () => {
      // Instantly resolve debounce timer
      await vi.runOnlyPendingTimersAsync();
      // Await get cities call
      await getCitiesSpy.mock.results[0]?.value;
    });
    const cityInput = screen.getByLabelText(/City/i);
    fireEvent.change(cityInput, {
      target: { value: selectedCity.id },
    });
  }

  fireEvent.submit(registerForm);
};

/**
 * To mock authentication given a user
 * @param user user to mock authentication with
 */
const mockAuthentication = (user: User) => {
  auth.mockResolvedValueOnce({ user: user });
  db.user.findUnique.mockResolvedValueOnce(user);
};

/**
 * To mock location calls for valid locations
 * @param excludeDatabaseCall to exclude mock database call
 */
const mockLocations = (excludeDatabaseCall?: boolean) => {
  db.stateProvince.findMany.mockImplementationOnce(
    (args: { where: { countryId: string } }) =>
      Promise.resolve(stateProvinces[args.where.countryId]),
  );
  db.city.findMany.mockImplementationOnce(
    (args: { where: { stateProvinceId: string } }) =>
      Promise.resolve(cities[args.where.stateProvinceId]),
  );

  if (!excludeDatabaseCall) {
    db.country.findUnique.mockResolvedValueOnce({
      ...selectedCountry,
      stateProvinces: stateProvinces[selectedCountry.id]?.map(
        (stateProvince) => {
          return { ...stateProvince, cities: cities[stateProvince.id] };
        },
      ),
    });
  }
};

/**
 * Reusable credentials error assertion
 * @param errorMessage error message to look for
 */
const expectError = async (errorMessage: string) => {
  expect(createClientSpy).toHaveBeenCalled();

  await act(async () => {
    expect(createClientSpy.mock.results[0]?.value).rejects.toThrowError();
  });

  expect(screen.getByText(errorMessage)).toBeDefined();
};

describe("ClientForm", async () => {
  beforeEach(() => {
    vi.useFakeTimers();
    render(<NewClientForm countries={countries} />);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should succeed with valid client credentials", async () => {
    const createUserReturn = createUser();
    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations();
    db.user.create.mockResolvedValueOnce(createUserReturn);

    await fillClientFormAndSubmit(createUser());

    await act(async () => {
      await createClientSpy.mock.results[0]?.value;
    });

    expect(createClientSpy).toHaveBeenCalled();
    expect(createClientSpy).toHaveReturnedWith({
      alert: CREATE_CLIENT_SUCCESS,
      data: createUserReturn,
    });
  });

  it("should fail with invalid first name", async () => {
    const user = createUser();
    user.firstName = "";

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations(true);

    await fillClientFormAndSubmit(user);
    await expectError(getUserSchemaErrorMessage(user));
  });

  it("should fail with invalid last name", async () => {
    const user = createUser();
    user.lastName = "";

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations(true);

    await fillClientFormAndSubmit(user);
    await expectError(getUserSchemaErrorMessage(user));
  });

  it("should fail with missing country", async () => {
    const user = createUser();
    user.countryId = "";

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations(true);

    await fillClientFormAndSubmit(user, true, true, true);
    await expectError(getUserSchemaErrorMessage(user));
  });

  it("should fail with invalid country", async () => {
    const user = createUser();

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations(true);

    await fillClientFormAndSubmit(user);
    await expectError(MISSING_COUNTRY_ERROR);
  });

  it("should fail with missing state/province", async () => {
    const user = createUser();
    user.stateProvinceId = "";

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations(true);

    await fillClientFormAndSubmit(user, false, true, true);
    await expectError(getUserSchemaErrorMessage(user));
  });

  it("should fail with invalid state/province", async () => {
    const user = createUser();

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations(true);
    db.country.findUnique.mockResolvedValueOnce({
      ...selectedCountry,
      stateProvinces: [],
    });

    await fillClientFormAndSubmit(user, false, false, true);
    await expectError(INVALID_STATE_PROVINCE_ERROR);
  });

  it("should fail with missing city", async () => {
    const user = createUser();

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations(true);
    db.country.findUnique.mockResolvedValueOnce({
      ...selectedCountry,
      stateProvinces: [
        {
          ...selectedStateProvince,
        },
      ],
    });

    await fillClientFormAndSubmit(user, false, false, true);
    await expectError(REQUIRED_CITY_ERROR);
  });

  it("should fail with invalid city", async () => {
    const user = createUser();

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations(true);
    db.country.findUnique.mockResolvedValueOnce({
      ...selectedCountry,
      stateProvinces: [{ ...selectedStateProvince, cities: [] }],
    });

    await fillClientFormAndSubmit(user, false, false, false);
    await expectError(INVALID_CITY_ERROR);
  });

  it("should fail with invalid email address", async () => {
    const user = createUser();
    user.emailAddress = "fail@err.c";

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations();

    await fillClientFormAndSubmit(user);
    await expectError(getUserSchemaErrorMessage(user));
  });

  it("should fail with invalid password", async () => {
    const user = createUser();
    user.password = "pass";

    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations();

    await fillClientFormAndSubmit(user);
    await expectError(getUserSchemaErrorMessage(user));
  });

  it("should fail when session is empty", async () => {
    mockLocations();
    auth.mockResolvedValueOnce(null);

    await fillClientFormAndSubmit(createUser());
    await expectError(AUTHENTICATION_ERROR);
  });

  it("should fail when current user is unauthorized", async () => {
    mockAuthentication(createUser({ role: "CLIENT" }));
    mockLocations();

    await fillClientFormAndSubmit(createUser());
    await expectError(AUTHENTICATION_ERROR);
  });

  it("should fail when email is in use", async () => {
    mockAuthentication(createUser({ role: "ADMIN" }));
    mockLocations();
    db.user.findUnique.mockResolvedValueOnce(createUser());

    await fillClientFormAndSubmit(createUser());
    await expectError(EMAIL_IN_USE_ERROR);
  });
});
