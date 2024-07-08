import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

/**
 * To verify if current user is authenticated
 */
export async function authenticate() {
  const currentUser = await auth();

  if (!currentUser?.user) {
    throw new Error();
  }

  let user;

  try {
    user = await db.user.findUnique({ where: { id: currentUser.user.id } });
  } catch (e) {
    throw new Error();
  }

  if (!user || user.role !== "ADMIN") {
    throw new Error();
  }

  return true;
}
