export default interface Geoname {
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
