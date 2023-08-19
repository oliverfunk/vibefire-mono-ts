import { Static, Type as t } from "@sinclair/typebox";

import { CoordSchema, TimePeriodSchema } from "./general";

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
  when: t.String(),
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

export const VibefireEventLocationSchema = t.Object({
  addressDescription: t.String(),
  position: CoordSchema,
  h3: t.Number(),
  h3Parents: t.Array(t.Number()),
});
export type VibefireEventLocationT = Static<typeof VibefireEventLocationSchema>;

export const VibefireEventImagesSchema = t.Object({
  banner: t.String({
    pattern:
      // this should be vibefire specific image url (i.e. the domain etc.)
      "https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)",
  }),
  additional: t.Optional(t.Array(t.String(), { default: [], maxItems: 4 })),
  customIcon: t.Optional(t.String()),
});
export type VibefireEventImagesT = Static<typeof VibefireEventImagesSchema>;

export const VibefireEventSchema = t.Object({
  id: t.String(),
  organisationId: t.String(),

  // event info
  type: t.Union([t.Literal("regular")]),
  title: t.String(),
  description: t.String(),
  images: VibefireEventImagesSchema,
  timeStart: t.Number(),
  timeEnd: t.Optional(t.Number()),
  timeZone: t.String(),

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
  rank: t.Number(),
  location: VibefireEventLocationSchema,
  displayZoomGroup: t.Union(
    [
      t.Literal(0), // "local"
      t.Literal(1), // "regional"
      t.Literal(2), // "national"
    ],
    { default: 0 },
  ),
  displayTimePeriods: t.Array(TimePeriodSchema),
  published: t.Boolean(),
  visibility: t.Union([
    t.Literal("public"),
    t.Literal("private"), // only invited people can see
    t.Literal("hidden"), // only people with link can see, and data is encrypted
  ]),
});
export type VibefireEventT = Static<typeof VibefireEventSchema>;

export const VibefireEventManagementSchema = t.Object({
  id: t.String(),
  eventId: t.String(),

  limitLocationChanges: t.Number({ minimum: 0 }),
  limitTimeStartChanges: t.Number({ minimum: 0 }),
  limitNotificationsTotal: t.Number({ minimum: 0 }),
  limitOffersTotal: t.Number({ minimum: 0 }),
  limitPoisTotal: t.Number({ minimum: 0 }),

  actualLocationChanges: t.Number({ minimum: 0 }),
  actualTimeStartChanges: t.Number({ minimum: 0 }),

  purchasedRanks: t.Number({ minimum: 0 }),
  purchasedDisplayTimePeriods: t.Number({ minimum: 0 }),
  purchasedDisplayZoomGroup: t.Number({ minimum: 0 }),

  offerClaims: t.Record(t.String(), t.Array(t.String())),
  offerClaimableBy: t.Record(t.String(), t.Array(t.String())),
});
export type VibefireEventManagementT = Static<
  typeof VibefireEventManagementSchema
>;
