"use server";

import { db } from "~/lib/db";

/**
 * Action to get states/provinces using a given country id
 * @param countryId id of the country to get states/provinces from
 */
export async function getStatesProvincesUsingCountryId(countryId: string) {
  return db.stateProvince.findMany({
    where: { countryId: countryId },
    include: {
      alternatenames: { where: { isoLanguage: "en" } },
      _count: { select: { cities: true } },
    },
  });
}

/**
 * Action to get cities using a given state/province id
 * @param stateProvinceId id of the state/province to get states/provinces from
 */
export async function getCitiesUsingStateProvinceId(stateProvinceId: string) {
  return db.city.findMany({
    where: { stateProvinceId: stateProvinceId },
    include: { alternatenames: { where: { isoLanguage: "en" } } },
  });
}
