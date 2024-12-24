import { fireEvent, render, screen } from "@testing-library/react";
import {
  expect,
  it,
  vi,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import RegisterForm from "~/app/auth/register/_components/RegisterForm";
import { createUser } from "~/utils/user-utilities";
import * as registerActions from "~/app/auth/register/actions";
import { act } from "react";
import { User } from "@prisma/client";
import { db } from "~/lib/__mocks__/db";
import {
  CREATE_USER_FAILED_ERROR,
  EXISTING_ACCOUNT_ERROR,
  INCORRECT_TOKEN_ERROR,
} from "~/app/auth/register/_constants/actionResponses";
import { SUCCESS_REDIRECT } from "~/app/auth/register/_constants/redirectUrls";
import {
  EMAIL_IN_USE_ERROR,
  EMAIL_IN_USE_FAILED_ERROR,
  INVALID_CITY_ERROR,
  INVALID_STATE_PROVINCE_ERROR,
  MISSING_COUNTRY_ERROR,
  REQUIRED_CITY_ERROR,
} from "~/app/_constants/actionResponses";
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
import * as locationActions from "~/app/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  registerFormSchema,
  registerFormSchemaRefined,
} from "~/app/auth/register/_constants/schemas";
import { userSchema } from "~/app/_constants/schemas";

// Mock modules
vi.mock("~/lib/db");
vi.mock("~/lib/auth");
vi.mock("next/headers");
vi.mock("next/navigation");

// Create action spies
const registerSpy = vi.spyOn(registerActions, "register");
const getStateProvincesSpy = vi.spyOn(
  locationActions,
  "getStatesProvincesUsingCountryId",
);
const getCitiesSpy = vi.spyOn(locationActions, "getCitiesUsingStateProvinceId");

// Default get cookie return value
vi.mocked(cookies().get).mockReturnValue({
  name: "adminToken",
  value: process.env.ADMIN_TOKEN ?? "",
});

/**
 * To fill register form with credentials and submit
 * @param user User credentials to fill form with
 * @param confirmPassword Confirm password in case it differs from user password
 * @param excludeCountry to exclude filling country field
 * @param excludeStateProvince to exclude filling state/province field
 * @param excludeCity to exclude filling city field
 */
const fillRegisterFormAndSubmit = async (
  user: User,
  confirmPassword?: string,
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
  const confirmPasswordInput = screen.getByLabelText(/Confirm password/i);

  fireEvent.change(firstNameInput, { target: { value: user.firstName } });
  fireEvent.change(lastNameInput, { target: { value: user.lastName } });
  fireEvent.change(emailAddressInput, {
    target: { value: user.emailAddress },
  });
  fireEvent.change(passwordInput, { target: { value: user.password } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: confirmPassword ?? user.password },
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

describe("RegisterForm", async () => {
  beforeAll(() => {
    vi.useFakeTimers();
    mockLocations();
  });

  beforeEach(() => {
    render(<RegisterForm countries={MOCK_COUNTRIES} />);
  });

  afterAll(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should succeed with valid admin token and credentials", async () => {
    // Mock when database checks if admin user exists
    db.user.findUnique.mockResolvedValue(null);

    await fillRegisterFormAndSubmit(createUser());

    await expectAsyncSpyToResolveWith(registerSpy, undefined);
    expect(redirect).toHaveBeenCalledWith(SUCCESS_REDIRECT);
  });

  it("should fail when create user db call fails", async () => {
    // Mock error when database creates user
    db.user.create.mockRejectedValueOnce(new Error());

    await fillRegisterFormAndSubmit(createUser());

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(CREATE_USER_FAILED_ERROR);
  });

  it("should fail with invalid first name", async () => {
    const user = createUser();
    user.firstName = "";

    await fillRegisterFormAndSubmit(user);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(getSchemaErrorMessage(registerFormSchema, user));
  });

  it("should fail with invalid last name", async () => {
    const user = createUser();
    user.lastName = "";

    await fillRegisterFormAndSubmit(user);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(getSchemaErrorMessage(registerFormSchema, user));
  });

  it("should fail with missing country", async () => {
    const user = createUser();
    user.countryId = "";

    await fillRegisterFormAndSubmit(user, undefined, true, true, true);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(getSchemaErrorMessage(userSchema, user));
  });

  it("should fail with invalid country", async () => {
    const user = createUser();

    // Mock when database checks if entered country exists in database
    db.country.findUnique.mockResolvedValueOnce(undefined);

    await fillRegisterFormAndSubmit(user);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(MISSING_COUNTRY_ERROR);
  });

  it("should fail with missing state/province", async () => {
    const user = createUser();
    user.stateProvinceId = "";

    await fillRegisterFormAndSubmit(user, undefined, false, true, true);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(getSchemaErrorMessage(userSchema, user));
  });

  it("should fail with invalid state/province", async () => {
    const user = createUser();

    // Mock when database checks if entered state/province exists in database
    db.country.findUnique.mockResolvedValueOnce({
      ...SELECTED_MOCK_COUNTRY,
      stateProvinces: [],
    });

    await fillRegisterFormAndSubmit(user, undefined, false, false, true);

    await expectAsyncSpyError(registerSpy);
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

    await fillRegisterFormAndSubmit(user, undefined, false, false, true);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(REQUIRED_CITY_ERROR);
  });

  it("should fail with invalid city", async () => {
    const user = createUser();

    // Mock when database checks if entered city exists in database
    db.country.findUnique.mockResolvedValueOnce({
      ...SELECTED_MOCK_COUNTRY,
      stateProvinces: [{ ...SELECTED_MOCK_STATE_PROVINCE, cities: [] }],
    });

    await fillRegisterFormAndSubmit(user);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(INVALID_CITY_ERROR);
  });

  it("should fail with invalid email address", async () => {
    const user = createUser();
    user.emailAddress = "";

    await fillRegisterFormAndSubmit(user);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(getSchemaErrorMessage(registerFormSchema, user));
  });

  it("should fail with invalid password", async () => {
    const user = createUser();
    user.password = "pass";

    await fillRegisterFormAndSubmit(user);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(getSchemaErrorMessage(registerFormSchema, user));
  });

  it("should fail with invalid confirm password", async () => {
    const user = createUser();
    const confirmPassword = "pass";

    await fillRegisterFormAndSubmit(user, confirmPassword);

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(
      getSchemaErrorMessage(registerFormSchemaRefined, {
        ...user,
        confirmPassword,
      }),
    );
  });

  it("should fail with invalid admin token", async () => {
    vi.mocked(cookies().get).mockReturnValueOnce({
      name: "adminToken",
      value: "",
    });

    await fillRegisterFormAndSubmit(createUser());

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(INCORRECT_TOKEN_ERROR);
  });

  it("should fail when admin user exists", async () => {
    // Mock when database checks if user exists
    vi.mocked(db.user.findFirst).mockResolvedValueOnce(createUser());

    await fillRegisterFormAndSubmit(createUser());

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(EXISTING_ACCOUNT_ERROR);
  });

  it("should fail when email is in use", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(createUser());

    await fillRegisterFormAndSubmit(createUser());

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(EMAIL_IN_USE_ERROR);
  });

  it("should fail when email in use db call fails", async () => {
    // Mock error when database checks if user with email exists
    db.user.findUnique.mockRejectedValueOnce(new Error());

    await fillRegisterFormAndSubmit(createUser());

    await expectAsyncSpyError(registerSpy);
    await expectErrorMessage(EMAIL_IN_USE_FAILED_ERROR);
  });
});
