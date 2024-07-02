import PageWrapper from "~/app/auth/_components/PageWrapper";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import LoginForm from "~/app/auth/login/_components/LoginForm";

export default async function LoginPage() {
  return (
    <PageWrapper>
      <div className={"flex h-full max-w-lg flex-col"}>
        <div className={"flex items-end md:flex-grow"}>
          <Link
            href={"/auth"}
            className={"btn-outline btn-outline__icon mb-16"}
          >
            <IconArrowLeft className={"h-5 w-5"} />
          </Link>
        </div>
        <LoginForm />
        <div className={"flex-grow"}></div>
      </div>
    </PageWrapper>
  );
}
