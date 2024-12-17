import { ReactNode } from "react";
import TopBar from "~/app/(protected)/_components/TopBar";
import ClientList from "~/app/(protected)/clientele/_components/ClientList/index";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import SearchClientField from "~/app/(protected)/clientele/_components/SearchClientField";
import { findClientsWithLocations } from "~/app/(protected)/clientele/_utils/clientele-utilities";
import { signOut } from "~/lib/auth";
import ClienteleContextProvider from "~/app/(protected)/clientele/_context/ClienteleContext";

/**
 * Props for {@link ClienteleLayout}
 */
interface ClienteleLayoutProps {
  children?: ReactNode;
  params: { id: string };
}

/**
 * Layout for clientele pages
 */
export default async function ClienteleLayout(props: ClienteleLayoutProps) {
  const clients = await findClientsWithLocations(0, 5);

  if (!clients) {
    await signOut();
    return;
  }

  return (
    <ClienteleContextProvider>
      <section
        className={
          "grid grow grid-rows-[auto_1fr] max-md:relative max-md:h-full md:h-screen"
        }
      >
        <TopBar
          title={"Clientele"}
          className={
            "grid-cols-[1fr_auto] grid-rows-[auto_auto] max-md:grid max-md:gap-4"
          }
        >
          <Link
            className={"btn-outline__icon md:hidden"}
            href={"/clientele/new"}
          >
            <IconPlus className={"h-5 w-5"} />
          </Link>
          <SearchClientField className={"md:hidden"} />
        </TopBar>
        <div className={"overflow-auto md:p-10"}>
          <main
            className={
              "min-h-full grid-cols-[minmax(min-content,_1fr)_2fr] overflow-clip rounded-[40px] border-neutral-400 md:grid md:border"
            }
          >
            <ClientList initialClients={clients} />
            {props.children}
          </main>
        </div>
      </section>
    </ClienteleContextProvider>
  );
}
