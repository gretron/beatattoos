const prisma = require("@prisma/client");
const countryGeonames = require("../res/countries.json");
const stateProvinceGeonames = require("../res/statesProvinces.json");
const cityGeonames = require("../res/cities.json");

if (!process.env.NODE_ENV) {
  throw new Error("Development environment is not set.");
}

const db = new prisma.PrismaClient();

/**
 * Location interface containing basic location information
 */
interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

/**
 * Class to represent country
 */
class Country implements Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;

  constructor(geoname: any) {
    this.id = geoname.id;
    this.name = geoname.name;
    this.latitude = geoname.latitude;
    this.longitude = geoname.longitude;
  }
}

/**
 * Class to represent state/province
 */
class StateProvince implements Location {
  id: string;
  countryId: string;
  name: string;
  latitude: number;
  longitude: number;

  constructor(geoname: any) {
    this.id = geoname.id;
    this.countryId = geoname.parentId;
    this.name = geoname.name;
    this.latitude = geoname.latitude;
    this.longitude = geoname.longitude;
  }
}

/**
 * Class to represent city
 */
class City implements Location {
  id: string;
  stateProvinceId: string;
  name: string;
  latitude: number;
  longitude: number;

  constructor(geoname: any) {
    this.id = geoname.id;
    this.stateProvinceId = geoname.parentId;
    this.name = geoname.name;
    this.latitude = geoname.latitude;
    this.longitude = geoname.longitude;
  }
}

/**
 * To update countries into database
 */
async function updateCountries() {
  const countries: Country[] = countryGeonames.map(
    (geoname: any) => new Country(geoname),
  );

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
  const stateProvinces = stateProvinceGeonames.map(
    (geoname: any) => new StateProvince(geoname),
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
  const cities = cityGeonames.map((geoname: any) => new City(geoname));

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
