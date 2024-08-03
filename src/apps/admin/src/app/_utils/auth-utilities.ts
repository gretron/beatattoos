import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import { Session } from "next-auth";

/**
 * Get current user using session
 */
export async function getCurrentUser(session?: Session) {
  let _session;

  if (!session) {
    _session = await auth();
  } else {
    _session = session;
  }

  let user;

  try {
    user = await db.user.findUnique({
      where: { id: _session?.user?.id, role: "ADMIN" },
    });
  } catch (e) {}

  return user;
}
