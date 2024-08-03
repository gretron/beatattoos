"use server";

import { registerFormSchemaRefined } from "~/app/auth/register/_constants/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "~/lib/db";
import {
  CREATE_USER_FAILED_ERROR,
  EXISTING_ACCOUNT_ERROR,
  EXISTING_ACCOUNT_FAILED_ERROR,
} from "~/app/auth/register/_constants/actionResponses";
import {
  INCORRECT_TOKEN_REDIRECT,
  SUCCESS_REDIRECT,
} from "~/app/auth/register/_constants/redirectUrls";
import {
  CREDENTIALS_PARSING_ERROR,
  EMAIL_IN_USE_ERROR,
  EMAIL_IN_USE_FAILED_ERROR,
  INVALID_CITY_ERROR,
  INVALID_STATE_PROVINCE_ERROR,
  MISSING_COUNTRY_ERROR,
  REQUIRED_CITY_ERROR,
} from "~/app/_constants/actionResponses";
import { areLocationsInvalid } from "~/app/_utils/location-utilities";

/**
 * Action to register new administrator account
 * @param formData register form data {@link registerFormSchema}
 */
export async function register(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsedData = registerFormSchemaRefined.safeParse(data);

  // Check for data formatting errors
  if (!parsedData.success) {
    return CREDENTIALS_PARSING_ERROR;
  }

  // Retrieve admin token
  const cookieStore = cookies();
  const adminToken = cookieStore.get("adminToken");

  // If admin token does not correspond, redirect to token page
  if (adminToken?.value !== process.env.ADMIN_TOKEN) {
    redirect(INCORRECT_TOKEN_REDIRECT);
    return; // For integration test
  }

  let adminUserExists;

  try {
    adminUserExists = await db.user.findFirst({
      where: { role: "ADMIN" },
    });
  } catch (e) {
    return EXISTING_ACCOUNT_FAILED_ERROR;
  }

  if (adminUserExists) {
    return EXISTING_ACCOUNT_ERROR;
  }

  const {
    firstName,
    lastName,
    countryId,
    stateProvinceId,
    cityId,
    emailAddress,
    password,
  } = parsedData.data;

  let emailInUse;

  try {
    emailInUse = await db.user.findUnique({ where: { emailAddress } });
  } catch (e) {
    return EMAIL_IN_USE_FAILED_ERROR;
  }

  if (emailInUse) {
    return EMAIL_IN_USE_ERROR;
  }

  const locationsInvalid = await areLocationsInvalid(
    countryId,
    stateProvinceId,
    cityId,
  );

  if (locationsInvalid) {
    return locationsInvalid;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.create({
      data: {
        role: "ADMIN",
        firstName,
        lastName,
        countryId,
        stateProvinceId,
        cityId,
        emailAddress,
        password: hashedPassword,
      },
    });
  } catch (e) {
    return CREATE_USER_FAILED_ERROR;
  }

  redirect(SUCCESS_REDIRECT);
}
