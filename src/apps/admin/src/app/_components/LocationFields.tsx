"use client";

import { ReactNode, useMemo, useState } from "react";
import LocationField from "~/app/_components/LocationField";
import { useDebounceTimer } from "@beatattoos/ui";
import {
  getCitiesUsingStateProvinceId,
  getStatesProvincesUsingCountryId,
} from "~/app/actions";
import {
  City,
  CityAlternatename,
  Country,
  CountryAlternatename,
  StateProvince,
  StateProvinceAlternatename,
} from "@beatattoos/db";
import { requiredSchema } from "~/app/_constants/schemas";

/**
 * Required props for {@link LocationFields}, use when form uses {@link LocationFields}
 */
export interface RequiredLocationFieldsProps {
  countries: (Country & { alternatenames: CountryAlternatename[] })[];
}

/**
 * Props for {@link LocationFields}
 */
interface LocationFieldsProps {
  children?: ReactNode;
  countries: (Country & { alternatenames: CountryAlternatename[] })[];
  disabled: boolean;
}

export default function LocationFields(props: LocationFieldsProps) {
  const [countryId, setCountryId] = useState("");
  const [stateProvinceId, setStateProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [statesProvinces, setStatesProvinces] = useState<
    (StateProvince & { alternatenames: StateProvinceAlternatename[] } & {
      _count: { cities: number };
    })[]
  >([]);
  const [cities, setCities] = useState<
    (City & { alternatenames: CityAlternatename[] })[]
  >([]);

  const selectedStateProvince = useMemo(() => {
    return statesProvinces.find(
      (stateProvince) => stateProvince.id === stateProvinceId,
    );
  }, [stateProvinceId]);

  const { isLoading: stateProvincesLoading } = useDebounceTimer(
    countryId,
    () => {
      setStatesProvinces([]);
      setStateProvinceId("");
    },
    async () => {
      setStatesProvinces(await getStatesProvincesUsingCountryId(countryId));
    },
    1000,
  );

  const { isLoading: citiesLoading } = useDebounceTimer(
    stateProvinceId,
    () => {
      setCities([]);
      setCityId("");
    },
    async () => {
      setCities(await getCitiesUsingStateProvinceId(stateProvinceId));
    },
    1000,
  );

  return (
    <>
      <LocationField
        id={"country"}
        name={"countryId"}
        heading={"Country"}
        schema={requiredSchema("Country")}
        placeholder={"Select a country..."}
        className={"mb-4"}
        required={true}
        disabled={props.disabled}
        locations={props.countries}
        options={[]}
        value={countryId}
        setValue={(value) => setCountryId(value)}
      />
      {countryId !== "" && (
        <LocationField
          id={"state-province"}
          name={"stateProvinceId"}
          heading={"State/province"}
          schema={requiredSchema("State/province")}
          placeholder={"Select a state/province..."}
          className={"mb-4"}
          required={true}
          disabled={props.disabled}
          isLoading={stateProvincesLoading}
          locations={statesProvinces}
          options={[]}
          value={stateProvinceId}
          setValue={(value) => setStateProvinceId(value)}
        />
      )}
      {stateProvinceId !== "" &&
        (selectedStateProvince?._count.cities ?? 0) > 0 && (
          <LocationField
            id={"city"}
            name={"cityId"}
            heading={"City"}
            schema={requiredSchema("City")}
            placeholder={"Select a city..."}
            className={"mb-4"}
            required={true}
            disabled={props.disabled}
            isLoading={citiesLoading}
            locations={cities}
            options={[]}
            value={cityId}
            setValue={(value) => setCityId(value)}
          />
        )}
    </>
  );
}
