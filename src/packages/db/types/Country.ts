import Location from "./Location";

/**
 * Class to represent country
 */
export default class Country implements Location {
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
