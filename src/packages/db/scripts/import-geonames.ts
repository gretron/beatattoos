import countryGeonames from "../res/countries.json";
import stateProvinceGeonames from "../res/states-provinces.json";
import cityGeonames from "../res/cities.json";
import { Country, StateProvince, City, PrismaClient } from "@prisma/client";
import Geoname from "../types/Geoname";

const db = new PrismaClient();

/**
 * To import countries into database
 */
async function importCountries() {
  const countries: Country[] = (countryGeonames as []).map(
    (geoname: Geoname) => ({
      id: geoname.id,
      name: geoname.name,
      longitude: geoname.longitude,
      latitude: geoname.latitude,
    }),
  );

  try {
    await db.country.createMany({ data: countries });
  } catch (e) {
    console.error(
      "ERROR: An error occurred while importing countries into the database",
      e,
    );

    return Promise.reject(e);
  }

  console.log("Successfully imported countries into database");
}

/**
 * To import state/provinces into database
 */
async function importStateProvinces() {
  const stateProvinces: StateProvince[] = (stateProvinceGeonames as []).map(
    (geoname: Geoname) => ({
      id: geoname.id,
      countryId: geoname.parentId,
      name: geoname.name,
      longitude: geoname.longitude,
      latitude: geoname.latitude,
    }),
  );

  try {
    await db.stateProvince.createMany({ data: stateProvinces });
  } catch (e) {
    console.error(
      "ERROR: An error occurred while importing states/provinces into the database",
      e,
    );

    return Promise.reject(e);
  }

  console.log("Successfully imported states/provinces into database");
}

/**
 * To import cities into database
 */
async function importCities() {
  const cities: City[] = (cityGeonames as []).map((geoname: Geoname) => ({
    id: geoname.id,
    stateProvinceId: geoname.parentId,
    name: geoname.name,
    longitude: geoname.longitude,
    latitude: geoname.latitude,
  }));

  try {
    await db.city.createMany({ data: cities });
  } catch (e) {
    console.error(
      "ERROR: An error occurred while importing cities into the database",
      e,
    );

    return Promise.reject(e);
  }

  console.log("Successfully imported cities into database");
}

/**
 * To import countries, states/provinces and cities into database
 */
async function importLocations() {
  try {
    await db.countryAlternatename.deleteMany({});
  } catch (e) {
    console.error(
      "ERROR: An error occurred while deleting existing database country alternate names",
      e,
    );

    Promise.reject(e);
  }

  console.log("Successfully deleted existing database country alternate names");

  try {
    await db.stateProvinceAlternatename.deleteMany({});
  } catch (e) {
    console.error(
      "ERROR: An error occurred while deleting existing database state/province alternate names",
      e,
    );

    Promise.reject(e);
  }

  console.log(
    "Successfully deleted existing database state/province alternate names",
  );

  try {
    await db.cityAlternatename.deleteMany({});
  } catch (e) {
    console.error(
      "ERROR: An error occurred while deleting existing database city alternate names",
      e,
    );

    Promise.reject(e);
  }

  console.log("Successfully deleted existing database city alternate names");

  try {
    await db.country.deleteMany({});
  } catch (e) {
    console.error(
      "ERROR: An error occurred while deleting existing database countries",
      e,
    );

    Promise.reject(e);
  }

  console.log("Successfully deleted existing existing database countries");

  await importCountries();
  await importStateProvinces();
  await importCities();
}

Promise.resolve(importLocations());
