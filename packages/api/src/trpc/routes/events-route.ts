import { getUFEventsManager } from "@vibefire/managers/userfacing";
import {
  CoordSchema,
  ModelDatePeriodString,
  ModelEventType,
  ModelEventUpdate,
  tb,
  tbValidator,
  type Pageable,
  type TModelVibefireEvent,
} from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router";
import { wrapManagerReturn, type ApiResponse } from "!api/utils";

export const eventsRouter = router({
  // todo: listUserHighlightsToday
  listSelfAll: authedProcedure.query(({ ctx }) =>
    wrapManagerReturn<Pageable<PartialDeep<TModelVibefireEvent>>>(() => {
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
    .query(({ ctx, input }) =>
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
    .query(({ ctx, input }) =>
      wrapManagerReturn<TModelVibefireEvent>(() =>
        getUFEventsManager().viewEvent({
          userAid: ctx.auth.userId ?? undefined,
          eventId: input.eventId,
          scope: "published",
        }),
      ),
    ),

  viewManage: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
        }),
      ),
    )
    .query(({ ctx, input }) =>
      wrapManagerReturn<TModelVibefireEvent>(() =>
        getUFEventsManager().viewEvent({
          userAid: ctx.auth.userId,
          eventId: input.eventId,
          scope: "manage",
        }),
      ),
    ),

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
    .mutation(({ ctx, input }) =>
      wrapManagerReturn<TModelVibefireEvent>(async () => {
        let eventId: string;
        if (input.fromPreviousEventId) {
          eventId = (
            await getUFEventsManager().createEventFromPrevious({
              userAid: ctx.auth.userId,
              previousEventId: input.fromPreviousEventId,
            })
          ).unwrap();
        } else {
          eventId = (
            await getUFEventsManager().createNewEvent({
              userAid: ctx.auth.userId,
              name: input.name,
              eventType: input.eventType,
            })
          ).unwrap();
        }
        return await getUFEventsManager().viewEvent({
          userAid: ctx.auth.userId,
          eventId,
          scope: "manage",
        });
      }),
    ),

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
    // .output((value) => value as ApiResponse<TModelVibefireEvent>)
    .mutation(({ ctx, input }) =>
      wrapManagerReturn(async () => {
        let eventId: string;
        if (input.fromPreviousEventId) {
          eventId = (
            await getUFEventsManager().createEventFromPrevious({
              userAid: ctx.auth.userId,
              forGroupId: input.groupId,
              previousEventId: input.fromPreviousEventId,
            })
          ).unwrap();
        } else {
          eventId = (
            await getUFEventsManager().createNewEvent({
              userAid: ctx.auth.userId,
              forGroupId: input.groupId,
              name: input.name,
              eventType: input.eventType,
            })
          ).unwrap();
        }
        return await getUFEventsManager().viewEvent({
          userAid: ctx.auth.userId,
          eventId,
          scope: "manage",
        });
      }),
    ),

  update: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
          update: tb.Partial(ModelEventUpdate),
        }),
      ),
    )
    .mutation(({ ctx, input }) =>
      wrapManagerReturn(() =>
        getUFEventsManager().updateEvent({
          userAid: ctx.auth.userId,
          eventId: input.eventId,
          update: input.update,
        }),
      ),
    ),

  updateVisibility: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          eventId: tb.String(),
          update: tb.Union([tb.Literal("hidden"), tb.Literal("published")]),
        }),
      ),
    )
    .mutation(({ ctx, input }) =>
      wrapManagerReturn(() =>
        getUFEventsManager().updateEventVisibility({
          userAid: ctx.auth.userId,
          eventId: input.eventId,
          update: input.update,
        }),
      ),
    ),

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
        }),
      ),
    )
    // .output(
    //   (value) =>
    //     value as {
    //       id: string;
    //       uploadURL: string;
    //     },
    // )
    .mutation(async ({ ctx, input }) =>
      wrapManagerReturn<{
        id: string;
        uploadURL: string;
      }>(() =>
        getUFEventsManager().generateEventImageLink({
          userAid: ctx.auth.userId,
          eventId: input.eventId,
        }),
      ),
    ),

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
    .query(({ ctx, input }) =>
      wrapManagerReturn<TModelVibefireEvent[]>(() =>
        getUFEventsManager().queryEventsInGeoPeriods({
          userAid: ctx.auth.userId ?? undefined,
          query: {
            northEast: input.northEast,
            southWest: input.southWest,
            zoomLevel: 0,
            datePeriod: parseInt(input.fromDate),
          },
        }),
      ),
    ),
});
