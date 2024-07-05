import React from "react";
import { signOut } from "~/lib/auth";

/**
 * Props for {@link DashboardPage}
 */
interface DashboardPageProps {}

/**
 * Page for overview dashboard
 */
export default async function DashboardPage(props: DashboardPageProps) {
  return (
    <div>
      <form
        action={async (formData) => {
          "use server";

          await signOut({ redirectTo: "/auth/login" });
        }}
      >
        <button className={"btn-primary"}>Log Out</button>
      </form>
    </div>
  );
}
