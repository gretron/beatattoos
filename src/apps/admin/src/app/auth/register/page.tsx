import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageWrapper from "~/app/auth/_components/PageWrapper";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import RegisterForm from "~/app/auth/register/_components/RegisterForm";
import { db } from "~/lib/db";

/**
 * Page for admin user registration
 */
export default async function RegisterPage() {
  const cookieStore = cookies();

  if (!cookieStore.get("adminToken")) {
    redirect("/auth");
  }

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
    <PageWrapper>
      <div className={"flex h-full max-w-lg flex-col"}>
        <div className={"flex items-end md:flex-grow"}>
          <Link
            href={"/auth/token"}
            className={"btn-outline btn-outline__icon mb-16"}
          >
            <IconArrowLeft className={"h-5 w-5"} />
          </Link>
        </div>
        <RegisterForm countries={countries} />
        <div className={"flex-grow"}></div>
      </div>
    </PageWrapper>
  );
}
