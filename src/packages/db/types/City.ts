import Location from "./Location";

/**
 * Class to represent city
 */
export default class City implements Location {
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
