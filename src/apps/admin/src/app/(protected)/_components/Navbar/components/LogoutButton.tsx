import React from "react";
import { signOut } from "~/lib/auth";
import { IconLogout } from "@tabler/icons-react";

/**
 * Button to log out of current account
 */
function LogoutButton() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signOut({ redirectTo: "/auth/login" });
      }}
    >
      <button className={`flex w-full gap-4 font-bold transition-colors`}>
        <IconLogout />
        <span className={"group-data-[collapsed=true]:hidden max-md:hidden"}>
          Logout
        </span>
      </button>
    </form>
  );
}

export default LogoutButton;
