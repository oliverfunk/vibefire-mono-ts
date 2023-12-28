import { Type as t } from "@sinclair/typebox";

import { tbValidator } from "@vibefire/utils";

import { authedProcedure, publicProcedure, router } from "../trpc-router";

// These are public becuase you can view an event without being logged in
// not the best
// todo: idk how to fix it but should be fixed
export const userRouter = router({
  starEvent: publicProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          starIt: t.Boolean(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        return;
      }
      return await ctx.fauna.setStarEventForUser(
        ctx.auth,
        input.eventId,
        input.starIt,
      );
    }),
  hideEvent: publicProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          report: t.Boolean(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        return;
      }
      return await ctx.fauna.hideEventForUser(ctx.auth, input.eventId);
    }),
  blockOrganiser: publicProcedure
    .input(
      tbValidator(
        t.Object({
          organiserId: t.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        return;
      }
      return await ctx.fauna.blockOrganiserForUser(ctx.auth, input.organiserId);
    }),
  registerToken: authedProcedure
    .input(
      tbValidator(
        t.Object({
          token: t.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.userRegisterPushToken(ctx.auth, input.token);
    }),
  unregisterToken: authedProcedure.mutation(async ({ ctx }) => {
    return await ctx.fauna.userUnregisterPushToken(ctx.auth);
  }),
});
