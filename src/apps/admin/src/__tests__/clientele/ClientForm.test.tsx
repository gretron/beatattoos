import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi, describe, beforeEach } from "vitest";
import * as actions from "~/app/(protected)/clientele/new/actions";
import { act } from "react";
import { User } from "@prisma/client";
import { createUser } from "~/utils/userUtilities";
import { redirect } from "next/navigation";
import ClientForm from "~/app/(protected)/clientele/_components/ClientForm";
import { auth } from "~/lib/__mocks__/auth";
import { db } from "~/lib/__mocks__/db";
import { CREATE_CLIENT_SUCCESS } from "~/app/(protected)/clientele/new/_constants/actionResponses";
import {
  AUTHENTICATION_ERROR,
  CREDENTIALS_PARSING_ERROR,
  EMAIL_IN_USE_ERROR,
} from "~/app/_constants/actionResponses";

vi.mock("~/lib/db");
vi.mock("~/lib/auth");
vi.mock("next/navigation");

// Create client server action spy
const createClientSpy = vi.spyOn(actions, "createClient");

/**
 * To fill client form with credentials and submit
 * @param user User credentials to fill form with
 */
const fillClientFormAndSubmit = async (user: User) => {
  const registerForm = screen.getByRole("form");
  const firstNameInput = screen.getByLabelText(/First name/i);
  const lastNameInput = screen.getByLabelText(/Last name/);
  const emailAddressInput = screen.getByLabelText(/Email address/i);
  const passwordInput = screen.getByLabelText(/^Password/i);

  await act(async () => {
    fireEvent.change(firstNameInput, { target: { value: user.firstName } });
    fireEvent.change(lastNameInput, { target: { value: user.lastName } });
    fireEvent.change(emailAddressInput, {
      target: { value: user.emailAddress },
    });
    fireEvent.change(passwordInput, { target: { value: user.password } });

    fireEvent.submit(registerForm);
  });
};

/**
 * Reusable credentials error assertion
 */
const expectCredentialsError = async () => {
  // Wait for create client server action to complete
  await createClientSpy.mock.results[0]?.value;

  expect(createClientSpy).toHaveBeenCalled();
  expect(createClientSpy).toHaveReturnedWith(CREDENTIALS_PARSING_ERROR);

  await waitFor(() =>
    expect(
      screen.getByText(CREDENTIALS_PARSING_ERROR.message ?? ""),
    ).toBeDefined(),
  );
};

/**
 * Reusable authentication error assertion
 */
const expectAuthenticationError = async () => {
  // Wait for create client server action to complete
  await createClientSpy.mock.results[0]?.value;

  expect(createClientSpy).toHaveBeenCalled();
  expect(createClientSpy).toHaveReturnedWith(AUTHENTICATION_ERROR);

  await waitFor(() =>
    expect(screen.getByText(AUTHENTICATION_ERROR.message ?? "")).toBeDefined(),
  );
};

describe("ClientForm create", async () => {
  beforeEach(() => {
    render(<ClientForm action={actions.createClient} />);
  });

  it("should succeed with valid client credentials", async () => {
    const createUserReturn = createUser();

    auth.mockResolvedValueOnce({ user: { id: "" } });
    db.user.findUnique.mockResolvedValueOnce(createUser({ role: "ADMIN" }));
    db.user.create.mockResolvedValueOnce(createUserReturn);

    await fillClientFormAndSubmit(createUser());

    // Must use act since response creates AlertBox
    await act(async () => {
      // Wait for create client server action to complete
      await createClientSpy.mock.results[0]?.value;
    });

    expect(createClientSpy).toHaveBeenCalled();
    expect(createClientSpy).toHaveReturnedWith(CREATE_CLIENT_SUCCESS);
    expect(redirect).toHaveBeenCalledWith(`/clientele/${createUserReturn.id}`);
  });

  it("should fail with invalid first name", async () => {
    const user = createUser();
    user.firstName = "";

    await fillClientFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid last name", async () => {
    const user = createUser();
    user.lastName = "";

    await fillClientFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid email address", async () => {
    const user = createUser();
    user.emailAddress = "fail@err.c";

    await fillClientFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail with invalid password", async () => {
    const user = createUser();
    user.password = "pass";

    await fillClientFormAndSubmit(user);
    await expectCredentialsError();
  });

  it("should fail when session is empty", async () => {
    auth.mockResolvedValueOnce(null);

    await fillClientFormAndSubmit(createUser());
    await expectAuthenticationError();
  });

  it("should fail when current user is unauthorized", async () => {
    auth.mockResolvedValueOnce({ user: { id: "" } });
    db.user.findUnique.mockResolvedValueOnce(createUser({ role: "CLIENT" }));

    await fillClientFormAndSubmit(createUser());
    await expectAuthenticationError();
  });

  it("should fail when email is in use", async () => {
    auth.mockResolvedValueOnce({ user: { id: "" } });
    db.user.findUnique.mockResolvedValueOnce(createUser({ role: "ADMIN" }));
    db.user.findUnique.mockResolvedValueOnce(createUser());

    await fillClientFormAndSubmit(createUser());

    // Wait for create client server action to complete
    await createClientSpy.mock.results[0]?.value;

    expect(createClientSpy).toHaveBeenCalled();
    expect(createClientSpy).toHaveReturnedWith(EMAIL_IN_USE_ERROR);

    await waitFor(() =>
      expect(screen.getByText(EMAIL_IN_USE_ERROR.message ?? "")).toBeDefined(),
    );
  });
});
