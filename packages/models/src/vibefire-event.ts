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

export const VibefireEventAnnouncementSchema = t.Object({
  id: t.String(),
  message: t.String(),
  when: t.String(),
  isNotification: t.Boolean(),
  hasNotified: t.Boolean(),
  linkedPoi: t.Optional(t.String()),
});
export type VibefireEventAnnouncementT = Static<
  typeof VibefireEventAnnouncementSchema
>;

export const VibefireEventPoiSchema = t.Object({
  id: t.String(),
  coord: CoordSchema,
  description: t.String(),
});
export type VibefireEventPoiT = Static<typeof VibefireEventPoiSchema>;

export const VibefireEventLocationSchema = t.Object({
  addressDescription: t.String(),
  coord: CoordSchema,
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
  si1: t.Optional(
    t.String({
      format: "uri",
    }),
  ),
  si2: t.Optional(t.String()),
  si3: t.Optional(t.String()),
  si4: t.Optional(t.String()),
  si5: t.Optional(t.String()),
  si6: t.Optional(t.String()),
  si7: t.Optional(t.String()),
  si8: t.Optional(t.String()),
  si9: t.Optional(t.String()),
  customIcon: t.Optional(t.String()),
});
export type VibefireEventImagesT = Static<typeof VibefireEventImagesSchema>;

export const VibefireEventSchema = t.Object({
  id: t.String(),
  organisation: t.String(),

  // event info
  type: t.Union([t.Literal("regular")]),
  name: t.String(),
  description: t.String(),
  images: VibefireEventImagesSchema,
  timeStart: t.Date(),
  timeEnd: t.Optional(t.Date()),
  timeZone: t.String(),
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

  announcements: t.Array(VibefireEventAnnouncementSchema),
  offers: t.Array(VibefireEventOfferSchema),
  pois: t.Array(VibefireEventPoiSchema),
  tags: t.Array(t.String()),

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
  event: t.String(),

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
