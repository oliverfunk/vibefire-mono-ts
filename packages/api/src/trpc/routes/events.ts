import { Type as t } from "@sinclair/typebox";

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
      return await ctx.apiDataQueryManager.eventForEdit(
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
      return await ctx.apiDataQueryManager.eventAllInfoForManagement(
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
      return await ctx.apiDataQueryManager.eventFromIDByOrganiser(
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
      return await ctx.apiDataQueryManager.publishedEventForExternalView(
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
      return await ctx.apiDataQueryManager.eventUpdateTimes(
        ctx.auth,
        input.eventId,
        input.timeStartIsoNTZ,
        input.timeEndIsoNTZ,
        input.organisationId,
      );
    }),
  uploadBannerImage: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          b64_image: t.String(),
        }),
      ),
    )
    // .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.apiDataQueryManager.eventUpdateUploadBannerImage(
        ctx.imagesManager,
        ctx.auth,
        input.eventId,
        input.b64_image,
      );
    }),
  uploadAdditionalImage: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          b64_image: t.String(),
        }),
      ),
    )
    // .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.apiDataQueryManager.eventUpdateUploadAdditionalImage(
        ctx.imagesManager,
        ctx.auth,
        input.eventId,
        input.b64_image,
      );
    }),
  removeAdditionalImage: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          additionalImageKey: t.String(),
        }),
      ),
    )
    // .output((value) => value as { id: string })
    .mutation(async ({ ctx, input }) => {
      return await ctx.apiDataQueryManager.eventUpdateRemoveAdditionalImage(
        ctx.imagesManager,
        ctx.auth,
        input.eventId,
        input.additionalImageKey,
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
      return await ctx.apiDataQueryManager.eventSetReady(
        ctx.auth,
        input.eventId,
      );
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
      return await ctx.apiDataQueryManager.eventUpdateTimeline(
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
      return await ctx.apiDataQueryManager.eventsFromMapQuery(input);
    }),
});
