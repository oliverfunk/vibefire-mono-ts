import { Type as t } from "@sinclair/typebox";
import { type PartialDeep } from "type-fest";

import {
  CoordSchema,
  MapQuerySchema,
  type VibefireEventManagementT,
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
    .mutation(async ({ ctx, input }) => {
      return await ctx.googleMapsManager.getBestStreetAddressFromPosition(
        input.position,
      );
    }),
  eventsByUser: authedProcedure
    .input(
      tbValidator(
        t.Object({
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as PartialDeep<VibefireEventT>[])
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.eventsByUser(ctx.auth, input.organisationId);
    }),
  eventForEdit: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as Partial<VibefireEventT>)
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.eventForEdit(
        ctx.auth,
        input.eventId,
        input.organisationId,
      );
    }),
  eventAllInfoForManagement: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output(
      (value) =>
        value as {
          event: VibefireEventT;
          eventManagement: VibefireEventManagementT;
        },
    )
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.eventAllInfoForManagement(
        ctx.auth,
        input.eventId,
        input.organisationId,
      );
    }),
  eventForExternalView: publicProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
        }),
      ),
    )
    .output((value) => value as VibefireEventT)
    .query(async ({ ctx, input }) => {
      let userId = "anon";
      if (ctx.auth.userId) {
        userId = ctx.auth.userId;
      }
      return await ctx.fauna.publishedEventForExternalView(
        userId,
        input.eventId,
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
      return await ctx.fauna.eventCreate(
        ctx.auth,
        input.title,
        input.organisationId,
      );
    }),
  updateEvent: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          organisationId: t.Optional(t.String()),

          title: t.Optional(t.String()),
          description: t.Optional(t.String()),
          tags: t.Optional(t.Array(t.String())),

          position: t.Optional(CoordSchema),
          addressDescription: t.Optional(t.String()),

          timeStartIsoNTZ: t.Optional(t.String()),
          timeEndIsoNTZ: t.Optional(t.Union([t.String(), t.Null()])),

          bannerImageId: t.Optional(t.String()),
          additionalImageIds: t.Optional(t.Array(t.String())),

          timeline: t.Optional(
            t.Array(
              t.Object({
                id: t.String(),
                timeIsoNTZ: t.String(),
                message: t.String(),
              }),
            ),
          ),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.fauna.eventUpdate(
        ctx.auth,
        input.eventId,
        input.organisationId,
        input.title,
        input.description,
        input.tags,
        input.timeStartIsoNTZ,
        input.timeEndIsoNTZ,
        input.position,
        input.addressDescription,
        input.bannerImageId,
        input.additionalImageIds,
        input.timeline,
      );
    }),
  getImageUploadLink: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output(
      (value) =>
        value as {
          id: string;
          uploadURL: string;
        },
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.generateEventImageUploadLink(
        ctx.auth,
        input.eventId,
        input.organisationId,
      );
    }),
  setPublished: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.eventSetPublished(ctx.auth, input.eventId);
    }),
  setUnpublished: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.eventSetUnpublished(ctx.auth, input.eventId);
    }),
  upcomingEvents: publicProcedure
    .input(
      tbValidator(
        t.Object({
          currentIsoNTZ: t.String(),
        }),
      ),
    )
    .output((value) => value as VibefireEventT[])
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        return [];
      }
      return await ctx.fauna.eventsFromUpcoming7DaysForUser(
        ctx.auth,
        input.currentIsoNTZ,
      );
    }),
  maPositionDatePublicEvents: publicProcedure
    .input(tbValidator(MapQuerySchema))
    .output((value) => value as VibefireEventT[])
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.eventsFromMapQuery(ctx.auth, input);
    }),
});
