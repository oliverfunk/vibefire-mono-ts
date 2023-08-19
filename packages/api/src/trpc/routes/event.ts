import { Type as t } from "@sinclair/typebox";

import {
  CoordSchema,
  MapQuerySchema,
  VibefireEventSchema,
} from "@vibefire/models";

import { v } from "~/trpc/validator";
import { authedProcedure, publicProcedure, router } from "../trpc-router";

export const eventsRouter = router({
  create: authedProcedure
    .input(
      v(
        t.Object({
          title: t.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      //   await doAddPublicEvent(ctx.faunaClient, {
      //     name: input.name,
      //   });
    }),
  mapQueryPublicEvents: publicProcedure
    .input(v(MapQuerySchema))
    // .output(v(t.Array(VibefireEventSchema)))
    .query(async ({ ctx, input }) => {
      console.log("eventCreateTwo", ctx.dbServiceManager.eventCreateTwo(2));

      return await ctx.dbServiceManager.eventsFromMapQuery(input);
    }),
});
