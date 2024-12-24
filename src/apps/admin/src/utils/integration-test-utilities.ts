import { MockInstance, expect } from "vitest";
import { act, screen } from "@testing-library/react";
import { db } from "~/lib/__mocks__/db";
import { ZodEffects, ZodObject, ZodRawShape, ZodTypeAny } from "zod";
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
export function createRandomizedCountry(): Country & {
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
export function createRandomizedStateProvince(
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
export function createRandomizedCity(
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

/**
 * Randomized countries constant
 */
export const MOCK_COUNTRIES = Array.from(
  { length: faker.number.int({ min: 3, max: 5 }) },
  () => createRandomizedCountry(),
);

/**
 * Randomized state/provinces constant (using randomized countries)
 */
export const MOCK_STATE_PROVINCES = MOCK_COUNTRIES.reduce(
  (
    acc: {
      [key: string]: (StateProvince & {
        alternatenames: StateProvinceAlternatename[];
        _count: { cities: number };
      })[];
    },
    country,
  ) => {
    acc[country.id] = Array.from(
      { length: faker.number.int({ min: 3, max: 5 }) },
      () => createRandomizedStateProvince(country),
    );

    return acc;
  },
  {},
);

/**
 * Randomized cities constant (using randomized state/provinces)
 */
export const MOCK_CITIES = Object.values(MOCK_STATE_PROVINCES).reduce(
  (
    acc: {
      [key: string]: (City & {
        alternatenames: CityAlternatename[];
      })[];
    },
    stateProvinces,
  ) => {
    stateProvinces.map((stateProvince) => {
      acc[stateProvince.id] = Array.from(
        { length: stateProvince._count.cities },
        () => createRandomizedCity(stateProvince),
      );
    });

    return acc;
  },
  {},
);

/**
 * Selected randomized country
 */
export const SELECTED_MOCK_COUNTRY = faker.helpers.arrayElement(MOCK_COUNTRIES);

/**
 * Selected randomized state/province (using selected randomized country)
 */
export const SELECTED_MOCK_STATE_PROVINCE = faker.helpers.arrayElement(
  MOCK_STATE_PROVINCES[SELECTED_MOCK_COUNTRY.id] ?? [],
);

/**
 * Selected randomized city (using selected randomized state/province)
 */
export const SELECTED_MOCK_CITY = faker.helpers.arrayElement(
  MOCK_CITIES[SELECTED_MOCK_STATE_PROVINCE.id] ?? [],
);

/**
 * To wait for asynchronous function spy to resolve before proceeding
 * @param spy the asynchronous function spy
 */
export async function waitForAsyncSpyToResolve(spy: MockInstance<any, any>) {
  const mockResultExists = !!spy.mock.results[0];

  if (!mockResultExists) {
    throw new Error("ERROR: Spy does not have any pending results");
  }

  expect(spy).toHaveBeenCalled();

  await act(async () => {
    await spy.mock.results[0]?.value;
  });
}

/**
 * To expect asynchronous function spy to resolve with given data
 * @param spy the asynchronous function spy
 * @param data the data expected to resolve with
 */
export async function expectAsyncSpyToResolveWith(
  spy: MockInstance<any, any>,
  data: any,
) {
  if (!spy.mock.results[0]) {
    throw new Error("ERROR: Spy does not have any pending results");
  }

  expect(spy).toHaveBeenCalled();

  if (spy.mock.results[0].value !== data) {
    await act(async () => {
      await expect(spy.mock.results[0]?.value).resolves.toEqual(data);
    });
  } else {
    expect(spy.mock.results[0].value).toEqual(data);
  }
}

/**
 * To expect asynchronous function spy to throw an error
 * @param spy the asynchronous function spy
 */
export async function expectAsyncSpyError(spy: MockInstance<any, any>) {
  if (!spy.mock.results[0]) {
    throw new Error("ERROR: Spy does not have any pending results");
  }

  expect(spy).toHaveBeenCalled();

  if (spy.mock.results[0].value instanceof Error) {
    expect(spy.mock.results[0].value).toBeInstanceOf(Error);
  } else {
    await act(async () => {
      await expect(spy.mock.results[0]?.value).rejects.toThrowError();
    });
  }
}

/**
 * To expect error message to be on the screen
 * @param errorMessage the error message to look for
 */
export async function expectErrorMessage(errorMessage: string) {
  expect(screen.getByText(errorMessage)).toBeDefined();
}

/**
 * To mock location calls for valid locations
 */
export function mockLocations() {
  db.stateProvince.findMany.mockImplementation(
    (args: { where: { countryId: string } }) =>
      Promise.resolve(MOCK_STATE_PROVINCES[args.where.countryId]),
  );
  db.city.findMany.mockImplementation(
    (args: { where: { stateProvinceId: string } }) =>
      Promise.resolve(MOCK_CITIES[args.where.stateProvinceId]),
  );

  db.country.findUnique.mockResolvedValue({
    ...SELECTED_MOCK_COUNTRY,
    stateProvinces: MOCK_STATE_PROVINCES[SELECTED_MOCK_COUNTRY.id]?.map(
      (stateProvince) => {
        return { ...stateProvince, cities: MOCK_CITIES[stateProvince.id] };
      },
    ),
  });
}

/**
 * To get error message from schema given data
 * @param schema the schema to test the data
 * @param data the data to input into schema
 */
export function getSchemaErrorMessage<T extends ZodRawShape>(
  schema: ZodObject<T>,
  data: any,
): string;
export function getSchemaErrorMessage<T extends ZodTypeAny>(
  schema: ZodEffects<T>,
  data: any,
): string;
export function getSchemaErrorMessage<T extends ZodTypeAny>(
  schema: unknown,
  data: any,
): string {
  return JSON.parse(
    (schema as ZodObject<any> | ZodEffects<any>).safeParse(data)?.error
      ?.message ?? "",
  )[0].message;
}
