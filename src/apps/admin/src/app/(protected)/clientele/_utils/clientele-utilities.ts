import { db } from "~/lib/db";
import { getCurrentUser } from "~/app/_utils/auth-utilities";
import { LocationsInclude } from "~/app/(protected)/clientele/_types/ClientWithLocations";

/**
 * To get all clients with their country, state/province and city, if any
 * @returns a list of all clients or undefined if user is unauthenticated
 */
export async function getClientsWithLocations() {
  const user = await getCurrentUser();
  if (!user) return;

  return db.user.findMany({
    where: { role: "CLIENT" },
    include: LocationsInclude,
  });
}
