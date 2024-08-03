"use client";

import { ReactNode } from "react";
import {
  IconMailFilled,
  IconMapPinFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { getAlternatenameAbbreviationOrDefault } from "~/app/_utils/alternatename-utilities";
import Link from "next/link";
import ClientWithLocations from "~/app/(protected)/clientele/_types/ClientWithLocations";

/**
 * Props for {@link ClientListItem}
 */
interface ClientListItemProps {
  children?: ReactNode;
  client: ClientWithLocations;
}

/**
 * Item for {@link ClientList}
 */
export default function ClientListItem(props: ClientListItemProps) {
  const provinceName = getAlternatenameAbbreviationOrDefault(
    props.client.stateProvince.alternatenames,
  );

  return (
    <Link href={`/clientele/${props.client.id}`}>
      <li
        className={
          "flex flex-col gap-3 rounded-2xl border border-neutral-400 p-4 *:flex *:items-center *:gap-2 *:truncate"
        }
      >
        <div>
          <IconUserFilled
            className={"h-4 w-4 flex-shrink-0 fill-neutral-500"}
          />
          <div
            className={"truncate text-sm"}
          >{`${props.client.firstName} ${props.client.lastName}`}</div>
        </div>
        <div>
          <IconMailFilled
            className={"h-4 w-4 flex-shrink-0 fill-neutral-500"}
          />
          <div className={"truncate text-sm"}>{props.client.emailAddress}</div>
        </div>
        <div>
          <IconMapPinFilled
            className={"h-4 w-4 flex-shrink-0 fill-neutral-500"}
          />
          <div
            className={"truncate text-sm"}
          >{`${props.client.city ? `${props.client.city.name}, ` : ""}${provinceName?.name ?? props.client.stateProvince.name}, ${props.client.country.name}`}</div>
        </div>
      </li>
    </Link>
  );
}
