import { ReactNode } from "react";

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
      <section>{props.children}</section>
    </>
  );
}
