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
import { redirect } from "next/navigation";
import { serverActionProcedure } from "~/lib/trpc";
import { TRPCError } from "@trpc/server";

/**
 * Action to log in into administrator account
 * @param data login form data {@link loginFormSchema}
 */
export const login = serverActionProcedure
  .input(loginFormSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      await signIn("credentials", { ...input, redirect: false });
    } catch (e) {
      if (
        e instanceof CallbackRouteError &&
        e.cause?.err instanceof CredentialsSignin
      ) {
        return Promise.reject(
          new TRPCError({ code: "UNAUTHORIZED", message: CREDENTIALS_ERROR }),
        );
      }

      return Promise.reject(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: OPERATIONS_ERROR,
        }),
      );
    }

    redirect(SUCCESS_REDIRECT);
  });
