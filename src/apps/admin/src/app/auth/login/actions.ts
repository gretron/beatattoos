"use server";

import { signIn } from "~/lib/auth";
import { Alert, AlertType } from "@beatattoos/ui";
import { loginFormSchema } from "~/app/auth/login/_constants/schemas";
import { CredentialsSignin } from "next-auth";
import { CallbackRouteError } from "@auth/core/errors";
import {
  CREDENTIALS_ERROR,
  OPERATIONS_ERROR,
} from "~/app/auth/login/_constants/actionResponses";
import { SUCCESS_REDIRECT } from "~/app/auth/login/_constants/redirectUrls";

/**
 * Action to log in into administrator account
 * @param formData login form data {@link loginFormSchema}
 */
export async function login(formData: FormData): Promise<Alert> {
  const data = Object.fromEntries(formData);

  try {
    await signIn("credentials", { ...data, redirectTo: SUCCESS_REDIRECT });
  } catch (e) {
    if (e instanceof CallbackRouteError && e.cause?.err) {
      return e.cause.err instanceof CredentialsSignin
        ? CREDENTIALS_ERROR
        : OPERATIONS_ERROR;
    }

    // Throw error to allow successful login redirect
    throw e;
  }

  return OPERATIONS_ERROR;
}
