import { Type as t } from "@sinclair/typebox";

import { tbValidator } from "@vibefire/utils";

import { authedProcedure, publicProcedure, router } from "../trpc-router";

export const userRouter = router({
  hideEvent: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          report: t.Boolean(),
        }),
      ),
    )
    .output((value) => value as boolean)
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.hideEventForUser(ctx.auth, input.eventId);
    }),
  blockOrganiser: authedProcedure
    .input(
      tbValidator(
        t.Object({
          organiserId: t.String(),
        }),
      ),
    )
    .output((value) => value as boolean)
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.blockOrganiserForUser(ctx.auth, input.organiserId);
    }),
});
