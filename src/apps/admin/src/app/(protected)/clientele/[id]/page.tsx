import { getCurrentUser } from "~/app/_utils/auth-utilities";
import { db } from "~/lib/db";

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
    where: { id: params.id, role: "CLIENT" },
  });

  console.log(client);

  return <div className={"p-6"}>{JSON.stringify(client, undefined, " ")}</div>;
}
