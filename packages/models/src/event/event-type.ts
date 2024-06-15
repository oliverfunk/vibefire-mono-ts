import { Type as t } from "@sinclair/typebox";

import { CoordSchema } from "!models/general";

export const PoiModel = t.Object({
  poiId: t.String(),
  position: CoordSchema,
  label: t.String(),
});

const EventDetailDescModel = t.Object({
  nOrder: t.Number(),
  type: t.Literal("description"),
  blockTitle: t.Optional(t.String()),
  description: t.String(),
});

const TimelineElementModel = t.Object({
  elementId: t.String(),
  message: t.String({ default: undefined }),
  dtsWhen: t.String({ default: undefined }),
  isNotification: t.Boolean({ default: false }),
  hasNotified: t.Boolean({ default: false }),
});

const EventDetailTimelineModel = t.Object({
  nOrder: t.Number(),
  type: t.Literal("timeline"),
  blockTitle: t.Optional(t.String()),
  timeline: t.Array(TimelineElementModel, { default: [] }),
  linkedPoi: t.Optional(t.String()),
});

const OfferModel = t.Object({
  offerId: t.String(),
  description: t.String(),
  live: t.Boolean(),
  claimsTotal: t.Number({ minimum: 1 }),
  claimsPerUser: t.Number({ minimum: 1 }),
  claimableByGroups: t.Optional(t.Array(t.String())),
  dtsStart: t.Optional(t.String({ format: "date-time" })),
  dtsEnd: t.Optional(t.String({ format: "date-time" })),
});

const EventDetailOffersModel = t.Object({
  nOrder: t.Number(),
  type: t.Literal("offer"),
  blockTitle: t.Optional(t.String()),
  offers: t.Array(OfferModel, { default: [] }),
  linkedPoi: t.Optional(t.String()),
});

export const EventTypeModel = t.Union([
  t.Object({
    type: t.Literal("event"),
    public: t.Boolean({ default: true }),
    tags: t.Array(t.String(), { default: [], uniqueItems: true }),
    details: t.Array(
      t.Union([
        EventDetailDescModel,
        EventDetailTimelineModel,
        EventDetailOffersModel,
      ]),
      {
        default: [],
      },
    ),
    pois: t.Array(PoiModel, { default: [] }),
    scoring: t.Object({
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
      rank: t.Number({ default: 0 }),
    }),
  }),
  t.Object({
    type: t.Literal("event-private"),
    public: t.Boolean({ default: false }),
    details: t.Array(
      t.Union([EventDetailDescModel, EventDetailTimelineModel]),
      {
        default: [],
      },
    ),
    canView: t.Array(t.String(), { default: [] }),
  }),
  t.Object({
    type: t.Literal("whenwhere"),
    public: t.Literal(true),
    description: t.Optional(t.String()),
  }),
  t.Object({
    type: t.Literal("whenwhere-private"),
    public: t.Literal(false),
    description: t.Optional(t.String()),
    canView: t.Array(t.String(), { default: [] }),
  }),
]);
