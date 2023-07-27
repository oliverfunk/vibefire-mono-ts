import { authedProcedure, publicProcedure, router } from "../trpc-router";

export const authRouter = router({
  getSession: authedProcedure.query(({ ctx }) => {
    return {
      session: ctx.auth.session,
      user: ctx.auth.user,
      userId: ctx.auth.userId,
      sessionClaims: ctx.auth.sessionClaims,
    };
  }),
  getSecretMessage: authedProcedure.query(() => {
    return "you can see this secret message!";
  }),
});
