import {
  City,
  CityAlternatename,
  Country,
  CountryAlternatename,
  StateProvince,
  StateProvinceAlternatename,
} from "@beatattoos/db";

/**
 * Type for country, state/province or city
 */
export type Location =
  | (Country & { alternatenames: CountryAlternatename[] })
  | (StateProvince & { alternatenames: StateProvinceAlternatename[] })
  | (City & { alternatenames: CityAlternatename[] });
