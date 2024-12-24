"use server";

import { tokenFormSchema } from "~/app/auth/token/_constants/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { INCORRECT_TOKEN_ERROR } from "~/app/auth/token/_constants/actionResponses";
import { SUCCESS_REDIRECT } from "~/app/auth/token/_constants/redirectUrls";
import { serverActionProcedure } from "~/lib/trpc";
import { TRPCError } from "@trpc/server";

/**
 * Action to verify administrator token validity
 * @param input token form data {@link tokenFormSchema}
 */
export const verifyToken = serverActionProcedure
  .input(tokenFormSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if entered token corresponds to the admin token
    if (input.adminToken !== process.env.ADMIN_TOKEN) {
      return Promise.reject(
        new TRPCError({
          code: "UNAUTHORIZED",
          message: INCORRECT_TOKEN_ERROR,
        }),
      );
    }

    // Store validated token as a cookie to be used to register
    const cookieStore = cookies();
    cookieStore.set("adminToken", input.adminToken, {
      path: "/auth",
    });

    redirect(SUCCESS_REDIRECT);
  });
