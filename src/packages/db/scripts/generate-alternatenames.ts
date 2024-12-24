import * as fs from "fs";
import * as readline from "readline";
import countryGeonames from "../res/countries.json";
import stateProvinceGeonames from "../res/states-provinces.json";
import cityGeonames from "../res/cities.json";
import supportedLanguages from "../res/supported-languages.json";
import Geoname from "../types/Geoname";
import Alternatename from "../types/Alternatename";

const pathToAlternateNames = __dirname + "/../res/alternateNamesV2.txt";

interface Bias {
  [isoLanguage: string]: {
    [geonameId: string]: string;
  };
}

const countryNameBias: Bias = {
  en: {
    6252001: "2428563", // United-States of America
    2260494: "1978630", // Republic of the Congo
    203312: "1978896", // Democratic Republic of the Congo
    2750405: "1559973", // Netherlands
    2413451: "1555213", // Gambia
  },
};

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

function countryBiasExists(alternatename: Alternatename, bias: Bias) {
  return (
    bias[alternatename.isoLanguage] &&
    bias[alternatename.isoLanguage][alternatename.geonameId]
  );
}

/**
 * To verify if current alternate name is a country bias
 * @param alternatename
 */
function isCountryBias(alternatename: Alternatename, bias: Bias) {
  return (
    bias[alternatename.isoLanguage] &&
    alternatename.id ===
      bias[alternatename.isoLanguage][alternatename.geonameId]
  );
}

/**
 * To get Alternatename from alternatename string line
 * @param alternatenameLine the string line to generate Alternatename from
 */
function alternatenameLineToAlternatename(
  alternatenameLine: string,
): Alternatename {
  const splitLine = alternatenameLine.split("\t");

  return {
    id: String(splitLine[0]),
    geonameId: String(splitLine[1]),
    isoLanguage: String(splitLine[2]),
    name: String(splitLine[3]),
    isPreferred: Boolean(splitLine[4]),
    isShortName: Boolean(splitLine[5]),
  };
}

/**
 * To generate alternatenames to JSON format
 */
async function generateJSONAlternatenames() {
  const start = new Date().getTime();
  const alternatenamesStream = getReadlineStream(pathToAlternateNames);

  const countryAlternatenames: Alternatename[] = [];
  const stateProvinceAlternatenames: Alternatename[] = [];
  const cityAlternatenames: Alternatename[] = [];

  let count = 0;

  const countriesById: {
    [id: string]: Geoname;
  } = {};

  (countryGeonames as Geoname[]).forEach((country) => {
    countriesById[country.id] = country;
  });

  const statesProvincesById: {
    [id: string]: Geoname;
  } = {};

  (stateProvinceGeonames as Geoname[]).forEach((stateProvince) => {
    statesProvincesById[stateProvince.id] = stateProvince;
  });

  const citiesById: {
    [id: string]: Geoname;
  } = {};

  (cityGeonames as Geoname[]).forEach((city) => {
    citiesById[city.id] = city;
  });

  for await (const alternatenameLine of alternatenamesStream) {
    const alternatename = alternatenameLineToAlternatename(alternatenameLine);

    if (
      !supportedLanguages.includes(alternatename.isoLanguage) &&
      alternatename.isoLanguage !== "abbr"
    ) {
      continue;
    }

    if (
      countriesById[alternatename.geonameId] &&
      (alternatename.isoLanguage === "abbr" ||
        !countryBiasExists(alternatename, countryNameBias) ||
        isCountryBias(alternatename, countryNameBias))
    ) {
      countryAlternatenames.push(alternatename);
      console.log(
        `Added country alternatename '${alternatename.name}' (${count})`,
      );
      count++;
    } else if (statesProvincesById[alternatename.geonameId]) {
      stateProvinceAlternatenames.push(alternatename);
      console.log(
        `Added state/province alternatename '${alternatename.name}' (${count})`,
      );
      count++;
    } else if (citiesById[alternatename.geonameId]) {
      cityAlternatenames.push(alternatename);
      console.log(
        `Added city alternatename '${alternatename.name}' (${count})`,
      );
      count++;
    }
  }

  const executionSeconds = (new Date().getTime() - start) / 1000;
  console.log(`Took ${executionSeconds}s to execute generateAlertnames()`);

  fs.writeFile(
    __dirname + "/../res/country-alternatenames.json",
    JSON.stringify(countryAlternatenames, null, "\t"),
    (err: Error) => {
      if (err) throw err;
    },
  );

  fs.writeFile(
    __dirname + "/../res/state-province-alternatenames.json",
    JSON.stringify(stateProvinceAlternatenames, null, "\t"),
    (err: Error) => {
      if (err) throw err;
    },
  );

  fs.writeFile(
    __dirname + "/../res/city-alternatenames.json",
    JSON.stringify(cityAlternatenames, null, "\t"),
    (err: Error) => {
      if (err) throw err;
    },
  );
}

Promise.resolve(generateJSONAlternatenames());
