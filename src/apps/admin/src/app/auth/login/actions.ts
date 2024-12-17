"use server";

import { signIn } from "~/lib/auth";
import { loginFormSchema } from "~/app/auth/login/_constants/schemas";
import { CredentialsSignin } from "next-auth";
import { CallbackRouteError } from "@auth/core/errors";
import {
  CREDENTIALS_ERROR,
  OPERATIONS_ERROR,
} from "~/app/auth/login/_constants/actionResponses";
import { SUCCESS_REDIRECT } from "~/app/auth/login/_constants/redirectUrls";
import { z } from "zod";

/**
 * Action to log in into administrator account
 * @param data login form data {@link loginFormSchema}
 */
export async function login(
  data: z.infer<typeof loginFormSchema>,
): Promise<any> {
  try {
    await signIn("credentials", { ...data, redirectTo: SUCCESS_REDIRECT });
  } catch (e) {
    if (e instanceof CallbackRouteError && e.cause?.err) {
      return e.cause.err instanceof CredentialsSignin
        ? { alert: CREDENTIALS_ERROR }
        : { alert: OPERATIONS_ERROR };
    }

    // Throw error to allow successful login redirect
    throw e;
  }

  return { alert: OPERATIONS_ERROR };
}
