import { getCurrentUser } from "~/app/_utils/auth-utilities";
import { db } from "~/lib/db";
import ClientInformation from "~/app/(protected)/clientele/[id]/_components/ClientInformation";
import ClientWithLocations from "~/app/(protected)/clientele/_types/ClientWithLocations";

/**
 * Page to view client details
 */
export default async function ClientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) return;

  const client = await db.user.findUnique({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      emailAddress: true,
      country: {
        select: {
          name: true,
          alternatenames: {
            where: {
              isoLanguage: "en",
            },
          },
        },
      },
      stateProvince: {
        select: {
          name: true,
          alternatenames: {
            where: {
              isoLanguage: "en",
            },
          },
        },
      },
      city: {
        select: {
          name: true,
          alternatenames: {
            where: {
              isoLanguage: "en",
            },
          },
        },
      },
    },
    where: { id: params.id, role: "CLIENT" },
  });

  if (!client) {
    return;
  }

  return (
    <div
      className={
        "left-0 top-0 h-full w-full p-6 max-md:absolute max-md:z-10 max-md:overflow-auto max-md:bg-primary-500"
      }
    >
      <ClientInformation client={client as ClientWithLocations} />
    </div>
  );
}
