import { type AppUserState } from "@vibefire/models";

import { authedProcedure, publicProcedure, router } from "../trpc-router";

export const authRouter = router({
  getSession: publicProcedure.mutation(async ({ ctx }) => {
    let session: AppUserState;
    if (!ctx.auth.userId) {
      session = {
        state: "unauthenticated",
        anonId: "anon",
      };
    } else {
      const userInfo = await ctx.fauna.getUserInfo(ctx.auth);
      session = {
        state: "authenticated",
        userId: ctx.auth.userId,
        userInfo,
      };
    }
    return session;
  }),
  deleteAccount: authedProcedure.mutation(async ({ ctx }) => {
    await ctx.fauna.deleteUserAccount(ctx.auth);
  }),
});
