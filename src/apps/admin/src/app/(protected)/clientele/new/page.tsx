import ClientForm from "~/app/(protected)/clientele/_components/ClientForm";
import { AlertType } from "@beatattoos/ui";
import Link from "next/link";
import { IconX } from "@tabler/icons-react";
import { createClient } from "~/app/(protected)/clientele/new/actions";
import { db } from "~/lib/db";

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
      <header className={"flex justify-between gap-4"}>
        <h2 className={"mb-4"}>New Client</h2>
        <Link className={"btn-outline__icon md:hidden"} href={"/clientele"}>
          <IconX />
        </Link>
      </header>
      <ClientForm
        action={createClient}
        countries={countries}
        alert={{
          type: AlertType.warning,
          message: "You must transmit the entered password to the client",
        }}
      />
    </main>
  );
}
