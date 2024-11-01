import { getUFUsersManager } from "@vibefire/managers/userfacing";
import { tb, tbValidator } from "@vibefire/models";

import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router.js";

// These are public becuase you can view an event without being logged in
// not the best
// todo: idk how to fix it but should be fixed

export const userRouter = router({
  // starEvent: publicProcedure
  //   .input(
  //     tbValidator(
  //       tb.Object({
  //         eventId: tb.String(),
  //         starIt: tb.Boolean(),
  //       }),
  //     ),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     if (!ctx.auth.userId) {
  //       return;
  //     }
  //     return await getUFUsersManager().setStarEventForUser(
  //       ctx.auth,
  //       input.eventId,
  //       input.starIt,
  //     );
  //   }),
  // hideEvent: publicProcedure
  //   .input(
  //     tbValidator(
  //       tb.Object({
  //         eventId: tb.String(),
  //         report: tb.Boolean(),
  //       }),
  //     ),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     if (!ctx.auth.userId) {
  //       return;
  //     }
  //     return await ctx.fauna.hideEventForUser(ctx.auth, input.eventId);
  //   }),
  // blockOrganiser: publicProcedure
  //   .input(
  //     tbValidator(
  //       tb.Object({
  //         organiserId: tb.String(),
  //       }),
  //     ),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     if (!ctx.auth.userId) {
  //       return;
  //     }
  //     return await ctx.fauna.blockOrganiserForUser(ctx.auth, input.organiserId);
  //   }),
  // registerToken: authedProcedure
  //   .input(
  //     tbValidator(
  //       tb.Object({
  //         token: tb.String(),
  //       }),
  //     ),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     return await ctx.fauna.userRegisterPushToken(ctx.auth, input.token);
  //   }),
  // unregisterToken: authedProcedure.mutation(async ({ ctx }) => {
  //   return await ctx.fauna.userUnregisterPushToken(ctx.auth);
  // }),
});
