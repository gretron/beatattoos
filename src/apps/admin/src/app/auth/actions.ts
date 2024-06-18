"use server";

import { registerFormSchemaRefined, tokenFormSchema } from "~/app/auth/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { db } from "~/lib/db";

/**
 * Action to verify administrator token validity
 * @param formData token form data {@link tokenFormSchema}
 */
export async function verifyToken(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsedData = tokenFormSchema.safeParse(data);

  // Check for data formatting errors
  if (!parsedData.success) {
    return { error: "An error occurred while parsing the token" };
  }

  // Check if entered token corresponds to the admin token
  if (parsedData.data.adminToken !== process.env.ADMIN_TOKEN) {
    return { error: "Entered token does not correspond to the admin token" };
  }

  // Store validated token as a cookie to be used to register
  const cookieStore = cookies();
  cookieStore.set("adminToken", parsedData.data.adminToken, { path: "/auth" });

  redirect("/auth/register");
}

/**
 * Action to register new administrator account
 * @param formData register form data {@link registerFormSchema}
 */
export async function register(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsedData = registerFormSchemaRefined.safeParse(data);

  // Check for data formatting errors
  if (!parsedData.success) {
    return { error: "An error occurred while parsing the credentials" };
  }

  // Retrieve admin token
  const cookieStore = cookies();
  const adminToken = cookieStore.get("adminToken");

  // If admin token does not correspond, redirect to token page
  if (adminToken?.value !== process.env.ADMIN_TOKEN) {
    redirect(
      "/auth/token?message=Entered%20token%20does%20not%20correspond%20to%20the%20admin%20token",
    );
    return; // For integration test
  }

  let adminUserExists;

  try {
    adminUserExists = await db.user.findFirst({
      where: { role: "ADMIN" },
    });
  } catch (e) {
    return {
      error:
        "An error occurred while checking for an existing administrator account",
    };
  }

  if (adminUserExists) {
    return { error: `The administrator user already exists` };
  }

  // TODO: Remove check to allow multiple users in the future if necessary

  const { firstName, lastName, emailAddress, password } = parsedData.data;

  let emailInUse;

  try {
    emailInUse = await db.user.findUnique({ where: { emailAddress } });
  } catch (e) {
    return { error: "An error occurred while checking for email availability" };
  }

  if (emailInUse) {
    return { error: `Email address is already in use` };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.create({
      data: {
        role: "ADMIN",
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
      },
    });
  } catch (e) {
    return { error: "An error occurred while creating the admin user" };
  }

  redirect(
    "/auth/login?message=Administrator%20account%20was%20successfully%20created",
  );
}
