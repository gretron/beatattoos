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
  await db.countryAlternatename.deleteMany({});

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

  await db.countryAlternatename.createMany({ data: alternateNames });
}

/**
 * To import state/province alternatenames into database
 */
async function importStateProvinceAlternatenames() {
  await db.stateProvinceAlternatename.deleteMany({});

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

  await db.stateProvinceAlternatename.createMany({ data: alternateNames });
}

/**
 * To import city alternatenames into database
 */
async function importCityAlternatenames() {
  await db.cityAlternatename.deleteMany({});

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

  await db.cityAlternatename.createMany({ data: alternateNames });
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
