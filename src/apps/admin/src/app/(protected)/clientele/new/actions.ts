"use server";

import { Alert } from "@beatattoos/ui";
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
import { areLocationsInvalid } from "~/app/_utils/location-utilities";
import { userSchema } from "~/app/_constants/schemas";
import ClientWithLocations, {
  LocationsInclude,
} from "~/app/(protected)/clientele/_types/ClientWithLocations";
import { authenticatedAction } from "~/lib/trpc";

export const createClient2 = authenticatedAction
  .input(userSchema)
  .mutation(async ({ ctx, input }) => {
    const parsedData = userSchema.safeParse(input);

    // Check for data formatting errors
    if (!parsedData.success) {
      return { alert: CREDENTIALS_PARSING_ERROR };
    }

    try {
      await authenticate();
    } catch (e) {
      return { alert: AUTHENTICATION_ERROR };
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
      return { alert: EMAIL_IN_USE_FAILED_ERROR };
    }

    if (emailInUse) {
      return { alert: EMAIL_IN_USE_ERROR };
    }

    const locationsInvalid = await areLocationsInvalid(
      countryId,
      stateProvinceId,
      cityId,
    );

    if (locationsInvalid) {
      return { alert: locationsInvalid };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user: ClientWithLocations;

    try {
      user = await db.user.create({
        data: {
          role: "CLIENT",
          firstName,
          lastName,
          countryId,
          stateProvinceId,
          cityId,
          emailAddress,
          password: hashedPassword,
        },
        include: LocationsInclude,
      });
    } catch (e) {
      return { alert: CREATE_CLIENT_FAILED_ERROR };
    }

    await new Promise((r) => setTimeout(r, 10000));

    // redirect(`/clientele/${user.id}`);

    // FAILURE: Send failure message
    // SUCCESS: Send success message and new user

    // For integration tests
    return { alert: CREATE_CLIENT_SUCCESS, client: user };
  });

/**
 * Action to create client account
 * @param formData client form data {@link userSchema}
 */
export async function createClient(
  formData: FormData,
): Promise<Alert | [Alert, ClientWithLocations]> {
  const data = Object.fromEntries(formData);
  const parsedData = userSchema.safeParse(data);

  // Check for data formatting errors
  if (!parsedData.success) {
    return CREDENTIALS_PARSING_ERROR;
  }

  try {
    await authenticate();
  } catch (e) {
    return AUTHENTICATION_ERROR;
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
  let user: ClientWithLocations;

  try {
    user = await db.user.create({
      data: {
        role: "CLIENT",
        firstName,
        lastName,
        countryId,
        stateProvinceId,
        cityId,
        emailAddress,
        password: hashedPassword,
      },
      include: LocationsInclude,
    });
  } catch (e) {
    return CREATE_CLIENT_FAILED_ERROR;
  }

  await new Promise((r) => setTimeout(r, 10000));

  // redirect(`/clientele/${user.id}`);

  // FAILURE: Send failure message
  // SUCCESS: Send success message and new user

  // For integration tests
  return [CREATE_CLIENT_SUCCESS, user];
}
