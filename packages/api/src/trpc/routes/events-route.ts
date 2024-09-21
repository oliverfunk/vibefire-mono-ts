import {
  CoordSchema,
  ModelDatePeriodString,
  ModelEventType,
  ModelEventUpdate,
  type Pageable,
  type TModelVibefireEvent,
} from "@vibefire/models";
import { tb, tbValidator, type PartialDeep } from "@vibefire/utils";

import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router";
import { wrapManagerReturn, type ApiResponse } from "!api/utils";

import { getUFEventsManager } from "../../../../managers/src/userfacing/uf-events-manager";

export const eventsRouter = router({
  // positionAddressInfo: authedProcedure
  //   .input(
  //     tbValidator(
  //       t.Object({
  //         position: CoordSchema,
  //       }),
  //     ),
  //   )
  //   .output((value) => value as string)
  //   .mutation(async ({ ctx, input }) => {
  //     return await ctx.googleMapsManager.getBestStreetAddressFromPosition(
  //       input.position,
  //     );
  //   }),

  // todo: listUserHighlightsToday
  // starredOwnedEvents: publicProcedure
  //   .input(
  //     tbValidator(
  //       t.Object({
  //         onDateIsoNTZ: t.String(),
  //         isUpcoming: t.Boolean(),
  //       }),
  //     ),
  //   )
  //   .output((value) => value as VibefireEventT[])
  //   .query(async ({ ctx, input }) => {
  //     if (!ctx.auth.userId) {
  //       return [];
  //     }
  //     const res = await ctx.fauna.eventsFromStarredOwnedInPeriodForUser(
  //       ctx.auth,
  //       input.onDateIsoNTZ,
  //       input.isUpcoming,
  //     );
  //     return res;
  //   }),

  listSelfAll: authedProcedure.query(({ ctx }) =>
    wrapManagerReturn(() => {
      return getUFEventsManager().eventsUserIsPart({
        userAid: ctx.auth.userId,
      });
    }),
  ),

  listGroupAll: authedProcedure
    .input(tbValidator(tb.Object({ groupId: tb.String() })))
    // .output(
    //   (value) => value as ApiReturn<Pageable<PartialDeep<TModelVibefireEvent>>>,
    // )
    .query(({ ctx, input }) =>
      wrapManagerReturn(() =>
        getUFEventsManager().eventsOwnedByGroup({
          userAid: ctx.auth.userId,
          groupId: input.groupId,
          scope: "all",
        }),
      ),
    ),

  listGroupPublished: publicProcedure
    .input(
      tbValidator(
        tb.Object({
          groupId: tb.String(),
        }),
      ),
    )
    .output(
      (value) =>
        value as ApiResponse<Pageable<PartialDeep<TModelVibefireEvent>>>,
    )
    .query(async ({ ctx, input }) =>
      wrapManagerReturn(() =>
        getUFEventsManager().eventsOwnedByGroup({
          userAid: ctx.auth.userId ?? undefined,
          groupId: input.groupId,
          scope: "published",
        }),
      ),
    ),

  viewPublished: publicProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
        }),
      ),
    )
    .output((value) => value as TModelVibefireEvent)
    .query(async ({ ctx, input }) => {
      return await getUFEventsManager().viewEvent({
        userAid: ctx.auth.userId ?? undefined,
        eventId: input.eventId,
        scope: "published",
      });
    }),

  viewManage: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
        }),
      ),
    )
    .output((value) => value as TModelVibefireEvent)
    .query(async ({ ctx, input }) => {
      return await getUFEventsManager().viewEvent({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
        scope: "manage",
      });
    }),

  createForSelf: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          name: tb.String(),
          fromPreviousEventId: tb.Optional(tb.String()),
          eventType: tb.Union(
            ModelEventType.anyOf.map((e) => e.properties.type),
          ),
        }),
      ),
    )
    .output((value) => value as PartialDeep<TModelVibefireEvent>)
    .mutation(async ({ ctx, input }) => {
      let eventId: string;
      if (input.fromPreviousEventId) {
        eventId = await getUFEventsManager().createEventFromPrevious({
          userAid: ctx.auth.userId,
          previousEventId: input.fromPreviousEventId,
        });
      } else {
        eventId = await getUFEventsManager().createNewEvent({
          userAid: ctx.auth.userId,
          name: input.name,
          eventType: input.eventType,
        });
      }
      return await getUFEventsManager().viewEvent({
        userAid: ctx.auth.userId,
        eventId,
        scope: "manage",
      });
    }),

  createForGroup: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          name: tb.String(),
          groupId: tb.String(),
          eventType: tb.Union(
            ModelEventType.anyOf.map((e) => e.properties.type),
          ),
          fromPreviousEventId: tb.Optional(tb.String()),
        }),
      ),
    )
    .output((value) => value as PartialDeep<TModelVibefireEvent>)
    .mutation(async ({ ctx, input }) => {
      let eventId: string;
      if (input.fromPreviousEventId) {
        eventId = await getUFEventsManager().createEventFromPrevious({
          userAid: ctx.auth.userId,
          forGroupId: input.groupId,
          previousEventId: input.fromPreviousEventId,
        });
      } else {
        eventId = await getUFEventsManager().createNewEvent({
          userAid: ctx.auth.userId,
          forGroupId: input.groupId,
          name: input.name,
          eventType: input.eventType,
        });
      }
      return await getUFEventsManager().viewEvent({
        userAid: ctx.auth.userId,
        eventId,
        scope: "manage",
      });
    }),

  update: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
          update: tb.Partial(ModelEventUpdate),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await getUFEventsManager().updateEvent({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
        update: input.update,
      });
    }),

  updateVisibility: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
          update: tb.Union([tb.Literal("hidden"), tb.Literal("published")]),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await getUFEventsManager().updateEventVisibility({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
        update: input.update,
      });
    }),

  // updateLinkId: authedProcedure
  //   .input(
  //     tbValidator(
  //       tb.Object({
  //         eventId: tb.String(),
  //         update: tb.Union([tb.Literal("remove"), tb.Literal("regenerate")]),
  //       }),
  //     ),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     return await ctx.eventsManager.up({
  //       userAid: ctx.auth.userId,
  //       eventId: input.eventId,
  //       update: input.update,
  //     });
  //   }),

  delete: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await getUFEventsManager().deleteEvent({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
      });
    }),

  createImageUploadLink: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
          organisationId: tb.Optional(tb.String()),
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
      return await getImagesManger().generateEventImageUploadLink(
        ctx.auth,
        input.eventId,
        input.organisationId,
      );
    }),

  queryGeoPeriods: publicProcedure
    .input(
      tbValidator(
        tb.Object({
          northEast: CoordSchema,
          southWest: CoordSchema,
          fromDate: ModelDatePeriodString,
          toDate: tb.Optional(ModelDatePeriodString),
        }),
      ),
    )
    .output((value) => value as TModelVibefireEvent[])
    .query(async ({ ctx, input }) => {
      return await getUFEventsManager().queryEventsInGeoPeriods({
        userAid: ctx.auth.userId ?? undefined,
        query: {
          northEast: input.northEast,
          southWest: input.southWest,
          zoomLevel: 0,
          datePeriod: parseInt(input.fromDate),
        },
      });
    }),
});
