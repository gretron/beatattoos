import { ReactNode } from "react";
import Navbar from "~/app/(protected)/_components/Navbar";

/**
 * Props for {@link ProtectedLayout}
 */
interface ProtectedLayoutProps {
  children: ReactNode;
}

/**
 * Layout for protected pages
 */
export default async function ProtectedLayout(props: ProtectedLayoutProps) {
  return (
    <>
      <section
        className={
          "flex max-md:grid max-md:h-dvh max-md:grid-rows-[minmax(0,_1fr)_auto]"
        }
      >
        <Navbar />
        <div className={"grow"}>{props.children}</div>
      </section>
    </>
  );
}
