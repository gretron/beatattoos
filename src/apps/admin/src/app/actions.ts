"use server";

import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

/**
 * Action to get current user using session
 */
export async function getCurrentUser() {
  const session = await auth();

  let user;

  try {
    user = await db.user.findUnique({
      where: { id: session?.user?.id, role: "ADMIN" },
    });
  } catch (e) {}

  if (user) {
    return user;
  }
}
