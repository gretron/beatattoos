import Location from "./Location";

/**
 * Class to represent state/province
 */
export default class StateProvince implements Location {
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
