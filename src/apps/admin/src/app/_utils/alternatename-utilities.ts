import {
  CountryAlternatename,
  StateProvinceAlternatename,
  CityAlternatename,
} from "@beatattoos/db";

/**
 * Type to include country, state/province and city alternatenames
 */
type Alternatename =
  | CountryAlternatename
  | StateProvinceAlternatename
  | CityAlternatename;

/**
 * To sort alternatenames relevance based on preferred state and name length
 * @param a First alternatename
 * @param b Second alternatename
 */
export function sortAlternatenames(a: Alternatename, b: Alternatename) {
  if (a.isPreferred && !b.isPreferred) {
    return -1;
  }

  if (!a.isPreferred && b.isPreferred) {
    return 1;
  }

  return a.name.length - b.name.length;
}

/**
 * To find abbreviation alternatename among alternatenames or default alternatename
 * @param alternatenames alternatenames to find abbreviation from
 */
export function getAlternatenameAbbreviationOrDefault(
  alternatenames: Alternatename[],
) {
  const abbreviation = alternatenames.find(
    (alternatename) => alternatename.isoLanguage === "abbr",
  );

  return abbreviation ?? alternatenames.sort(sortAlternatenames)[0];
}
