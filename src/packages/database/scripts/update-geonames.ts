import countryGeonames from "../res/countries.json";
import stateProvinceGeonames from "../res/states-provinces.json";
import cityGeonames from "../res/cities.json";
import { Country, StateProvince, City, PrismaClient } from "@prisma/client";
import Geoname from "../types/Geoname";

const db = new PrismaClient();

/**
 * To update countries into database
 */
async function updateCountries() {
  const countries: Country[] = countryGeonames.map((geoname: Geoname) => ({
    id: geoname.id,
    name: geoname.name,
    longitude: geoname.longitude,
    latitude: geoname.latitude,
  }));

  await db.$transaction(
    countries.map((country: Country) =>
      db.country.upsert({
        where: { id: country.id },
        update: country,
        create: country,
      }),
    ),
  );

  console.log("Successfully updated countries");
}

/**
 * To update state/provinces into database
 */
async function updateStateProvinces() {
  const stateProvinces: StateProvince[] = stateProvinceGeonames.map(
    (geoname: Geoname) => ({
      id: geoname.id,
      countryId: geoname.parentId,
      name: geoname.name,
      longitude: geoname.longitude,
      latitude: geoname.latitude,
    }),
  );

  await db.$transaction(
    stateProvinces.map((stateProvince: StateProvince) =>
      db.stateProvince.upsert({
        where: { id: stateProvince.id },
        update: stateProvince,
        create: stateProvince,
      }),
    ),
  );

  console.log("Successfully updated states/provinces");
}

/**
 * To update cities into database
 */
async function updateCities() {
  const cities: City[] = cityGeonames.map((geoname: Geoname) => ({
    id: geoname.id,
    stateProvinceId: geoname.parentId,
    name: geoname.name,
    longitude: geoname.longitude,
    latitude: geoname.latitude,
  }));

  await db.$transaction(
    cities.map((city: City) =>
      db.city.upsert({
        where: { id: city.id },
        update: city,
        create: city,
      }),
    ),
  );

  console.log("Successfully updated cities");
}

/**
 * To update countries, states/provinces and cities in database
 */
async function updateLocations() {
  await updateCountries();
  await updateStateProvinces();
  await updateCities();
}

Promise.resolve(updateLocations());
