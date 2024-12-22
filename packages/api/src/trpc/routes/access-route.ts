import { getAccessManager } from "@vibefire/managers/userfacing";
import {
  tb,
  tbValidator,
  type TModelVibefireMembership,
} from "@vibefire/models";

import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router.js";
import { wrapManagerReturn } from "!api/utils";

export const accessRouter = router({
  joinAccess: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          accessId: tb.String(),
          shareCode: tb.Optional(tb.String()),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return wrapManagerReturn(() => {
        return getAccessManager().joinOrLeaveAccess({
          accessId: input.accessId,
          userAid: ctx.auth.userId,
          shareCode: input.shareCode,
          scope: "join",
        });
      });
    }),
  leaveAccess: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          accessId: tb.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return wrapManagerReturn(() => {
        return getAccessManager().joinOrLeaveAccess({
          accessId: input.accessId,
          userAid: ctx.auth.userId,
          scope: "leave",
        });
      });
    }),
  userMembership: publicProcedure
    .input(
      tbValidator(
        tb.Object({
          accessId: tb.String(),
        }),
      ),
    )
    .query(async ({ input }) => {
      return wrapManagerReturn<TModelVibefireMembership | null>(() => {
        return getAccessManager().membershipOfAccessForUser({
          accessId: input.accessId,
        });
      });
    }),
});
