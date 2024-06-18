import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi, describe, afterEach, beforeEach } from "vitest";
import RegisterForm from "~/app/auth/register/_components/RegisterForm";
import { createUser } from "~/utils/userFactory";
import * as actions from "~/app/auth/actions";
import { act } from "react";
import { User } from "@prisma/client";

// Setup mock database calls
const findFirstUser = vi.hoisted(() => vi.fn());
const findUniqueUser = vi.hoisted(() => vi.fn());
const createUserDB = vi.hoisted(() => vi.fn());
vi.mock("~/lib/db", async (importOriginal) => {
  return {
    db: {
      user: {
        findFirst: findFirstUser,
        findUnique: findUniqueUser,
        create: createUserDB,
      },
    },
  };
});

// Setup mock cookie retrieval
const getCookies = vi.hoisted(() => vi.fn());
vi.mock("next/headers", async (importOriginal) => {
  return {
    cookies: () => {
      return {
        get: getCookies,
      };
    },
  };
});

// Setup mock url navigation
const redirect = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", async (importOriginal) => {
  return {
    redirect,
  };
});

const registerSpy = vi.spyOn(actions, "register");

const fillRegisterFormAndSubmit = async (
  user: User,
  confirmPassword?: string,
) => {
  const registerForm = screen.getByRole("form");
  const firstNameInput = screen.getByRole("textbox", {
    name: /firstName/i,
  });
  const lastNameInput = screen.getByRole("textbox", {
    name: /lastName/i,
  });
  const emailAddressInput = screen.getByRole("textbox", {
    name: /emailAddress/i,
  });
  const passwordInput = screen.getByRole("textbox", {
    name: /^password/i,
  });
  const confirmPasswordInput = screen.getByRole("textbox", {
    name: /confirmPassword/i,
  });

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

const expectCredentialsError = async () => {
  // Wait for register server action to complete
  await registerSpy.mock.results[0]?.value;
  const credentialsError = "An error occurred while parsing the credentials";

  expect(registerSpy).toHaveBeenCalled();
  expect(registerSpy).toHaveReturnedWith({
    error: credentialsError,
  });

  await waitFor(() => expect(screen.getByText(credentialsError)).toBeDefined());
};

describe("RegisterForm", () => {
  beforeEach(() => {
    render(<RegisterForm />);
  });

  afterEach(() => {
    // Reset mock db calls
    findFirstUser.mockReset();
    findUniqueUser.mockReset();
    createUserDB.mockReset();
  });

  it("should succeed with valid admin token and credentials", async () => {
    getCookies.mockReturnValue({ value: process.env.ADMIN_TOKEN });

    await fillRegisterFormAndSubmit(createUser());

    await registerSpy.mock.results[0]?.value;

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveReturnedWith(undefined);
    expect(redirect).toHaveBeenCalledWith(
      "/auth/login?message=Administrator%20account%20was%20successfully%20created",
    );
  });

  it("should fail with invalid first name", async () => {
    getCookies.mockReturnValue({ value: process.env.ADMIN_TOKEN });

    const user = createUser();
    user.firstName = "";
    await fillRegisterFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid last name", async () => {
    getCookies.mockReturnValue({ value: process.env.ADMIN_TOKEN });

    const user = createUser();
    user.lastName = "";
    await fillRegisterFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid email address", async () => {
    getCookies.mockReturnValue({ value: process.env.ADMIN_TOKEN });

    const user = createUser();
    user.emailAddress = "fail@err.c";
    await fillRegisterFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid password", async () => {
    getCookies.mockReturnValue({ value: process.env.ADMIN_TOKEN });

    const user = createUser();
    user.password = "pass";
    await fillRegisterFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid confirm password", async () => {
    getCookies.mockReturnValue({ value: process.env.ADMIN_TOKEN });

    const user = createUser();
    await fillRegisterFormAndSubmit(user, "pass");
    await expectCredentialsError();
  });

  it("should fail with invalid admin token", async () => {
    getCookies.mockReturnValue({ value: "" });

    await fillRegisterFormAndSubmit(createUser());

    // Wait for register server action to complete
    await registerSpy.mock.results[0]?.value;

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveReturnedWith(undefined);
    expect(redirect).toHaveBeenCalledWith(
      "/auth/token?message=Entered%20token%20does%20not%20correspond%20to%20the%20admin%20token",
    );
  });

  it("should fail when admin user exists", async () => {
    getCookies.mockReturnValue({ value: process.env.ADMIN_TOKEN });
    findFirstUser.mockReturnValue(createUser());

    await fillRegisterFormAndSubmit(createUser());

    // Wait for register server action to complete
    await registerSpy.mock.results[0]?.value;
    const adminExistsError = "The administrator user already exists";

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveReturnedWith({
      error: adminExistsError,
    });

    await waitFor(() =>
      expect(screen.getByText(adminExistsError)).toBeDefined(),
    );
  });

  it("should fail when email is in use", async () => {
    getCookies.mockReturnValue({ value: process.env.ADMIN_TOKEN });
    findUniqueUser.mockReturnValue(createUser());

    await fillRegisterFormAndSubmit(createUser());

    // Wait for register server action to complete
    await registerSpy.mock.results[0]?.value;
    const emailInUseError = "Email address is already in use";

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveReturnedWith({
      error: emailInUseError,
    });

    await waitFor(() =>
      expect(screen.getByText(emailInUseError)).toBeDefined(),
    );
  });
});
