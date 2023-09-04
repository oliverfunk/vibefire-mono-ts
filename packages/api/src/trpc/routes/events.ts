import { Type as t } from "@sinclair/typebox";

import {
  CoordSchema,
  MapQuerySchema,
  type VibefireEventT,
} from "@vibefire/models";
import { tbValidator } from "@vibefire/utils";

import { authedProcedure, publicProcedure, router } from "../trpc-router";

export const eventsRouter = router({
  positionAddressInfo: authedProcedure
    .input(
      tbValidator(
        t.Object({
          position: CoordSchema,
        }),
      ),
    )
    .output((value) => value as string)
    .query(async ({ ctx, input }) => {
      return await ctx.googleMapsManager.getBestStreetAddressFromPosition(
        input.position,
      );
    }),
  eventForManagement: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as Partial<VibefireEventT> | undefined)
    .query(async ({ ctx, input }) => {
      return await ctx.apiDataQueryManager.eventForManagement(
        ctx.auth,
        input.eventId,
        input.organisationId,
      );
    }),
  createEvent: authedProcedure
    .input(
      tbValidator(
        t.Object({
          title: t.String(),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.apiDataQueryManager.eventCreate(
        ctx.auth,
        input.title,
        input.organisationId,
      );
    }),
  updateDescriptions: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          title: t.Optional(t.String()),
          description: t.Optional(t.String()),
          tags: t.Optional(t.Array(t.String())),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.apiDataQueryManager.eventUpdateDescriptions(
        ctx.auth,
        input.eventId,
        input.title,
        input.description,
        input.tags,
        input.organisationId,
      );
    }),
  updateLocation: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          position: t.Optional(CoordSchema),
          addressDescription: t.Optional(t.String()),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.apiDataQueryManager.eventUpdateLocation(
        ctx.auth,
        input.eventId,
        input.position,
        input.addressDescription,
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
