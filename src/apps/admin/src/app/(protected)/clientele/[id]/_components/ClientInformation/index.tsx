"use client";

import ClientWithLocations from "~/app/(protected)/clientele/_types/ClientWithLocations";
import { InformationLine } from "@beatattoos/ui";
import CopyButton from "~/app/(protected)/_components/CopyButton";
import { sortAlternatenames } from "~/app/_utils/alternatename-utilities";
import { useContext, useEffect } from "react";
import { ClienteleContext } from "~/app/(protected)/clientele/_context/ClienteleContext";
import ClientId from "~/app/(protected)/clientele/[id]/_components/ClientInformation/components/ClientId";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";

/**
 * Props for {@link ClientInformation}
 */
interface ClientInformationProps {
  client: ClientWithLocations;
}

/**
 * Client information with copyable fields
 */
export default function ClientInformation(props: ClientInformationProps) {
  const { clients, setClients } = useContext(ClienteleContext);

  useEffect(() => {
    if (props.client && clients.length > 0) {
      const client = clients.find((c) => c.id === props.client.id);

      if (!client) {
        setClients([props.client, ...clients]);
      }
    }
  }, [clients, props.client]);

  return (
    <>
      <header>
        <div className={"mb-2 flex items-center justify-between gap-4"}>
          <h1>
            {props.client.firstName} {props.client.lastName}
          </h1>
          <Link className={"btn-outline__icon md:hidden"} href={"/clientele"}>
            <IconX />
          </Link>
        </div>
        <ClientId id={props.client.id} />
      </header>
      <InformationLine
        className={"mb-4"}
        heading={"Email address"}
        text={props.client.emailAddress}
        appendNode={
          <CopyButton
            value={props.client.emailAddress}
            showText={false}
            className={"rounded-l-none rounded-r-[15px]"}
          />
        }
      />
      <InformationLine
        className={"mb-4"}
        heading={"Country"}
        text={
          props.client.country.alternatenames.sort(sortAlternatenames)[0]
            ?.name ?? props.client.country.name
        }
        appendNode={
          <CopyButton
            value={
              props.client.country.alternatenames.sort(sortAlternatenames)[0]
                ?.name ?? props.client.country.name
            }
            showText={false}
            className={"rounded-l-none rounded-r-[15px]"}
          />
        }
      />
      <InformationLine
        className={"mb-4"}
        heading={"State/province"}
        text={
          props.client.stateProvince.alternatenames.sort(sortAlternatenames)[0]
            ?.name ?? props.client.stateProvince.name
        }
        appendNode={
          <CopyButton
            value={
              props.client.stateProvince.alternatenames.sort(
                sortAlternatenames,
              )[0]?.name ?? props.client.stateProvince.name
            }
            showText={false}
            className={"rounded-l-none rounded-r-[15px]"}
          />
        }
      />
      {props.client.city && (
        <InformationLine
          className={"mb-4"}
          heading={"City"}
          text={
            props.client.city.alternatenames.sort(sortAlternatenames)[0]
              ?.name ?? props.client.city.name
          }
          appendNode={
            <CopyButton
              value={
                props.client.city.alternatenames.sort(sortAlternatenames)[0]
                  ?.name ?? props.client.city.name
              }
              showText={false}
              className={"rounded-l-none rounded-r-[15px]"}
            />
          }
        />
      )}
    </>
  );
}
