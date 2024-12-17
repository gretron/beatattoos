"use server";

import { findClientsWithLocations } from "~/app/(protected)/clientele/_utils/clientele-utilities";

/**
 * To get clients with their country, state/province and city, if any
 * @returns a list of all clients or undefined if user is unauthenticated
 */
export async function getClientsWithLocations(skip: number, take: number) {
  return (await findClientsWithLocations(skip, take)) ?? [];
}
