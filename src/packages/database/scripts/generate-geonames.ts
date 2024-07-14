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
  [key: string]: any;
  id: string;
  parentId?: string;
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
 * To get the state/province feature code for a given country
 * @param countryCode the code of the country
 */
function getStateProvinceFeatureCode(countryCode: string) {
  const stateProvinceLevel = countryStateProvinceLevels[countryCode];

  return !stateProvinceLevel ? "ADM1" : AdminLevels[stateProvinceLevel];
}

/**
 * To get Geoname from geoname string line
 * @param geonameLine the string line to generate Geoname from
 */
function geonameLineToGeoname(geonameLine: string): Geoname {
  const splitLine = geonameLine.split("\t");

  return {
    id: String(splitLine[0]),
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

  const countries: Geoname[] = [];
  const countriesByCountryCode: { [key: string]: Geoname } = {};

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
  [p: string]: Geoname;
}) {
  const geonamesStream = getReadlineStream(pathToGeonames);
  const statesProvincesFeatureClass = "A";

  const statesProvinces: Geoname[] = [];
  const stateProvincesByCountryAndAdminCode: {
    [countryAdminCode: string]: Geoname;
  } = {};

  let count = 0;

  for await (const geonameLine of geonamesStream) {
    const geoname = geonameLineToGeoname(geonameLine);
    const country = countriesByCountryCode[geoname.countryCode];
    const featureCode = getStateProvinceFeatureCode(geoname.countryCode);

    // If geoname is a state or province...
    if (
      country &&
      geoname.featureClass === statesProvincesFeatureClass &&
      geoname.featureCode === featureCode
    ) {
      statesProvinces.push({ ...geoname, parentId: country.id });

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
  [countryAdminCode: string]: Geoname;
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

  const cities: Geoname[] = [];

  let count = 0;

  for await (const geonameLine of geonamesStream) {
    const geoname = geonameLineToGeoname(geonameLine);
    const featureCode = getStateProvinceFeatureCode(geoname.countryCode);
    const adminCode = String(geoname[featureCode]);
    const stateProvince =
      stateProvincesByCountryAndAdminCode[
        `${geoname.countryCode}-${adminCode}`
      ];

    if (
      !stateProvince ||
      geoname.featureClass !== citiesFeatureClass ||
      !citiesFeatureCodes.includes(geoname.featureCode) ||
      geoname.population < 10000
    ) {
      continue;
    }

    const adminLevel = Number(featureCode.charAt(3));
    let adminLevelsMatch = true;

    for (let i = adminLevel; i > 0; i--) {
      const adminLevel = `ADM${i}`;

      if (geoname[adminLevel] !== stateProvince[adminLevel]) {
        adminLevelsMatch = false;
        break;
      }
    }

    if (!adminLevelsMatch) {
      continue;
    }

    cities.push({ ...geoname, parentId: stateProvince.id });

    count++;

    console.log(`Added city '${geoname.name}' (${count})`);
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

/**
 * To generate geonames at country, state/province and city level
 */
async function generate() {
  const countriesByCountryCode = await generateJSONCountries();
  const statesProvinces = await generateJSONStatesProvinces(
    countriesByCountryCode,
  );
  await generateJSONCities(statesProvinces);
}

Promise.resolve(generate());
