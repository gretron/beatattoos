import { ReactNode } from "react";
import LayoutWrapper from "~/app/auth/_components/LayoutWrapper";

/**
 * Pages for {@link AuthLayout}
 */
interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Authentication pages layout
 */
export default async function AuthLayout({ children }: AuthLayoutProps) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
