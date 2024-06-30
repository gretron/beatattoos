import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TokenForm from "~/app/auth/token/_components/TokenForm";
import * as actions from "~/app/auth/token/actions";
import { act } from "react";
import { redirect } from "next/navigation";
import { SUCCESS_REDIRECT } from "~/app/auth/token/_constants/redirectUrls";
import {
  INCORRECT_TOKEN_ERROR,
  TOKEN_PARSING_ERROR,
} from "~/app/auth/token/_constants/actionResponses";

vi.mock("~/lib/db");
vi.mock("next/headers");
vi.mock("next/navigation");

// Verify token server action spy
const verifyTokenSpy = vi.spyOn(actions, "verifyToken");

/**
 * To fill token form with admin token
 * @param token Administrator token
 */
const fillTokenFormAndSubmit = async (token: string) => {
  const tokenForm = screen.getByRole("form");
  const tokenInput = screen.getByLabelText(/Admin token/i);

  await act(async () => {
    fireEvent.change(tokenInput, {
      target: { value: token },
    });
    fireEvent.submit(tokenForm);
  });
};

describe("TokenForm", async () => {
  beforeEach(() => {
    render(<TokenForm />);
  });

  it("should succeed with valid admin token", async () => {
    await fillTokenFormAndSubmit(process.env.ADMIN_TOKEN ?? "");

    await verifyTokenSpy.mock.results[0]?.value;

    expect(verifyTokenSpy).toHaveBeenCalled();
    expect(verifyTokenSpy).toHaveReturnedWith(undefined);
    expect(redirect).toHaveBeenCalledWith(SUCCESS_REDIRECT);
  });

  it("should fail with invalid token", async () => {
    await fillTokenFormAndSubmit("");

    await verifyTokenSpy.mock.results[0]?.value;

    expect(verifyTokenSpy).toHaveBeenCalled();
    expect(verifyTokenSpy).toHaveReturnedWith(TOKEN_PARSING_ERROR);
  });

  it("should fail with incorrect token", async () => {
    await fillTokenFormAndSubmit("*");

    await verifyTokenSpy.mock.results[0]?.value;

    expect(verifyTokenSpy).toHaveBeenCalled();
    expect(verifyTokenSpy).toHaveReturnedWith(INCORRECT_TOKEN_ERROR);
  });
});
