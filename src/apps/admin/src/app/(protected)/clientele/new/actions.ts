"use server";

import { db } from "~/lib/db";
import {
  AUTHENTICATION_ERROR,
  CREDENTIALS_PARSING_ERROR,
  EMAIL_IN_USE_ERROR,
  EMAIL_IN_USE_FAILED_ERROR,
} from "~/app/_constants/actionResponses";
import bcrypt from "bcryptjs";
import {
  CREATE_CLIENT_FAILED_ERROR,
  CREATE_CLIENT_SUCCESS,
} from "~/app/(protected)/clientele/new/_constants/actionResponses";
import { authenticate } from "~/app/(protected)/_lib/auth";
import { areLocationsInvalid } from "~/app/_utils/location-utilities";
import { userSchema } from "~/app/_constants/schemas";
import ClientWithLocations from "~/app/(protected)/clientele/_types/ClientWithLocations";
import LocationsInclude from "~/app/(protected)/clientele/_constants/locations-include";
import { authenticatedAction } from "~/lib/trpc";
import { Alert } from "@beatattoos/ui";

export const createClient = authenticatedAction
  .input(userSchema)
  .mutation(
    async ({
      ctx,
      input,
    }): Promise<{ alert: Alert; data?: ClientWithLocations }> => {
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

      // For integration tests
      return { alert: CREATE_CLIENT_SUCCESS, data: user };
    },
  );
