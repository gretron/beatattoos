import { initTRPC, TRPCError } from "@trpc/server";
import { experimental_nextAppDirCaller } from "@trpc/server/adapters/next-app-dir";
import { auth } from "~/lib/auth";
import { getCurrentUser } from "~/app/_utils/auth-utilities";
import { ZodError } from "zod";
import { AUTHENTICATION_ERROR } from "~/app/_constants/actionResponses";

interface Meta {
  span: string;
}

export const t = initTRPC.meta<Meta>().create();

/**
 * TRPC procedure for server actions
 */
const serverActionProcedure = t.procedure
  .experimental_caller(
    experimental_nextAppDirCaller({
      onError: ({ error }) => {
        if (error.cause instanceof ZodError) {
          error.message = JSON.parse(error.message)[0].message;
        }
      },
    }),
  )
  .use(async (opts) => {
    const session = await auth();

    return opts.next({ ctx: { session } });
  });

/**
 * Action including admin authentication
 */
export const authenticatedAction = serverActionProcedure.use(async (opts) => {
  if (!opts.ctx.session?.user.id || opts.ctx.session?.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: AUTHENTICATION_ERROR,
    });
  }

  const user = getCurrentUser(opts.ctx.session);

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: AUTHENTICATION_ERROR,
    });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user,
    },
  });
});
