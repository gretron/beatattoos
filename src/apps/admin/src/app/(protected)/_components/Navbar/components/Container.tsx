"use client";

import React, { ReactNode, useState } from "react";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";

/**
 * Props for {@link Container}
 */
interface ContainerProps {
  children?: ReactNode;
}

/**
 * Container for {@link Navbar}
 */
function Container(props: ContainerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav
      className={
        "group bg-accent-500 p-8 max-md:order-2 max-md:p-6 md:grid md:min-h-screen md:grid-rows-[auto_1fr_auto] md:gap-16"
      }
      data-collapsed={isCollapsed}
    >
      <header className={"flex items-start gap-6 max-md:hidden"}>
        {!isCollapsed && <div className={"d1 text-2xl"}>beatattoos</div>}
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <IconMaximize /> : <IconMinimize />}
        </button>
      </header>
      {props.children}
    </nav>
  );
}

export default Container;
