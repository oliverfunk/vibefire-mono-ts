import { type VibefireGroupT } from "@vibefire/models";
import { tb, tbValidator } from "@vibefire/utils";

import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router.js";

export const groupsRouter = router({
  allGroupsForUser: authedProcedure
    .output((value) => value as VibefireGroupT[])
    .query(async ({ ctx }) => {
      return await ctx.fauna.groupsForUser(ctx.auth);
    }),
  byLinkID: publicProcedure
    .input(
      tbValidator(
        tb.Object({
          linkId: tb.String(),
        }),
      ),
    )
    .output((value) => value as VibefireGroupT)
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.groupByID(ctx.auth, input.linkId);
    }),
});
