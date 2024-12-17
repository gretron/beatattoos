import { initTRPC, TRPCError } from "@trpc/server";
import { experimental_nextAppDirCaller } from "@trpc/server/adapters/next-app-dir";
import { auth } from "~/lib/auth";
import { getCurrentUser } from "~/app/_utils/auth-utilities";

interface Meta {
  span: string;
}

export const t = initTRPC.meta<Meta>().create();

/**
 * TRPC procedure for server actions
 */
const serverActionProcedure = t.procedure
  .experimental_caller(experimental_nextAppDirCaller({}))
  .use(async (opts) => {
    const session = await auth();

    return opts.next({ ctx: { session } });
  });

/**
 * Action including admin authentication
 */
export const authenticatedAction = serverActionProcedure.use(async (opts) => {
  if (!opts.ctx.session?.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not allowed to perform this operation",
    });
  }

  const user = getCurrentUser(opts.ctx.session);

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not allowed to perform this operation",
    });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user,
    },
  });
});
