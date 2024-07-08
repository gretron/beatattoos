import { ReactNode } from "react";
import { IconPlus } from "@tabler/icons-react";
import SearchClientField from "~/app/(protected)/clientele/_components/SearchClientField";
import Link from "next/link";

/**
 * Props for {@link ClientList}
 */
interface ClientListProps {
  children?: ReactNode;
}

function ClientList(props: ClientListProps) {
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
        <ul className={"h-full w-full p-6 md:absolute md:overflow-auto"}>
          {[...Array(30).keys()].map((num) => (
            <li key={num}>Client {num}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default ClientList;
