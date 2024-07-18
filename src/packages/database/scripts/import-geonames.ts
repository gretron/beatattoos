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
  await db.countryAlternatename.deleteMany({});
  await db.stateProvinceAlternatename.deleteMany({});
  await db.cityAlternatename.deleteMany({});
  await db.country.deleteMany({});

  const countries: Country[] = (countryGeonames as []).map(
    (geoname: Geoname) => ({
      id: geoname.id,
      name: geoname.name,
      longitude: geoname.longitude,
      latitude: geoname.latitude,
    }),
  );

  await db.country.createMany({ data: countries });
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

  await db.stateProvince.createMany({ data: stateProvinces });
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

  await db.city.createMany({ data: cities });
}

/**
 * To import countries, states/provinces and cities into database
 */
async function importLocations() {
  await importCountries();
  await importStateProvinces();
  await importCities();
}

Promise.resolve(importLocations());
