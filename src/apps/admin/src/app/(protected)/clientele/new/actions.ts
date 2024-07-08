"use server";

import { Alert } from "@beatattoos/ui/Alert";
import { clientFormSchema } from "~/app/(protected)/clientele/_constants/schemas";
import { db } from "~/lib/db";
import {
  AUTHENTICATION_ERROR,
  CREDENTIALS_PARSING_ERROR,
  EMAIL_IN_USE_ERROR,
  EMAIL_IN_USE_FAILED_ERROR,
} from "~/app/_constants/actionResponses";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import {
  CREATE_CLIENT_FAILED_ERROR,
  CREATE_CLIENT_SUCCESS,
} from "~/app/(protected)/clientele/new/_constants/actionResponses";
import { authenticate } from "~/app/(protected)/_lib/auth";

/**
 * Action to create client account
 * @param formData client form data {@link clientFormSchema}
 */
export async function createClient(formData: FormData): Promise<Alert> {
  const data = Object.fromEntries(formData);
  const parsedData = clientFormSchema.safeParse(data);

  // Check for data formatting errors
  if (!parsedData.success) {
    return CREDENTIALS_PARSING_ERROR;
  }

  try {
    await authenticate();
  } catch (e) {
    return AUTHENTICATION_ERROR;
  }

  const { firstName, lastName, emailAddress, password } = parsedData.data;

  let emailInUse;

  try {
    emailInUse = await db.user.findUnique({ where: { emailAddress } });
  } catch (e) {
    return EMAIL_IN_USE_FAILED_ERROR;
  }

  if (emailInUse) {
    return EMAIL_IN_USE_ERROR;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let user: User;

  try {
    user = await db.user.create({
      data: {
        role: "CLIENT",
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
      },
    });
  } catch (e) {
    return CREATE_CLIENT_FAILED_ERROR;
  }

  redirect(`/clientele/${user.id}`);

  // For integration tests
  return CREATE_CLIENT_SUCCESS;
}
