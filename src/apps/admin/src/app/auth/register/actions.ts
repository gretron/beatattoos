"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "~/lib/db";
import {
  CREATE_USER_FAILED_ERROR,
  EXISTING_ACCOUNT_ERROR,
  EXISTING_ACCOUNT_FAILED_ERROR,
  INCORRECT_TOKEN_ERROR,
} from "~/app/auth/register/_constants/actionResponses";
import { SUCCESS_REDIRECT } from "~/app/auth/register/_constants/redirectUrls";
import {
  EMAIL_IN_USE_ERROR,
  EMAIL_IN_USE_FAILED_ERROR,
} from "~/app/_constants/actionResponses";
import { areLocationsInvalid } from "~/app/_utils/location-utilities";
import { TRPCError } from "@trpc/server";
import { serverActionProcedure } from "~/lib/trpc";
import { registerFormSchemaRefined } from "~/app/auth/register/_constants/schemas";

/**
 * Action to register new administrator account
 * @param input register form data {@link registerFormSchemaRefined}
 */
export const register = serverActionProcedure
  .input(registerFormSchemaRefined)
  .mutation(async ({ ctx, input }) => {
    // Retrieve admin token
    const cookieStore = cookies();
    const adminToken = cookieStore.get("adminToken");

    // If admin token does not correspond, redirect to token page
    if (adminToken?.value !== process.env.ADMIN_TOKEN) {
      return Promise.reject(
        new TRPCError({
          code: "UNAUTHORIZED",
          message: INCORRECT_TOKEN_ERROR,
        }),
      );
    }

    let adminUserExists;

    try {
      adminUserExists = await db.user.findFirst({
        where: { role: "ADMIN" },
      });
    } catch (e) {
      return Promise.reject(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: EXISTING_ACCOUNT_FAILED_ERROR,
        }),
      );
    }

    if (adminUserExists) {
      return Promise.reject(
        new TRPCError({
          code: "BAD_REQUEST",
          message: EXISTING_ACCOUNT_ERROR,
        }),
      );
    }

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
      return Promise.reject(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: EMAIL_IN_USE_FAILED_ERROR,
        }),
      );
    }

    if (emailInUse) {
      return Promise.reject(
        new TRPCError({
          code: "BAD_REQUEST",
          message: EMAIL_IN_USE_ERROR,
        }),
      );
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
      return Promise.reject(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: CREATE_USER_FAILED_ERROR,
        }),
      );
    }

    redirect(SUCCESS_REDIRECT);
  });
