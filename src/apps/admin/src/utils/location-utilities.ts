import {
  Country,
  StateProvince,
  City,
  CountryAlternatename,
  StateProvinceAlternatename,
  CityAlternatename,
} from "@beatattoos/db";
import { faker } from "@faker-js/faker";

/**
 * Utility to create randomized country
 */
export function createCountry(): Country & {
  alternatenames: CountryAlternatename[];
} {
  return {
    id: faker.string.uuid(),
    name: faker.location.country(),
    latitude: faker.number.int(),
    longitude: faker.number.int(),
    alternatenames: [],
  };
}

/**
 * Utility to create randomized state/province
 * @param country country to create state/province from
 */
export function createStateProvince(
  country: Country,
): StateProvince & {
  alternatenames: StateProvinceAlternatename[];
  _count: { cities: number };
} {
  return {
    id: faker.string.uuid(),
    countryId: country.id,
    name: faker.location.state(),
    latitude: faker.number.int(),
    longitude: faker.number.int(),
    alternatenames: [],
    _count: {
      cities: faker.number.int({ min: 3, max: 5 }),
    },
  };
}

/**
 * Utility to create randomized city
 * @param stateProvince state/province to create city from
 */
export function createCity(
  stateProvince: StateProvince,
): City & { alternatenames: CityAlternatename[] } {
  return {
    id: faker.string.uuid(),
    stateProvinceId: stateProvince.id,
    name: faker.location.city(),
    latitude: faker.number.int(),
    longitude: faker.number.int(),
    alternatenames: [],
  };
}
