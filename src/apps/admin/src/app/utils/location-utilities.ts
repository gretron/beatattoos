import { db } from "~/lib/db";
import {
  INVALID_CITY_ERROR,
  INVALID_STATE_PROVINCE_ERROR,
  MISSING_COUNTRY_ERROR,
  REQUIRED_CITY_ERROR,
} from "~/app/_constants/actionResponses";

export async function areLocationsInvalid(
  countryId: string,
  stateProvinceId: string,
  cityId?: string,
) {
  let country;

  try {
    country = await db.country.findUnique({
      where: { id: countryId },
      include: {
        stateProvinces: {
          where: { id: stateProvinceId },
          include: {
            cities: { where: { id: cityId } },
            _count: { select: { cities: true } },
          },
        },
      },
    });
  } catch (e) {}

  if (!country) {
    return MISSING_COUNTRY_ERROR;
  }

  if (!country.stateProvinces[0]) {
    return INVALID_STATE_PROVINCE_ERROR;
  }

  if (!cityId && country.stateProvinces[0]._count.cities > 0) {
    return REQUIRED_CITY_ERROR;
  }

  if (cityId && !country.stateProvinces[0].cities[0]) {
    return INVALID_CITY_ERROR;
  }
}
