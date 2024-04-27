import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router.js";

import { type VibefireGroupT } from "@vibefire/models";

export const groupsRouter = router({
  allGroupsForUser: authedProcedure
    .output((value) => value as VibefireGroupT[])
    .query(async ({ ctx }) => {
      return await ctx.fauna.groupsForUser(ctx.auth);
    }),
});
