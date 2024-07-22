import { db } from "~/lib/db";
import { getCurrentUser } from "~/app/utils/auth-utilities";

/**
 * To get all clients with their country, state/province and city, if any
 * @returns a list of all clients or undefined if user is unauthenticated
 */
export async function getClientsWithLocations() {
  const user = await getCurrentUser();
  if (!user) return;

  return db.user.findMany({
    where: { role: "CLIENT" },
    include: {
      country: {
        include: {
          alternatenames: {
            where: {
              isoLanguage: "en",
            },
          },
        },
      },
      stateProvince: {
        include: {
          alternatenames: {
            where: {
              OR: [{ isoLanguage: "en" }, { isoLanguage: "abbr" }],
            },
          },
        },
      },
      city: {
        include: {
          alternatenames: {
            where: {
              isoLanguage: "en",
            },
          },
        },
      },
    },
  });
}
