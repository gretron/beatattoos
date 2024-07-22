import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi, describe, beforeEach } from "vitest";
import * as actions from "~/app/auth/login/actions";
import LoginForm from "~/app/auth/login/_components/LoginForm";
import { User } from "@prisma/client";
import { act } from "react";
import { createUser } from "~/utils/user-utilities";
import { signIn } from "~/lib/auth";
import { CallbackRouteError } from "@auth/core/errors";
import { CredentialsSignin } from "next-auth";
import {
  CREDENTIALS_ERROR,
  OPERATIONS_ERROR,
} from "~/app/auth/login/_constants/actionResponses";

vi.mock("~/lib/auth");

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

  await act(async () => {
    fireEvent.change(emailAddressInput, {
      target: { value: user.emailAddress },
    });
    fireEvent.change(passwordInput, { target: { value: user.password } });
    fireEvent.submit(loginForm);
  });
};

describe("LoginForm", async () => {
  beforeEach(() => {
    render(<LoginForm />);
  });

  it("should succeed with valid credentials", async () => {
    vi.mocked(signIn).mockRejectedValue(new Error());

    await fillLoginFormAndSubmit(createUser());

    expect(loginSpy).toHaveBeenCalled();
    const value = await loginSpy.mock.results[0]?.value;
    expect(value).toBeInstanceOf(Error);
  });

  it("should fail with invalid credentials", async () => {
    const error = new CallbackRouteError({
      cause: { err: new CredentialsSignin() },
    });
    vi.mocked(signIn).mockRejectedValue(error);

    await fillLoginFormAndSubmit(createUser());

    expect(loginSpy).toHaveBeenCalled();
    await loginSpy.mock.results[0]?.value;
    expect(loginSpy).toHaveReturnedWith(CREDENTIALS_ERROR);

    await waitFor(() =>
      expect(screen.getByText(CREDENTIALS_ERROR.message ?? "")).toBeDefined(),
    );
  });

  it("should fail when operational error occurs", async () => {
    const error = new CallbackRouteError({
      cause: { err: new Error() },
    });
    vi.mocked(signIn).mockRejectedValue(error);

    await fillLoginFormAndSubmit(createUser());

    expect(loginSpy).toHaveBeenCalled();
    await loginSpy.mock.results[0]?.value;
    expect(loginSpy).toHaveReturnedWith(OPERATIONS_ERROR);

    await waitFor(() =>
      expect(screen.getByText(OPERATIONS_ERROR.message ?? "")).toBeDefined(),
    );
  });
});
