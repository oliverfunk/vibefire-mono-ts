/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Static, Type as t, TSchema } from "@sinclair/typebox";

import {
  CoordSchema,
  MapQuerySchema,
  VibefireEventSchema,
  VibefireEventT,
} from "@vibefire/models";
import { tbValidator } from "@vibefire/utils";

import { v, vv, type Validator } from "~/trpc/validator";
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
    .input(tbValidator(MapQuerySchema))
    .output((value) => value as VibefireEventT[])
    .query(async ({ ctx, input }) => {
      return await ctx.dbServiceManager.eventsFromMapQuery(input);
    }),
});
