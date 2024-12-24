import { DefaultSession, NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/lib/db";
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { loginFormSchema } from "~/app/auth/login/_constants/schemas";
import bcrypt from "bcryptjs";
import { Role, User } from "@beatattoos/db";
import { decode, encode } from "next-auth/jwt";
import { JWTSessionError } from "@auth/core/errors";

declare module "next-auth" {
  interface User {
    id?: string;
    role: Role;
    refreshToken: string;
    accessToken: string;
    refreshTokenVersion: number;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      refreshToken?: string;
      accessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role: Role;
    refreshToken?: string;
    accessToken?: string;
  }
}

/**
 * Refresh token data
 */
interface RefreshToken {
  userId: string;
  refreshTokenVersion: number;
}

/**
 * Access token data
 */
interface AccessToken {
  userId: string;
}

/**
 * To create refresh token
 * @param user user to create refresh token with
 */
async function createRefreshToken(user: User) {
  return await encode({
    token: {
      userId: user.id,
      refreshTokenVersion: user.refreshTokenVersion,
    },
    secret: process.env.NEXTAUTH_SECRET!,
    salt: "*",
  });
}

/**
 * To create access token
 * @param user user to create access token with
 */
async function createAccessToken(user: User) {
  return await encode({
    token: {
      userId: user.id,
      refreshTokenVersion: user.refreshTokenVersion,
    },
    secret: process.env.NEXTAUTH_SECRET!,
    salt: "*",
    maxAge: 15 * 60,
  });
}

export default {
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      }

      try {
        await decode({
          token: token.accessToken!,
          secret: process.env.NEXTAUTH_SECRET!,
          salt: "*",
        });

        return token;
      } catch (e) {
        console.error("[ERROR]: Access token is invalid");
      }

      let refreshToken;

      try {
        refreshToken = <RefreshToken>await decode({
          token: token.refreshToken!,
          secret: process.env.NEXTAUTH_SECRET!,
          salt: "*",
        });
      } catch (e) {
        console.error("[ERROR]: Refresh token is invalid");
        throw new JWTSessionError("Refresh token has expired or is invalid");
      }

      let _user;
      const headers = new Headers();
      headers.append("x-next-auth-secret", process.env.NEXTAUTH_SECRET!);

      try {
        _user = <User>await (
          await fetch(
            `${process.env.NEXTAUTH_URL}/api/users/${refreshToken.userId}`,
            {
              headers,
            },
          )
        ).json();
      } catch (e) {
        console.error("[ERROR]: An error occurred while fetching/parsing user");
        throw e;
      }

      if (
        !_user ||
        _user.refreshTokenVersion !== refreshToken.refreshTokenVersion
      ) {
        console.error("[ERROR]: Refresh token versions do not match");
        throw new JWTSessionError("Refresh token versions do not match");
      }

      const _refreshToken = await createRefreshToken(_user);
      const _accessToken = await createAccessToken(_user);

      return {
        ...token,
        refreshToken: _refreshToken,
        accessToken: _accessToken,
      };
    },
    async session({ session, token }) {
      session.user.id = token.id!;
      session.user.role = token.role;

      return session;
    },
    async authorized({ auth }) {
      return !!auth;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        emailAddress: { label: "Email address" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedData = loginFormSchema.safeParse(credentials);

        if (!parsedData.success) {
          throw Error();
        }

        const { emailAddress, password } = parsedData.data;

        let user;

        try {
          user = await db.user.findUnique({
            where: { emailAddress: emailAddress as string },
          });
        } catch (e) {
          throw new Error();
        }

        if (!user || !user.password || user.role === "CLIENT") {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password as string,
          user.password,
        );

        if (!passwordsMatch) {
          return null;
        }

        const refreshToken = await createRefreshToken(user);
        const accessToken = await createAccessToken(user);

        return { ...user, refreshToken, accessToken };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig;
