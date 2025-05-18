"use client";

import "./styles.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/gallery",
    label: "Gallery",
  },
  {
    href: "/about",
    label: "About",
  },
];

/**
 * Navbar
 * @author David Ano-Trudeau
 */
export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <nav className={"bt-navbar"}>
        <Link className={"bt-navbar__logo"} href={"/"}>
          beatattoos
        </Link>
        <ul className={"bt-navbar__links"}>
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className={`bt-link ${pathname === link.href ? "bt-navbar__link--active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className={"bt-button"}>BOOK NOW</button>
      </nav>
    </>
  );
}
