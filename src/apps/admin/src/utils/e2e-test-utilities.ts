import { db } from "~/lib/db";
import { Country, StateProvince, City } from "@beatattoos/db";

/**
 * To find random locations from database
 */
export async function findRandomDatabaseLocations(): Promise<{
  country: Country;
  stateProvince: StateProvince;
  city?: City;
}> {
  let country;

  try {
    country = await db.country.findFirst({
      include: {
        stateProvinces: {
          include: {
            cities: true,
          },
        },
      },
    });
  } catch (e) {
    throw new Error(
      "[ERROR]: An error occurred while fetching countries from database",
      { cause: e },
    );
  }

  if (!country) {
    throw new Error("[ERROR]: No available country in database");
  }

  const stateProvince = country.stateProvinces[0];

  if (!stateProvince) {
    throw new Error(
      "[ERROR]: No available state/province for given country in database",
    );
  }

  return { country, stateProvince, city: stateProvince.cities[0] };
}
