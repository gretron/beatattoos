import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi, describe, beforeEach, afterEach } from "vitest";
import * as actions from "~/app/auth/login/actions";
import LoginForm from "~/app/auth/login/_components/LoginForm";
import { User } from "@prisma/client";
import { createUser } from "~/utils/user-utilities";
import { signIn } from "~/lib/auth";
import { CallbackRouteError } from "@auth/core/errors";
import { CredentialsSignin } from "next-auth";
import {
  CREDENTIALS_ERROR,
  OPERATIONS_ERROR,
} from "~/app/auth/login/_constants/actionResponses";
import {
  expectAsyncSpyError,
  expectAsyncSpyToResolveWith,
  expectErrorMessage,
} from "~/utils/integration-test-utilities";
import { redirect } from "next/navigation";
import { SUCCESS_REDIRECT } from "~/app/auth/login/_constants/redirectUrls";

// Mock modules
vi.mock("~/lib/db");
vi.mock("~/lib/auth");
vi.mock("next/navigation");

// Login server action spy
const loginSpy = vi.spyOn(actions, "login");

/**
 * To fill login form with credentials and submit
 * @param user User credentials to fill form with
 */
const fillLoginFormAndSubmit = async (user: User) => {
  const loginForm = screen.getByRole("form");
  const emailAddressInput = screen.getByLabelText(/Email address/i);
  const passwordInput = screen.getByLabelText(/^Password/i);

  fireEvent.change(emailAddressInput, {
    target: { value: user.emailAddress },
  });
  fireEvent.change(passwordInput, { target: { value: user.password } });
  fireEvent.submit(loginForm);
};

describe("LoginForm", async () => {
  beforeEach(() => {
    render(<LoginForm />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should succeed with valid credentials", async () => {
    await fillLoginFormAndSubmit(createUser());

    await expectAsyncSpyToResolveWith(loginSpy, undefined);
    expect(redirect).toHaveBeenCalledWith(SUCCESS_REDIRECT);
  });

  it("should fail with invalid credentials", async () => {
    const error = new CallbackRouteError({
      cause: { err: new CredentialsSignin() },
    });
    vi.mocked(signIn).mockRejectedValue(error);

    await fillLoginFormAndSubmit(createUser());

    await expectAsyncSpyError(loginSpy);
    await expectErrorMessage(CREDENTIALS_ERROR);
  });

  it("should fail when operational error occurs", async () => {
    const error = new CallbackRouteError({
      cause: { err: new Error() },
    });
    vi.mocked(signIn).mockRejectedValue(error);

    await fillLoginFormAndSubmit(createUser());

    await expectAsyncSpyError(loginSpy);
    await expectErrorMessage(OPERATIONS_ERROR);
  });
});
