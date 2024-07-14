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
 * To import countries into database
 */
async function importCountries() {
  await db.country.deleteMany({});

  const countries: Country[] = countryGeonames.map(
    (geoname: any) => new Country(geoname),
  );

  await db.country.createMany({ data: countries });
}

/**
 * To import state/provinces into database
 */
async function importStateProvinces() {
  const stateProvinces = stateProvinceGeonames.map(
    (geoname: any) => new StateProvince(geoname),
  );

  await db.stateProvince.createMany({ data: stateProvinces });
}

/**
 * To import cities into database
 */
async function importCities() {
  const cities = cityGeonames.map((geoname: any) => new City(geoname));

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
