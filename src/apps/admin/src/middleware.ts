import { auth as middleware } from "~/lib/auth";

/**
 * Authentication middleware for protected routes
 */
export default middleware((request) => {
  if (!request.auth && !request.nextUrl.pathname.startsWith("/auth")) {
    const url = new URL("/auth", request.nextUrl.origin);

    return Response.redirect(url);
  }

  if (request.auth && request.nextUrl.pathname.startsWith("/auth")) {
    const url = new URL("/dashboard", request.nextUrl.origin);

    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!api|models|_next/static|_next/image|favicon.ico).*)"],
};
