import { IconArrowLeft } from "@tabler/icons-react";
import TokenForm from "~/app/auth/token/_components/TokenForm";
import Link from "next/link";
import PageWrapper from "~/app/auth/_components/PageWrapper";

export default async function TokenPage() {
  return (
    <PageWrapper>
      <div className={"flex h-full max-w-lg flex-col"}>
        <div className={"flex items-end md:flex-grow"}>
          <Link href={"/auth"} className={"btn-outline__icon mb-16"}>
            <IconArrowLeft className={"h-5 w-5"} />
          </Link>
        </div>
        <TokenForm />
        <div className={"flex-grow"}></div>
      </div>
    </PageWrapper>
  );
}
