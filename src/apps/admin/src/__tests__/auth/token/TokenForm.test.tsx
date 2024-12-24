import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TokenForm from "~/app/auth/token/_components/TokenForm";
import * as actions from "~/app/auth/token/actions";
import { redirect } from "next/navigation";
import { SUCCESS_REDIRECT } from "~/app/auth/token/_constants/redirectUrls";
import { INCORRECT_TOKEN_ERROR } from "~/app/auth/token/_constants/actionResponses";
import {
  expectAsyncSpyError,
  expectAsyncSpyToResolveWith,
  expectErrorMessage,
  getSchemaErrorMessage,
} from "~/utils/integration-test-utilities";
import { tokenFormSchema } from "~/app/auth/token/_constants/schemas";

// Mock modules
vi.mock("~/lib/db");
vi.mock("~/lib/auth");
vi.mock("next/headers");
vi.mock("next/navigation");

// Create action spies
const verifyTokenSpy = vi.spyOn(actions, "verifyToken");

/**
 * To fill token form with admin token
 * @param token Administrator token
 */
const fillTokenFormAndSubmit = async (token: string) => {
  const tokenForm = screen.getByRole("form");
  const tokenInput = screen.getByLabelText(/Admin token/i);

  fireEvent.change(tokenInput, {
    target: { value: token },
  });
  fireEvent.submit(tokenForm);
};

describe("TokenForm", async () => {
  beforeEach(() => {
    render(<TokenForm />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should succeed with valid admin token", async () => {
    await fillTokenFormAndSubmit(process.env.ADMIN_TOKEN ?? "");

    await expectAsyncSpyToResolveWith(verifyTokenSpy, undefined);
    expect(redirect).toHaveBeenCalledWith(SUCCESS_REDIRECT);
  });

  it("should fail with invalid token", async () => {
    await fillTokenFormAndSubmit("");

    await expectAsyncSpyError(verifyTokenSpy);
    await expectErrorMessage(
      getSchemaErrorMessage(tokenFormSchema, { adminToken: "" }),
    );
  });

  it("should fail with incorrect token", async () => {
    await fillTokenFormAndSubmit("*");

    await expectAsyncSpyError(verifyTokenSpy);
    await expectErrorMessage(INCORRECT_TOKEN_ERROR);
  });
});
