import { DefaultSession, NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/lib/db";
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { loginFormSchema } from "~/app/auth/login/_constants/schemas";
import bcrypt from "bcryptjs";
import { Role } from "@beatattoos/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } /* & DefaultSession["user"]; */;
  }
}

export default {
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;

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

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password as string,
          user.password,
        );

        if (!passwordsMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig;
