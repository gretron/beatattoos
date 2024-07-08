import { ReactNode } from "react";
import { IconBellFilled } from "@tabler/icons-react";

/**
 * Props for {@link TopBar}
 */
interface TopbarProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Application top bar
 */
function TopBar(props: TopbarProps) {
  return (
    <header
      className={`items-center justify-between gap-4 border-b border-neutral-400 p-6 md:flex md:px-10 md:py-6 ${props.className}`}
    >
      <h2>{props.title}</h2>
      <button className={"btn-outline__icon max-md:hidden"}>
        <IconBellFilled className={"h-5 w-5"}>
          <circle
            className={"text-accent-500"}
            r={4}
            cx={20}
            cy={6}
            stroke={"#FFEFD6"}
            strokeWidth={2}
          ></circle>
        </IconBellFilled>
      </button>
      {props.children}
    </header>
  );
}

export default TopBar;
