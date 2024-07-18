import { ReactNode } from "react";
import {
  IconMailFilled,
  IconMapPinFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { getAlternatenameAbbreviationOrDefault } from "~/app/utils/alternatename-utilities";
import {
  User,
  Country,
  CountryAlternatename,
  StateProvince,
  StateProvinceAlternatename,
  City,
  CityAlternatename,
} from "@beatattoos/db";
import Link from "next/link";

/**
 * Props for {@link ClientListItem}
 */
interface ClientListItemProps {
  children?: ReactNode;
  client: User & {
    country: Country & { alternatenames: CountryAlternatename[] };
    stateProvince: StateProvince & {
      alternatenames: StateProvinceAlternatename[];
    };
    city: (City & { alternatenames: CityAlternatename[] }) | null;
  };
}

/**
 * Item for {@link ClientList}
 */
export default async function ClientListItem(props: ClientListItemProps) {
  const provinceName = getAlternatenameAbbreviationOrDefault(
    props.client.stateProvince.alternatenames,
  );

  return (
    <Link href={`/clientele/${props.client.id}`}>
      <li
        className={
          "flex flex-col gap-3 rounded-2xl border border-neutral-400 p-4 *:flex *:items-center *:gap-2"
        }
      >
        <div>
          <IconUserFilled className={"h-4 w-4 fill-neutral-500"} />
          <div
            className={"text-sm"}
          >{`${props.client.firstName} ${props.client.lastName}`}</div>
        </div>
        <div>
          <IconMailFilled className={"h-4 w-4 fill-neutral-500"} />
          <div className={"text-sm"}>{props.client.emailAddress}</div>
        </div>
        <div>
          <IconMapPinFilled className={"h-4 w-4 fill-neutral-500"} />
          <div
            className={"text-sm"}
          >{`${props.client.city ? `${props.client.city.name}, ` : ""}${provinceName?.name ?? props.client.stateProvince.name}, ${props.client.country.name}`}</div>
        </div>
      </li>
    </Link>
  );
}
