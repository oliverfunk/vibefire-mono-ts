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
    .query(async ({ ctx, input }) => {
      return await ctx.googleMapsManager.getBestStreetAddressFromPosition(
        input.position,
      );
    }),
  eventsByOrganiser: authedProcedure
    .input(
      tbValidator(
        t.Object({
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as PartialDeep<VibefireEventT>[])
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.eventsByOrganiser(ctx.auth, input.organisationId);
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
  eventForReadyPreview: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as VibefireEventT)
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.eventFromIDByOrganiser(
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
      return await ctx.fauna.eventUpdateDescriptions(
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
      return await ctx.fauna.eventUpdateLocation(
        ctx.auth,
        input.eventId,
        input.position,
        input.addressDescription,
        input.organisationId,
      );
    }),
  updateTimes: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          timeStartIsoNTZ: t.Optional(t.String()),
          timeEndIsoNTZ: t.Optional(t.Union([t.String(), t.Null()])),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.eventUpdateTimes(
        ctx.auth,
        input.eventId,
        input.timeStartIsoNTZ,
        input.timeEndIsoNTZ,
        input.organisationId,
      );
    }),
  updateImages: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          bannerImageId: t.Optional(t.String()),
          additionalImageIds: t.Optional(t.Array(t.String())),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.eventUpdateImages(
        ctx.auth,
        input.eventId,
        input.bannerImageId,
        input.additionalImageIds,
        input.organisationId,
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
  setReady: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.eventSetReady(ctx.auth, input.eventId);
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
  updateTimeline: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          timeline: t.Array(
            t.Object({
              id: t.String(),
              timeIsoNTZ: t.String(),
              message: t.String(),
            }),
          ),
          organisationId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.fauna.eventUpdateTimeline(
        ctx.auth,
        input.eventId,
        input.timeline,
        input.organisationId,
      );
    }),
  mapQueryPublicEvents: publicProcedure
    .input(tbValidator(MapQuerySchema))
    .output((value) => value as VibefireEventT[])
    .query(async ({ ctx, input }) => {
      return await ctx.fauna.eventsFromMapQuery(input);
    }),
});
