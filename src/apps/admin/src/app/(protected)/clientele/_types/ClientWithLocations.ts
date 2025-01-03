import {
  City,
  CityAlternatename,
  Country,
  CountryAlternatename,
  StateProvince,
  StateProvinceAlternatename,
  User,
} from "@beatattoos/db";

/**
 * Client with their country, state/province and city, if any
 */
type ClientWithLocations = User & {
  country: Country & { alternatenames: CountryAlternatename[] };
  stateProvince: StateProvince & {
    alternatenames: StateProvinceAlternatename[];
  };
  city: (City & { alternatenames: CityAlternatename[] }) | null;
};

export default ClientWithLocations;
