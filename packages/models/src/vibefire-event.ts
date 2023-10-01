import { Type as t, Type, type Static } from "@sinclair/typebox";

import { CoordSchema, TimePeriodSchema } from "./general";
import { unsettable } from "./utils";

export const VibefireEventOfferSchema = t.Object({
  id: t.String(),
  description: t.String(),
  live: t.Boolean(),
  claimsTotal: t.Number({ minimum: 1 }),
  claimsPerUser: t.Number({ minimum: 1 }),
  claimableBy: t.Optional(t.Array(t.String())),
  linkedPoi: t.Optional(t.String()),
  timeStart: t.Optional(t.String({ format: "date-time" })),
  timeEnd: t.Optional(t.String({ format: "date-time" })),
});
export type VibefireEventOfferT = Static<typeof VibefireEventOfferSchema>;

export const VibefireEventTimelineElementSchema = t.Object({
  id: t.String(),
  message: t.String(),
  timeIsoNTZ: t.String(),
  isNotification: t.Boolean(),
  hasNotified: t.Boolean(),
  linkedPoi: t.Optional(t.String()),
});
export type VibefireEventTimelineElementT = Static<
  typeof VibefireEventTimelineElementSchema
>;

export const VibefireEventPoiSchema = t.Object({
  id: t.String(),
  position: CoordSchema,
  description: t.String(),
});
export type VibefireEventPoiT = Static<typeof VibefireEventPoiSchema>;

export const VibefireEventLocationSchema = t.Object(
  {
    addressDescription: t.String(),
    position: CoordSchema,
    h3: t.Number(),
    h3Parents: t.Array(t.Number()),
  },
  { default: undefined },
);
export type VibefireEventLocationT = Static<typeof VibefireEventLocationSchema>;

export const VibefireEventImagesSchema = t.Object(
  {
    banner: t.String(),
    additional: t.Optional(t.Array(t.String(), { default: [], maxItems: 4 })),
    customIcon: t.Optional(t.String()),
  },
  { default: undefined },
);
export type VibefireEventImagesT = Static<typeof VibefireEventImagesSchema>;

export const VibefireEventSchema = t.Object(
  {
    id: t.String({ default: undefined }),
    type: t.Union(
      [
        t.Literal("one-time"), // one time event
        t.Literal("recurring"), // same recurring event
        t.Literal("series"), // part of a series of events
        t.Literal("multi-day"), // multi day event
      ],
      { default: undefined },
    ),
    organiserId: t.String({ default: undefined }),
    organiserType: t.Union([t.Literal("user"), t.Literal("organisation")], {
      default: undefined,
    }),

    state: t.Union(
      [t.Literal("draft"), t.Literal("ready"), t.Literal("archived")],
      { default: "draft" },
    ),

    // event info
    title: t.String({ default: undefined }),
    description: t.String({ default: undefined }),
    images: VibefireEventImagesSchema,
    timeStart: t.Number({ default: undefined }),
    timeStartIsoNTZ: t.String({ default: undefined }),
    timeEnd: unsettable(t.Number()),
    timeEndIsoNTZ: unsettable(t.String()),
    timeZone: t.String({ default: undefined }),

    timeline: t.Array(VibefireEventTimelineElementSchema, { default: [] }),
    offers: t.Array(VibefireEventOfferSchema, { default: [] }),
    pois: t.Array(VibefireEventPoiSchema, { default: [] }),
    tags: t.Array(t.String(), { default: [] }),

    vibe: t.Union(
      [
        t.Literal(-2), // "Very chilled"
        t.Literal(-1), // "Cool"
        t.Literal(0), // "Neutral"
        t.Literal(1), // "Warm"
        t.Literal(2), // "Fire"
      ],
      { default: 0 },
    ),

    // search related
    rank: t.Number({ default: 0 }),
    location: VibefireEventLocationSchema,
    displayZoomGroup: t.Union(
      [
        t.Literal(0), // "local"
        t.Literal(1), // "regional"
        t.Literal(2), // "national"
      ],
      { default: 0 },
    ),
    displayTimePeriods: t.Array(TimePeriodSchema, { default: [] }),
    published: t.Boolean({ default: false }),
    visibility: t.Union(
      [
        t.Literal("public"), // visible to everyone, searchable on the map
        t.Literal("link-only"), // only visible to those with the link
        t.Literal("invite-only"), // only visible to those invited
      ],
      {
        default: undefined,
      },
    ),
  },
  { title: "VibefireEventSchema" },
);
export type VibefireEventT = Static<typeof VibefireEventSchema>;

export const VibefireEventManagementSchema = t.Object(
  {
    id: t.String({ default: undefined }),
    eventId: t.String({ default: undefined }),
    organiserId: t.String({ default: undefined }),
    organiserType: t.Union([t.Literal("user"), t.Literal("organisation")], {
      default: undefined,
    }),

    limitNotificationsTotal: t.Number({ minimum: 0, default: 3 }),

    // only for organisation events
    limitOffersTotal: t.Number({ minimum: 0, default: 3 }),
    // offer id to user id (phone number?) mappings
    offerClaimedBy: t.Record(t.String(), t.Array(t.String()), {
      default: {},
    }),
    offerClaimableBy: t.Record(t.String(), t.Array(t.String()), {
      default: {},
    }),
    limitPoisTotal: t.Number({ minimum: 0, default: 3 }),

    // only for event with vis: "public"
    purchasedRanks: t.Number({ minimum: 0, default: 0 }),
    purchasedDisplayTimePeriods: t.Array(t.String(), { default: [] }),
    purchasedDisplayZoomGroup: t.Number({ minimum: 0, default: 0 }),
    // only for events with vis: "invite"
    invited: t.Array(t.String(), { default: [] }),
  },
  { title: "VibefireEventManagementSchema" },
);

export type VibefireEventManagementT = Static<
  typeof VibefireEventManagementSchema
>;
