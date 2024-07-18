import { ReactNode } from "react";
import { IconPlus } from "@tabler/icons-react";
import SearchClientField from "~/app/(protected)/clientele/_components/SearchClientField";
import Link from "next/link";
import ClientListItem from "~/app/(protected)/clientele/_components/ClientList/components/ClientListItem";
import { getCurrentUser } from "~/app/utils/auth-utilities";
import { db } from "~/lib/db";

/**
 * Props for {@link ClientList}
 */
interface ClientListProps {
  children?: ReactNode;
}

/**
 * List of clients with basic information
 */
export default async function ClientList(props: ClientListProps) {
  const user = await getCurrentUser();
  if (!user) return;

  const users = await db.user.findMany({
    where: { role: "CLIENT" },
    include: {
      country: {
        include: {
          alternatenames: {
            where: {
              isoLanguage: "en",
            },
          },
        },
      },
      stateProvince: {
        include: {
          alternatenames: {
            where: {
              OR: [{ isoLanguage: "en" }, { isoLanguage: "abbr" }],
            },
          },
        },
      },
      city: {
        include: {
          alternatenames: {
            where: {
              isoLanguage: "en",
            },
          },
        },
      },
    },
  });

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
            "flex h-full w-full flex-col gap-4 p-6 md:absolute md:overflow-auto"
          }
        >
          {users.map((user, index) => (
            <ClientListItem key={index} client={user} />
          ))}
        </ul>
      </div>
    </article>
  );
}
