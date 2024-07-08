"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Props for {@link NavLink}
 */
interface NavLinkProps {
  href: string;
  icon?: ReactNode;
  label?: ReactNode;
}

/**
 * Navigation links for {@link Navbar}
 */
function NavLink(props: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={`font-bold ${pathname.includes(props.href) ? "text-primary-500" : ""} flex gap-4 transition-colors`}
      href={props.href}
    >
      {props.icon}
      <span className={"group-data-[collapsed=true]:hidden max-md:hidden"}>
        {props.label}
      </span>
    </Link>
  );
}

export default NavLink;
