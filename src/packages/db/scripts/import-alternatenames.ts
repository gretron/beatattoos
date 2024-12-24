import countryAlternatenames from "../res/country-alternatenames.json";
import stateProvinceAlternatenames from "../res/state-province-alternatenames.json";
import cityAlternatenames from "../res/city-alternatenames.json";
import {
  CountryAlternatename,
  StateProvinceAlternatename,
  CityAlternatename,
  PrismaClient,
} from "@prisma/client";
import Alternatename from "../types/Alternatename";

const db = new PrismaClient();

/**
 * To import country alternatenames into database
 */
async function importCountryAlternatenames() {
  try {
    await db.countryAlternatename.deleteMany({});
  } catch (e) {
    console.error(
      "ERROR: An error occurred while deleting existing database country alternate names",
      e,
    );

    return Promise.reject(e);
  }

  console.log("Successfully deleted existing database country alternate names");

  const alternateNames: CountryAlternatename[] = (
    countryAlternatenames as []
  ).map((alternatename: Alternatename) => ({
    id: alternatename.id,
    countryId: alternatename.geonameId,
    name: alternatename.name,
    isoLanguage: alternatename.isoLanguage,
    isPreferred: alternatename.isPreferred,
    isShortName: alternatename.isShortName,
  }));

  try {
    await db.countryAlternatename.createMany({ data: alternateNames });
  } catch (e) {
    console.error(
      "ERROR: An error occurred while creating country alternate names",
      e,
    );

    return Promise.reject(e);
  }

  console.log("Successfully created country alternate names");
}

/**
 * To import state/province alternatenames into database
 */
async function importStateProvinceAlternatenames() {
  try {
    await db.stateProvinceAlternatename.deleteMany({});
  } catch (e) {
    console.error(
      "ERROR: An error occurred while deleting existing database state/province alternate names",
      e,
    );

    return Promise.reject(e);
  }

  console.log(
    "Successfully deleted existing database state/province alternate names",
  );

  const alternateNames: StateProvinceAlternatename[] = (
    stateProvinceAlternatenames as []
  ).map((alternatename: Alternatename) => ({
    id: alternatename.id,
    stateProvinceId: alternatename.geonameId,
    name: alternatename.name,
    isoLanguage: alternatename.isoLanguage,
    isPreferred: alternatename.isPreferred,
    isShortName: alternatename.isShortName,
  }));

  try {
    await db.stateProvinceAlternatename.createMany({ data: alternateNames });
  } catch (e) {
    console.error(
      "ERROR: An error occurred while creating state/province alternate names",
      e,
    );

    return Promise.reject(e);
  }

  console.log("Successfully created state/province alternate names");
}

/**
 * To import city alternatenames into database
 */
async function importCityAlternatenames() {
  try {
    await db.cityAlternatename.deleteMany({});
  } catch (e) {
    console.error(
      "ERROR: An error occurred while deleting existing database city alternate names",
      e,
    );

    return Promise.reject(e);
  }

  console.log("Successfully deleted existing database city alternate names");

  const alternateNames: CityAlternatename[] = (cityAlternatenames as []).map(
    (alternatename: Alternatename) => ({
      id: alternatename.id,
      cityId: alternatename.geonameId,
      name: alternatename.name,
      isoLanguage: alternatename.isoLanguage,
      isPreferred: alternatename.isPreferred,
      isShortName: alternatename.isShortName,
    }),
  );

  try {
    await db.cityAlternatename.createMany({ data: alternateNames });
  } catch (e) {
    console.error(
      "ERROR: An error occurred while creating city alternate names",
      e,
    );

    return Promise.reject(e);
  }

  console.log("Successfully created city alternate names");
}

/**
 * To import country, state/province and city alternatenames into database
 */
async function importAlternatenames() {
  await importCountryAlternatenames();
  await importStateProvinceAlternatenames();
  await importCityAlternatenames();
}

Promise.resolve(importAlternatenames());
