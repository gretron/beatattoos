const fs = require("fs");
const readline = require("readline");

enum AdminLevels {
  ADM1 = 10,
  ADM2,
  ADM3,
  ADM4,
}

const countryStateProvinceLevels: { [key: string]: AdminLevels } = {
  IT: AdminLevels.ADM2,
};

const pathToGeonames = __dirname + "/../res/allCountries.txt";

interface Geoname {
  [key: string]: string | number;
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  featureClass: string;
  featureCode: string;
  countryCode: string;
  ADM1: string;
  ADM2: string;
  ADM3: string;
  ADM4: string;
  population: number;
}

interface Country extends Geoname {}

interface StateProvince extends Geoname {
  countryId: number;
}

interface City extends Geoname {
  stateProvinceId: number;
}

/**
 * To get a readline stream to read file line-by-line
 * @param filePath Path to file to generate stream from
 */
function getReadlineStream(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(
      `File '${filePath}' must be present in order to perform stream generation.`,
    );
    return;
  }

  const fileStream = fs.createReadStream(filePath);

  return readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
}

/**
 * To get Geoname from geoname string line
 * @param geonameLine the string line to generate Geoname from
 */
function geonameLineToGeoname(geonameLine: string): Geoname {
  const splitLine = geonameLine.split("\t");

  return {
    id: Number(splitLine[0]),
    name: String(splitLine[1]),
    latitude: Number(splitLine[4]),
    longitude: Number(splitLine[5]),
    featureClass: String(splitLine[6]),
    featureCode: String(splitLine[7]),
    countryCode: String(splitLine[8]),
    ADM1: String(splitLine[10]),
    ADM2: String(splitLine[11]),
    ADM3: String(splitLine[12]),
    ADM4: String(splitLine[13]),
    population: Number(splitLine[14]),
  };
}

/**
 * To generate geonames to the database
 */
async function generateJSONCountries() {
  const geonamesStream = getReadlineStream(pathToGeonames);
  const countryFeatureClass = "A";
  const countryFeatureCode = "PCLI";

  const countries: Country[] = [];
  const countriesByCountryCode: { [key: string]: Country } = {};

  let count = 0;

  for await (const geonameLine of geonamesStream) {
    const geoname = geonameLineToGeoname(geonameLine);

    // If geoname is country...
    if (
      geoname.featureClass === countryFeatureClass &&
      geoname.featureCode === countryFeatureCode
    ) {
      countries.push(geoname);
      countriesByCountryCode[geoname.countryCode] = geoname;

      count++;

      console.log(`Added country '${geoname.name}' (${count})`);
    }
  }

  await fs.writeFile(
    __dirname + "/../res/countries.json",
    JSON.stringify(countries, null, "\t"),
    (err: Error) => {
      if (err) throw err;
    },
  );

  return countriesByCountryCode;
}

/**
 * Generate states/provinces to JSON format
 * @param countriesByCountryCode Countries object with country code keys
 */
async function generateJSONStatesProvinces(countriesByCountryCode: {
  [p: string]: Country;
}) {
  const geonamesStream = getReadlineStream(pathToGeonames);
  const statesProvincesFeatureClass = "A";

  const statesProvinces: StateProvince[] = [];
  const stateProvincesByCountryAndAdminCode: {
    [countryAdminCode: string]: StateProvince;
  } = {};

  let count = 0;

  for await (const geonameLine of geonamesStream) {
    const geoname = geonameLineToGeoname(geonameLine);
    const country = countriesByCountryCode[geoname.countryCode];
    const stateProvinceLevel = countryStateProvinceLevels[geoname.countryCode];
    let featureCode;

    if (!stateProvinceLevel) {
      featureCode = "ADM1";
    } else {
      featureCode = AdminLevels[stateProvinceLevel];
    }

    // If geoname is a state or province...
    if (
      country &&
      geoname.featureClass === statesProvincesFeatureClass &&
      geoname.featureCode === featureCode
    ) {
      statesProvinces.push({ ...geoname, countryId: country.id });

      const adminCode = String(geoname[featureCode]);

      stateProvincesByCountryAndAdminCode[
        `${geoname.countryCode}-${adminCode}`
      ] = {
        ...geoname,
        countryId: country.id,
      };

      count++;

      console.log(`Added state/province '${geoname.name}' (${count})`);
    }
  }

  await fs.writeFile(
    __dirname + "/../res/statesProvinces.json",
    JSON.stringify(statesProvinces, null, "\t"),
    (err: Error) => {
      if (err) throw err;
    },
  );

  console.log("Successfully generated states/provinces");

  return stateProvincesByCountryAndAdminCode;
}

/**
 * To generate cities to JSON format
 */
async function generateJSONCities(stateProvincesByCountryAndAdminCode: {
  [countryAdminCode: string]: StateProvince;
}) {
  const geonamesStream = getReadlineStream(pathToGeonames);
  const citiesFeatureClass = "P";
  const citiesFeatureCodes = [
    "PPL",
    "PPLA",
    "PPLA2",
    "PPLA3",
    "PPLA4",
    "PPLA5",
    "PPLC",
    "PPLG",
    "PPLR",
  ];

  const cities: City[] = [];

  let count = 0;

  for await (const geonameLine of geonamesStream) {
    const geoname = geonameLineToGeoname(geonameLine);
    const stateProvinceLevel = countryStateProvinceLevels[geoname.countryCode];
    let featureCode;

    if (!stateProvinceLevel) {
      featureCode = "ADM1";
    } else {
      featureCode = AdminLevels[stateProvinceLevel];
    }

    const adminCode = String(geoname[featureCode]);
    const stateProvince =
      stateProvincesByCountryAndAdminCode[
        `${geoname.countryCode}-${adminCode}`
      ];

    // If geoname is a state or province...
    if (
      stateProvince &&
      geoname.featureClass === citiesFeatureClass &&
      citiesFeatureCodes.includes(geoname.featureCode) &&
      geoname.population > 10000
    ) {
      cities.push({ ...geoname, stateProvinceId: stateProvince.id });

      count++;

      console.log(`Added city '${geoname.name}' (${count})`);
    }
  }

  await fs.writeFile(
    __dirname + "/../res/cities.json",
    JSON.stringify(cities, null, "\t"),
    (err: Error) => {
      if (err) throw err;
    },
  );

  console.log("Successfully generated cities");
}

async function generate() {
  const countriesByCountryCode = await generateJSONCountries();
  const statesProvinces = await generateJSONStatesProvinces(
    countriesByCountryCode,
  );
  await generateJSONCities(statesProvinces);
}

Promise.resolve(generate());
