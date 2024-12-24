"use server";

import { db } from "~/lib/db";
import {
  EMAIL_IN_USE_ERROR,
  EMAIL_IN_USE_FAILED_ERROR,
} from "~/app/_constants/actionResponses";
import bcrypt from "bcryptjs";
import {
  CREATE_CLIENT_FAILED_ERROR,
  CREATE_CLIENT_SUCCESS,
} from "~/app/(protected)/clientele/new/_constants/actionResponses";
import { areLocationsInvalid } from "~/app/_utils/location-utilities";
import { userSchema } from "~/app/_constants/schemas";
import ClientWithLocations from "~/app/(protected)/clientele/_types/ClientWithLocations";
import LocationsInclude from "~/app/(protected)/clientele/_constants/locations-include";
import { authenticatedAction } from "~/lib/trpc";
import { TRPCError } from "@trpc/server";

/**
 * Action to create a new client
 * @param input the new client data {@link userSchema}
 */
export const createClient = authenticatedAction
  .input(userSchema)
  .mutation(async ({ ctx, input }) => {
    const {
      firstName,
      lastName,
      countryId,
      stateProvinceId,
      cityId,
      emailAddress,
      password,
    } = input;

    let emailInUse;

    try {
      emailInUse = await db.user.findUnique({ where: { emailAddress } });
    } catch (e) {
      return Promise.reject({
        code: "INTERNAL_SERVER_ERROR",
        message: EMAIL_IN_USE_FAILED_ERROR,
      });
    }

    if (emailInUse) {
      return Promise.reject({
        code: "BAD_REQUEST",
        message: EMAIL_IN_USE_ERROR,
      });
    }

    const locationsInvalid = await areLocationsInvalid(
      countryId,
      stateProvinceId,
      cityId,
    );

    if (locationsInvalid) {
      return Promise.reject(locationsInvalid);
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
      return Promise.reject(
        new TRPCError({
          code: "BAD_REQUEST",
          message: CREATE_CLIENT_FAILED_ERROR,
        }),
      );
    }

    // For integration tests
    return { alert: CREATE_CLIENT_SUCCESS, data: user };
  });
