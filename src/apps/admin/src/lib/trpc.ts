import { initTRPC, TRPCError } from "@trpc/server";
import { experimental_nextAppDirCaller } from "@trpc/server/adapters/next-app-dir";
import { auth } from "~/lib/auth";
import { ZodError } from "zod";
import { AUTHENTICATION_ERROR } from "~/app/_constants/actionResponses";

interface Meta {
  span: string;
}

export const t = initTRPC.meta<Meta>().create();

/**
 * TRPC procedure for server actions
 */
export const serverActionProcedure = t.procedure.experimental_caller(
  experimental_nextAppDirCaller({
    onError: ({ error }) => {
      if (error.cause instanceof ZodError) {
        error.message = JSON.parse(error.message)[0].message;
      }
    },
  }),
);

/**
 * Action including admin authentication
 */
export const authenticatedAction = serverActionProcedure
  .use(async (opts) => {
    const session = await auth();

    return opts.next({ ctx: { session } });
  })
  .use(async (opts) => {
    if (!opts.ctx.session?.user.id || opts.ctx.session?.user.role !== "ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: AUTHENTICATION_ERROR,
      });
    }

    return opts.next({
      ctx: {
        ...opts.ctx,
        user: { id: opts.ctx.session?.user.id },
      },
    });
  });
