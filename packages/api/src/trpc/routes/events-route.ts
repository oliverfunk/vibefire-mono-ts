import { Type as t } from "@sinclair/typebox";
import { type PartialDeep } from "type-fest";

import {
  CoordSchema,
  MapQuerySchema,
  VibefireEventSchema,
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
          linkId: t.String(),
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
        input.linkId,
        input.organisationId,
      );
    }),
  eventForExternalView: publicProcedure
    .input(
      tbValidator(
        t.Object({
          linkId: t.String(),
        }),
      ),
    )
    .output((value) => value as VibefireEventT)
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.publishedEventForExternalView(
        ctx.auth.userId ?? "anon",
        input.linkId,
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
  createEventFromPrevious: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.eventCreateFromPrevious(
        ctx.auth,
        input.eventId,
        input.organisationId,
      );
    }),
  deleteEvent: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.eventDelete(
        ctx.auth,
        input.eventId,
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
  setVisibility: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          organisationId: t.Optional(t.String()),
          visibility: VibefireEventSchema.properties.visibility,
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.eventSetVisibility(
        ctx.auth,
        input.eventId,
        input.visibility,
        input.organisationId,
      );
    }),
  starredOwnedEvents: publicProcedure
    .input(
      tbValidator(
        t.Object({
          onDateIsoNTZ: t.String(),
          isUpcoming: t.Boolean(),
        }),
      ),
    )
    .output((value) => value as VibefireEventT[])
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        return [];
      }
      const res = await ctx.fauna.eventsFromStarredOwnedInPeriodForUser(
        ctx.auth,
        input.onDateIsoNTZ,
        input.isUpcoming,
      );
      return res;
    }),
  mapPositionDatePublicEvents: publicProcedure
    .input(tbValidator(MapQuerySchema))
    .output((value) => value as VibefireEventT[])
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.eventsFromMapQuery(ctx.auth, input);
    }),
});
