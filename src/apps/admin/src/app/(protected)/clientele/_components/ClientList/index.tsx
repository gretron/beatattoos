"use client";

import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconPlus } from "@tabler/icons-react";
import SearchClientField from "~/app/(protected)/clientele/_components/SearchClientField";
import Link from "next/link";
import ClientListItem from "~/app/(protected)/clientele/_components/ClientList/components/ClientListItem";
import ClientWithLocations from "~/app/(protected)/clientele/_types/ClientWithLocations";
import { ClienteleContext } from "~/app/(protected)/clientele/_context/ClienteleContext";
import ClientListSkeleton from "~/app/(protected)/clientele/_components/ClientList/components/ClientListSkeleton";
import { useInfiniteScroll } from "@beatattoos/ui";
import { getClientsWithLocations } from "~/app/(protected)/clientele/actions";

/**
 * Props for {@link ClientList}
 */
interface ClientListProps {
  children?: ReactNode;
  initialClients: ClientWithLocations[];
}

/**
 * List of clients with basic information
 */
export default function ClientList(props: ClientListProps) {
  const { clients, setClients } = useContext(ClienteleContext);
  const infiniteScrollRef = useRef(null);
  const [clientOffset, setClientOffset] = useState(2);

  const fetchClient = useCallback(async () => {
    const _clients = (
      (await getClientsWithLocations({
        skip: clientOffset * 5,
        take: 5,
      })) as ClientWithLocations[]
    ).filter((c) => !clients.find((cl) => cl.id === c.id));

    setClientOffset((prev) => ++prev);
    setClients([...clients, ..._clients]);

    return _clients;
  }, [clientOffset, clients]);

  const { hasMore, isLoading } = useInfiniteScroll(
    fetchClient,
    infiniteScrollRef.current,
  );

  useEffect(() => {
    setClients(props.initialClients);
  }, []);

  return (
    <article
      className={
        "flex flex-col border-neutral-400 md:overflow-hidden md:border-r"
      }
    >
      <header
        className={
          "grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-4 border-b border-neutral-400 p-6 max-md:hidden"
        }
      >
        <hgroup>
          <h3>Clients</h3>
          <h5 className={"text-neutral-500"}>
            A list of your existing clients
          </h5>
        </hgroup>
        <Link
          className={"btn-outline__icon"}
          href={"/clientele/new"}
          data-testid={"new-client-link"}
        >
          <IconPlus className={"h-5 w-5"} />
        </Link>
        <SearchClientField />
      </header>
      <div className={"grow md:relative"}>
        <ul
          className={
            "relative flex h-full w-full flex-col gap-4 p-6 md:absolute md:overflow-auto"
          }
        >
          {(clients.length === 0 ? props.initialClients : clients).map(
            (user, index) => (
              <ClientListItem key={index} client={user} />
            ),
          )}
          {isLoading &&
            Array.from(Array(5).keys()).map((num, index) => (
              <ClientListSkeleton key={index} />
            ))}
          {hasMore && <div ref={infiniteScrollRef}></div>}
        </ul>
      </div>
    </article>
  );
}
