"use server";

import { tokenFormSchema } from "~/app/auth/token/_constants/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  INCORRECT_TOKEN_ERROR,
  TOKEN_PARSING_ERROR,
} from "~/app/auth/token/_constants/actionResponses";
import { SUCCESS_REDIRECT } from "~/app/auth/token/_constants/redirectUrls";

/**
 * Action to verify administrator token validity
 * @param formData token form data {@link tokenFormSchema}
 */
export async function verifyToken(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsedData = tokenFormSchema.safeParse(data);

  // Check for data formatting errors
  if (!parsedData.success) {
    return TOKEN_PARSING_ERROR;
  }

  // Check if entered token corresponds to the admin token
  if (parsedData.data.adminToken !== process.env.ADMIN_TOKEN) {
    return INCORRECT_TOKEN_ERROR;
  }

  // Store validated token as a cookie to be used to register
  const cookieStore = cookies();
  cookieStore.set("adminToken", parsedData.data.adminToken, { path: "/auth" });

  redirect(SUCCESS_REDIRECT);
}
