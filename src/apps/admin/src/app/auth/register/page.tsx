import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageWrapper from "~/app/auth/_components/PageWrapper";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import RegisterForm from "~/app/auth/register/_components/RegisterForm";

export default async function AuthPage() {
  const cookieStore = cookies();

  if (!cookieStore.get("adminToken")) {
    redirect("/auth");
  }

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
        <RegisterForm />
        <div className={"flex-grow"}></div>
      </div>
    </PageWrapper>
  );
}
