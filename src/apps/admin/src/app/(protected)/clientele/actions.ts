"use server";

import { authenticatedAction } from "~/lib/trpc";
import { z } from "zod";
import { db } from "~/lib/db";
import LocationsInclude from "~/app/(protected)/clientele/_constants/locations-include";
import { TRPCError } from "@trpc/server";
import { GET_CLIENTS_WITH_LOCATIONS_FAILED_ERROR } from "~/app/(protected)/clientele/_constants/actionResponses";

/**
 * To get clients with their country, state/province and city, if any
 * @returns a list of all clients or undefined if user is unauthenticated
 */
export const getClientsWithLocations = authenticatedAction
  .input(
    z.object({
      skip: z.number(),
      take: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      return db.user.findMany({
        where: { role: "CLIENT" },
        include: LocationsInclude,
        skip: input.skip,
        take: input.take,
      });
    } catch (e) {
      return Promise.reject(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: GET_CLIENTS_WITH_LOCATIONS_FAILED_ERROR,
        }),
      );
    }
  });
