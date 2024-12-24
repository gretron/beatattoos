import { fireEvent, render, screen, act } from "@testing-library/react";
import {
  it,
  vi,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import * as clienteleActions from "~/app/(protected)/clientele/new/actions";
import * as locationActions from "~/app/actions";
import { User } from "@prisma/client";
import { createUser } from "~/utils/user-utilities";
import { auth } from "~/lib/__mocks__/auth";
import { db } from "~/lib/__mocks__/db";
import {
  CREATE_CLIENT_FAILED_ERROR,
  CREATE_CLIENT_SUCCESS,
} from "~/app/(protected)/clientele/new/_constants/actionResponses";
import {
  AUTHENTICATION_ERROR,
  EMAIL_IN_USE_ERROR,
  EMAIL_IN_USE_FAILED_ERROR,
  INVALID_CITY_ERROR,
  INVALID_STATE_PROVINCE_ERROR,
  MISSING_COUNTRY_ERROR,
  REQUIRED_CITY_ERROR,
} from "~/app/_constants/actionResponses";
import NewClientForm from "~/app/(protected)/clientele/new/_components/NewClientForm";
import { userSchema } from "~/app/_constants/schemas";
import {
  MOCK_COUNTRIES,
  SELECTED_MOCK_CITY,
  SELECTED_MOCK_COUNTRY,
  SELECTED_MOCK_STATE_PROVINCE,
  expectAsyncSpyError,
  expectAsyncSpyToResolveWith,
  expectErrorMessage,
  getSchemaErrorMessage,
  mockLocations,
  waitForAsyncSpyToResolve,
} from "~/utils/integration-test-utilities";

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

/**
 * To fill client form with credentials and submit
 * @param user user credentials to fill form with
 * @param excludeCountry to exclude filling country field
 * @param excludeStateProvince to exclude filling state/province field
 * @param excludeCity to exclude filling city field
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
    fireEvent.change(countryInput, {
      target: { value: SELECTED_MOCK_COUNTRY.id },
    });
  }

  if (!excludeStateProvince) {
    await act(async () => {
      // Instantly resolve debounce timer
      await vi.runOnlyPendingTimersAsync();
      // Wait for get states/provinces call to complete
      await waitForAsyncSpyToResolve(getStateProvincesSpy);
    });
    const stateProvinceInput = screen.getByLabelText(/State\/province/i);
    fireEvent.change(stateProvinceInput, {
      target: { value: SELECTED_MOCK_STATE_PROVINCE.id },
    });
  }

  if (!excludeCity) {
    await act(async () => {
      // Instantly resolve debounce timer
      await vi.runOnlyPendingTimersAsync();
      // Wait for get cities call to complete
      await waitForAsyncSpyToResolve(getCitiesSpy);
    });
    const cityInput = screen.getByLabelText(/City/i);
    fireEvent.change(cityInput, {
      target: { value: SELECTED_MOCK_CITY.id },
    });
  }

  fireEvent.submit(registerForm);
};

describe("ClientForm", async () => {
  beforeAll(() => {
    vi.useFakeTimers();
    mockLocations();
  });

  beforeEach(() => {
    render(<NewClientForm countries={MOCK_COUNTRIES} />);
  });

  afterAll(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("given authenticated admin user", async () => {
    beforeEach(() => {
      auth.mockResolvedValueOnce({ user: createUser({ role: "ADMIN" }) });
    });

    it("should succeed with valid client credentials", async () => {
      const createUserReturn = createUser();

      // Mock error when database creates user
      db.user.create.mockResolvedValueOnce(createUserReturn);

      await fillClientFormAndSubmit(createUser());

      await expectAsyncSpyToResolveWith(createClientSpy, {
        alert: CREATE_CLIENT_SUCCESS,
        data: createUserReturn,
      });
    });

    it("should fail when create user db call fails", async () => {
      db.user.create.mockRejectedValueOnce(new Error());

      await fillClientFormAndSubmit(createUser());

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(CREATE_CLIENT_FAILED_ERROR);
    });

    it("should fail with missing first name", async () => {
      const user = createUser();
      user.firstName = "";

      await fillClientFormAndSubmit(user);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(getSchemaErrorMessage(userSchema, user));
    });

    it("should fail with missing last name", async () => {
      const user = createUser();
      user.lastName = "";

      await fillClientFormAndSubmit(user);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(getSchemaErrorMessage(userSchema, user));
    });

    it("should fail with missing country", async () => {
      const user = createUser();
      user.countryId = "";

      await fillClientFormAndSubmit(user, true, true, true);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(getSchemaErrorMessage(userSchema, user));
    });

    it("should fail with invalid country", async () => {
      const user = createUser();

      // Mock when database checks if entered country exists in database
      db.country.findUnique.mockResolvedValueOnce(undefined);

      await fillClientFormAndSubmit(user);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(MISSING_COUNTRY_ERROR);
    });

    it("should fail with missing state/province", async () => {
      const user = createUser();
      user.stateProvinceId = "";

      await fillClientFormAndSubmit(user, false, true, true);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(getSchemaErrorMessage(userSchema, user));
    });

    it("should fail with invalid state/province", async () => {
      const user = createUser();

      // Mock when database checks if entered state/province exists in database
      db.country.findUnique.mockResolvedValueOnce({
        ...SELECTED_MOCK_COUNTRY,
        stateProvinces: [],
      });

      await fillClientFormAndSubmit(user, false, false, true);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(INVALID_STATE_PROVINCE_ERROR);
    });

    it("should fail with missing city", async () => {
      const user = createUser();

      // Mock when database checks if missing city exists in database
      db.country.findUnique.mockResolvedValueOnce({
        ...SELECTED_MOCK_COUNTRY,
        stateProvinces: [
          {
            ...SELECTED_MOCK_STATE_PROVINCE,
          },
        ],
      });

      await fillClientFormAndSubmit(user, false, false, true);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(REQUIRED_CITY_ERROR);
    });

    it("should fail with invalid city", async () => {
      const user = createUser();

      // Mock when database checks if entered city exists in database
      db.country.findUnique.mockResolvedValueOnce({
        ...SELECTED_MOCK_COUNTRY,
        stateProvinces: [{ ...SELECTED_MOCK_STATE_PROVINCE, cities: [] }],
      });

      await fillClientFormAndSubmit(user);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(INVALID_CITY_ERROR);
    });

    it("should fail with invalid email address", async () => {
      const user = createUser();
      user.emailAddress = "fail@err.c";

      await fillClientFormAndSubmit(user);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(getSchemaErrorMessage(userSchema, user));
    });

    it("should fail with invalid password", async () => {
      const user = createUser();
      user.password = "pass";

      await fillClientFormAndSubmit(user);

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(getSchemaErrorMessage(userSchema, user));
    });

    it("should fail when email is in use", async () => {
      // Mock when database checks if user associated to email exists
      db.user.findUnique.mockResolvedValueOnce(createUser());

      await fillClientFormAndSubmit(createUser());

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(EMAIL_IN_USE_ERROR);
    });

    it("should fail when email in use db call fails", async () => {
      db.user.findUnique.mockRejectedValueOnce(new Error());

      await fillClientFormAndSubmit(createUser());

      await expectAsyncSpyError(createClientSpy);
      await expectErrorMessage(EMAIL_IN_USE_FAILED_ERROR);
    });
  });

  it("should fail when session is empty", async () => {
    await fillClientFormAndSubmit(createUser());

    await expectAsyncSpyError(createClientSpy);
    await expectErrorMessage(AUTHENTICATION_ERROR);
  });

  it("should fail when current user is unauthorized", async () => {
    auth.mockResolvedValueOnce({ user: createUser({ role: "CLIENT" }) });

    await fillClientFormAndSubmit(createUser());

    await expectAsyncSpyError(createClientSpy);
    await expectErrorMessage(AUTHENTICATION_ERROR);
  });
});
