import Link from "next/link";
import { IconX } from "@tabler/icons-react";
import { db } from "~/lib/db";
import NewClientForm from "~/app/(protected)/clientele/new/_components/NewClientForm";

/**
 * Page to add new clients
 */
export default async function NewClientPage() {
  const countries = await db.country.findMany({
    orderBy: { name: "asc" },
    include: {
      alternatenames: {
        where: {
          isoLanguage: "en",
        },
      },
    },
  });

  return (
    <main
      className={
        "left-0 top-0 flex h-full w-full flex-col p-6 max-md:absolute max-md:z-10 max-md:overflow-auto max-md:bg-primary-500"
      }
    >
      <header className={"mb-4 flex items-center justify-between gap-4"}>
        <h2 className={""}>New Client</h2>
        <Link className={"btn-outline__icon md:hidden"} href={"/clientele"}>
          <IconX />
        </Link>
      </header>
      <NewClientForm countries={countries} />
    </main>
  );
}
