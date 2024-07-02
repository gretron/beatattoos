import React from "react";
import { signOut } from "~/lib/auth";

export default async function DashboardPage(props: any) {
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
