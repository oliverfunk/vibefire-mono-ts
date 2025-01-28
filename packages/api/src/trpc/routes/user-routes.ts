import { getUFUsersManager } from "@vibefire/managers/userfacing";
import { tb, tbValidator } from "@vibefire/models";

import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router.js";
import { wrapApiReturn } from "!api/utils";

export const userRouter = router({
  hideEvent: publicProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
        }),
      ),
    )
    .mutation(({ ctx, input }) =>
      wrapApiReturn(async () => {
        if (!ctx.auth.userId) {
          return;
        }
        (
          await getUFUsersManager().hideEventForUser(
            ctx.auth.userId,
            input.eventId,
          )
        ).unwrap();
      }),
    ),
  blockAndReportOrganiser: publicProcedure
    .input(
      tbValidator(
        tb.Object({
          ownershipId: tb.String(),
        }),
      ),
    )
    .mutation(({ ctx, input }) =>
      wrapApiReturn(async () => {
        if (!ctx.auth.userId) {
          return;
        }
        (
          await getUFUsersManager().hideOwnerForUser(
            ctx.auth.userId,
            input.ownershipId,
          )
        ).unwrap();
      }),
    ),
  registerToken: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          token: tb.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) =>
      wrapApiReturn(async () => {
        if (!ctx.auth.userId) {
          return;
        }
        (
          await getUFUsersManager().userRegisterPushToken(
            ctx.auth.userId,
            input.token,
          )
        ).unwrap();
      }),
    ),
  unregisterToken: authedProcedure.mutation(async ({ ctx }) => {
    return wrapApiReturn(async () => {
      if (!ctx.auth.userId) {
        return;
      }
      (
        await getUFUsersManager().userUnregisterPushToken(ctx.auth.userId)
      ).unwrap();
    });
  }),
});
