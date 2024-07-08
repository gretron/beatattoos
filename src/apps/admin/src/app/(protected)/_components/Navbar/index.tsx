import React from "react";
import NavLink from "~/app/(protected)/_components/Navbar/components/NavLink";
import { IconLayout, IconLogout, IconUsers } from "@tabler/icons-react";
import Container from "~/app/(protected)/_components/Navbar/components/Container";
import { signOut } from "~/lib/auth";
import LogoutButton from "~/app/(protected)/_components/Navbar/components/LogoutButton";

/**
 * Application navbar
 */
function Navbar() {
  return (
    <Container>
      <ul className={"flex gap-8 max-md:justify-between md:flex-col"}>
        <li>
          <NavLink
            href={"/dashboard"}
            icon={<IconLayout />}
            label={"Dashboard"}
          />
        </li>
        <li>
          <NavLink
            href={"/clientele"}
            icon={<IconUsers />}
            label={"Clientele"}
          />
        </li>
        <li className={"md:hidden"}>
          <LogoutButton />
        </li>
      </ul>
      <ul className={"max-md:hidden"}>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </Container>
  );
}

export default Navbar;
