/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Type as t } from "@sinclair/typebox";

import { MapQuerySchema, type VibefireEventT } from "@vibefire/models";
import { tbValidator } from "@vibefire/utils";

import { v } from "~/trpc/validator";
import { authedProcedure, publicProcedure, router } from "../trpc-router";

export const eventsRouter = router({
  create: authedProcedure
    .input(
      v(
        t.Object({
          title: t.String(),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.apiDataQueryManager.eventCreate(
        ctx.auth,
        input.title,
        input.organisationId,
      );
    }),
  mapQueryPublicEvents: publicProcedure
    .input(tbValidator(MapQuerySchema))
    .output((value) => value as VibefireEventT[])
    .query(async ({ ctx, input }) => {
      return await ctx.apiDataQueryManager.eventsFromMapQuery(input);
    }),
});
