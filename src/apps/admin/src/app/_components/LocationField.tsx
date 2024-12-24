"use client";

import { useMemo } from "react";
import { SelectField, SelectFieldProps } from "@beatattoos/ui";
import { sortAlternatenames } from "~/app/_utils/alternatename-utilities";
import { Location } from "~/app/_types/Location";

/**
 * Props for {@link LocationField}
 */
interface LocationFieldProps extends SelectFieldProps {
  locations: Location[];
}

/**
 * Field for locations
 * @param props
 * @constructor
 */
export default function LocationField(props: LocationFieldProps) {
  const options = useMemo(() => {
    const options = props.locations.map((location) => {
      const alternatename = location.alternatenames.sort(sortAlternatenames);

      return {
        label: alternatename[0]?.name ?? location.name,
        value: location.id,
      };
    });

    options.sort((a, b) =>
      a.label.toUpperCase().localeCompare(b.label.toUpperCase()),
    );

    return options;
  }, [props.locations]);

  return <SelectField {...props} options={options} />;
}
