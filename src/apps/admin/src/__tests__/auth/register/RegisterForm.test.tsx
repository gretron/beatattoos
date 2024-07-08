import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi, describe, beforeEach } from "vitest";
import RegisterForm from "~/app/auth/register/_components/RegisterForm";
import { createUser } from "~/utils/userUtilities";
import * as actions from "~/app/auth/register/actions";
import { act } from "react";
import { User } from "@prisma/client";
import { db } from "~/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EXISTING_ACCOUNT_ERROR } from "~/app/auth/register/_constants/actionResponses";
import {
  INCORRECT_TOKEN_REDIRECT,
  SUCCESS_REDIRECT,
} from "~/app/auth/register/_constants/redirectUrls";
import {
  CREDENTIALS_PARSING_ERROR,
  EMAIL_IN_USE_ERROR,
} from "~/app/_constants/actionResponses";

vi.mock("~/lib/db");
vi.mock("next/headers");
vi.mock("next/navigation");

// Register server action spy
const registerSpy = vi.spyOn(actions, "register");

// Default get cookie return value
vi.mocked(cookies().get).mockReturnValue({
  name: "adminToken",
  value: process.env.ADMIN_TOKEN ?? "",
});

/**
 * To fill register form with credentials and submit
 * @param user User credentials to fill form with
 * @param confirmPassword Confirm password in case it differs from user password
 */
const fillRegisterFormAndSubmit = async (
  user: User,
  confirmPassword?: string,
) => {
  const registerForm = screen.getByRole("form");
  const firstNameInput = screen.getByLabelText(/First name/i);
  const lastNameInput = screen.getByLabelText(/Last name/);
  const emailAddressInput = screen.getByLabelText(/Email address/i);
  const passwordInput = screen.getByLabelText(/^Password/i);
  const confirmPasswordInput = screen.getByLabelText(/Confirm password/i);

  await act(async () => {
    fireEvent.change(firstNameInput, { target: { value: user.firstName } });
    fireEvent.change(lastNameInput, { target: { value: user.lastName } });
    fireEvent.change(emailAddressInput, {
      target: { value: user.emailAddress },
    });
    fireEvent.change(passwordInput, { target: { value: user.password } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: confirmPassword ?? user.password },
    });
    fireEvent.submit(registerForm);
  });
};

/**
 * Reusable credentials error assertion
 */
const expectCredentialsError = async () => {
  // Wait for register server action to complete
  await registerSpy.mock.results[0]?.value;

  expect(registerSpy).toHaveBeenCalled();
  expect(registerSpy).toHaveReturnedWith(CREDENTIALS_PARSING_ERROR);

  await waitFor(() =>
    expect(
      screen.getByText(CREDENTIALS_PARSING_ERROR.message ?? ""),
    ).toBeDefined(),
  );
};

describe("RegisterForm", async () => {
  beforeEach(() => {
    render(<RegisterForm />);
  });

  it("should succeed with valid admin token and credentials", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValue(null);

    await fillRegisterFormAndSubmit(createUser());

    await act(async () => {
      // Wait for register server action to complete
      await registerSpy.mock.results[0]?.value;
    });

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveReturnedWith(undefined);
    expect(redirect).toHaveBeenCalledWith(SUCCESS_REDIRECT);
  });

  it("should fail with invalid first name", async () => {
    const user = createUser();
    user.firstName = "";
    await fillRegisterFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid last name", async () => {
    const user = createUser();
    user.lastName = "";
    await fillRegisterFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid email address", async () => {
    const user = createUser();
    user.emailAddress = "fail@err.c";
    await fillRegisterFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid password", async () => {
    const user = createUser();
    user.password = "pass";
    await fillRegisterFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid confirm password", async () => {
    const user = createUser();
    await fillRegisterFormAndSubmit(user, "pass");
    await expectCredentialsError();
  });

  it("should fail with invalid admin token", async () => {
    vi.mocked(cookies().get).mockReturnValueOnce({
      name: "adminToken",
      value: "",
    });

    await fillRegisterFormAndSubmit(createUser());

    // Wait for register server action to complete
    await registerSpy.mock.results[0]?.value;

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveReturnedWith(undefined);
    expect(redirect).toHaveBeenCalledWith(INCORRECT_TOKEN_REDIRECT);
  });

  it("should fail when admin user exists", async () => {
    vi.mocked(db.user.findFirst).mockResolvedValueOnce(createUser());

    await fillRegisterFormAndSubmit(createUser());

    // Wait for register server action to complete
    await registerSpy.mock.results[0]?.value;

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveReturnedWith(EXISTING_ACCOUNT_ERROR);

    await waitFor(() =>
      expect(
        screen.getByText(EXISTING_ACCOUNT_ERROR.message ?? ""),
      ).toBeDefined(),
    );
  });

  it("should fail when email is in use", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(createUser());

    await fillRegisterFormAndSubmit(createUser());

    // Wait for register server action to complete
    await registerSpy.mock.results[0]?.value;

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveReturnedWith(EMAIL_IN_USE_ERROR);

    await waitFor(() =>
      expect(screen.getByText(EMAIL_IN_USE_ERROR.message ?? "")).toBeDefined(),
    );
  });
});
