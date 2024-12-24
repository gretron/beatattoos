import { headers } from "next/headers";
import { db } from "~/lib/db";

/**
 * To get user by id
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const headersList = headers();
  const authSecret = headersList.get("x-next-auth-secret");

  if (authSecret !== process.env.NEXTAUTH_SECRET) {
    return new Response("You are not allowed to perform this operation", {
      status: 401,
    });
  }

  const id = (await params).id;

  let user;

  try {
    user = await db.user.findUnique({
      where: { id, role: "ADMIN" },
    });
  } catch (e) {
    return new Response("An error occurred while fetching user", {
      status: 500,
    });
  }

  if (user) {
    return Response.json(user);
  }

  return new Response(`User with ID ${id} was not found`, { status: 404 });
}
