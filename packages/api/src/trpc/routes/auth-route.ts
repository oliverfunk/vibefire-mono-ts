import { getUFUsersManager } from "@vibefire/managers/userfacing";
import { type AppUserState } from "@vibefire/models";

import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router.js";

export const authRouter = router({
  getSession: publicProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    let session: AppUserState;
    if (!userId) {
      session = {
        state: "unauthenticated",
        anonId: "anon", // this will change in the future to an identifier
      };
    } else {
      const userInfo = await getUFUsersManager().getUserProfileWithRetry(
        userId,
        3,
      );
      session = {
        state: "authenticated",
        userId: ctx.auth.userId,
        userInfo,
      };
    }
    return session;
  }),
  deleteAccount: authedProcedure.mutation(async ({ ctx }) => {
    await getUFUsersManager().deleteUserAccount(ctx.auth.userId);
  }),
});
