import { Type as t } from "@sinclair/typebox";
import { type PartialDeep } from "type-fest";

import {
  CoordSchema,
  type Pageable,
  type TModelVibefireEvent,
} from "@vibefire/models";
import { tbValidator } from "@vibefire/utils";

import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router";
import { wrapManagerReturn, type ApiReturn } from "!api/utils";

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
      return ctx.eventsManager.eventsByUser({
        userAid: ctx.auth.userId,
      });
    }),
  ),

  listGroupAll: authedProcedure
    .input(tbValidator(t.Object({ groupId: t.String() })))
    // .output(
    //   (value) => value as ApiReturn<Pageable<PartialDeep<TModelVibefireEvent>>>,
    // )
    .query(({ ctx, input }) =>
      wrapManagerReturn(() =>
        ctx.eventsManager.eventsByGroup({
          userAid: ctx.auth.userId,
          groupId: input.groupId,
          scope: "all",
        }),
      ),
    ),

  listGroupPublished: publicProcedure
    .input(
      tbValidator(
        t.Object({
          groupId: t.String(),
        }),
      ),
    )
    .output(
      (value) => value as ApiReturn<Pageable<PartialDeep<TModelVibefireEvent>>>,
    )
    .query(async ({ ctx, input }) =>
      wrapManagerReturn(() =>
        ctx.eventsManager.eventsByGroup({
          userAid: ctx.auth.userId ?? undefined,
          groupId: input.groupId,
          scope: "published",
        }),
      ),
    ),

  listPartOfPlanPublished: publicProcedure // todo: needs work
    .input(
      tbValidator(
        t.Object({
          planId: t.String(),
        }),
      ),
    )
    // .output(
    //   (value) => value as ApiReturn<Pageable<PartialDeep<TModelVibefireEvent>>>,
    // )
    .query(({ ctx, input }) =>
      wrapManagerReturn(() =>
        ctx.eventsManager.eventsPartOf({
          userAid: ctx.auth.userId ?? undefined,
          planId: input.planId,
          scope: "published",
        }),
      ),
    ),

  listPartOfPlanAll: authedProcedure
    .input(
      tbValidator(
        t.Object({
          planId: t.String(),
        }),
      ),
    )
    .output((value) => value as PartialDeep<TModelVibefireEvent>[])
    .query(async ({ ctx, input }) => {
      return await ctx.eventsManager.byPartOf({
        userAid: ctx.auth.userId,
        planId: input.planId,
        scope: "all",
      });
    }),

  viewPublished: publicProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
        }),
      ),
    )
    .output((value) => value as TModelVibefireEvent)
    .query(async ({ ctx, input }) => {
      return await ctx.eventsManager.view({
        userAid: ctx.auth.userId ?? undefined,
        eventId: input.eventId,
        scope: "published",
      });
    }),

  viewManage: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
        }),
      ),
    )
    .output((value) => value as TModelVibefireEvent)
    .query(async ({ ctx, input }) => {
      return await ctx.eventsManager.view({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
        scope: "manage",
      });
    }),

  createForSelf: authedProcedure
    .input(
      tbValidator(
        t.Object({
          title: t.String(),
          fromPreviousEventId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as PartialDeep<TModelVibefireEvent>)
    .mutation(async ({ ctx, input }) => {
      let eventId: string;
      if (input.fromPreviousEventId) {
        eventId = await ctx.eventsManager.createFromPrevious({
          userAid: ctx.auth.userId,
          previousEventId: input.fromPreviousEventId,
        });
      } else {
        eventId = await ctx.eventsManager.create({
          userAid: ctx.auth.userId,
          title: input.title,
        });
      }
      return await ctx.eventsManager.view({
        userAid: ctx.auth.userId,
        eventId,
        scope: "manage",
      });
    }),

  createForGroup: authedProcedure
    .input(
      tbValidator(
        t.Object({
          title: t.String(),
          groupId: t.String(),
          fromPreviousEventId: t.Optional(t.String()),
        }),
      ),
    )
    .output((value) => value as PartialDeep<TModelVibefireEvent>)
    .mutation(async ({ ctx, input }) => {
      let eventId: string;
      if (input.fromPreviousEventId) {
        eventId = await ctx.eventsManager.createFromPrevious({
          userAid: ctx.auth.userId,
          forGroupId: input.groupId,
          previousEventId: input.fromPreviousEventId,
        });
      } else {
        eventId = await ctx.eventsManager.create({
          userAid: ctx.auth.userId,
          forGroupId: input.groupId,
          title: input.title,
        });
      }
      return await ctx.eventsManager.view({
        userAid: ctx.auth.userId,
        eventId,
        scope: "manage",
      });
    }),

  update: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          update: t.Partial(EventUpdateModel),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.eventsManager.update({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
        updated: input.update,
      });
    }),

  updateVisibility: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          update: t.Union([t.Literal("hidden"), t.Literal("published")]),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.eventsManager.updateVisibility({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
        update: input.update,
      });
    }),

  updateLinkId: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          update: t.Union([t.Literal("remove"), t.Literal("regenerate")]),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.eventsManager.updateLinkId({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
        update: input.update,
      });
    }),

  updatePartOf: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
          update: t.Union([
            t.Object({ type: t.Literal("remove") }),
            t.Object({ type: t.Literal("set"), planId: t.String() }),
          ]),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      let planId = undefined;
      if (input.update.type === "set") {
        planId = input.update.planId;
      }
      return await ctx.eventsManager.updatePartOf({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
        update: input.update.type,
        planId,
      });
    }),

  delete: authedProcedure
    .input(
      tbValidator(
        t.Object({
          eventId: t.String(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.eventsManager.delete({
        userAid: ctx.auth.userId,
        eventId: input.eventId,
      });
    }),

  createImageUploadLink: authedProcedure
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

  queryGeoPeriods: publicProcedure
    .input(
      tbValidator(
        t.Object({
          position: CoordSchema,
          radius: t.Number(),
          fromDate: t.String(),
          toDate: t.String(),
        }),
      ),
    )
    .output((value) => value as TModelVibefireEvent[])
    .query(async ({ ctx, input }) => {
      return await ctx.eventsManagerFromGeoPeriods(
        ctx.auth,
        input.position,
        input.radius,
        input.fromDate,
        input.toDate,
      );
    }),
});
