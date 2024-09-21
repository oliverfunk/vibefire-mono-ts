import { clearable, tb } from "@vibefire/utils";

import { CoordSchema } from "!models/general";

const ModelNOrder = tb.Number({ minimum: 0, maximum: 10 });

const PoiModel = tb.Object({
  poiLetter: tb.String(),
  position: CoordSchema,
  label: tb.String({ default: undefined, maxLength: 100, minLength: 1 }),
});

export const EventDetailPoiModel = tb.Object({
  nOrder: ModelNOrder,
  type: tb.Literal("poi"),
  blockTitle: tb.String({ default: "Points of Interest" }),
  pois: tb.Array(PoiModel, { default: [] }),
});

export const EventDetailDescModel = tb.Object({
  nOrder: ModelNOrder,
  type: tb.Literal("description"),
  blockTitle: tb.String({ default: "Details" }),
  description: tb.String(),
});

const TimelineElementModel = tb.Object({
  elementId: tb.String(),
  message: tb.String({ default: undefined }),
  tsWhen: tb.String({ default: undefined }),
  isNotification: tb.Boolean({ default: false }),
  hasNotified: tb.Boolean({ default: false }),
});

export const EventDetailTimelineModel = tb.Object({
  nOrder: ModelNOrder,
  type: tb.Literal("timeline"),
  blockTitle: tb.String({ default: "Timeline" }),
  timeline: tb.Array(TimelineElementModel, { default: [] }),
  linkedPoi: tb.Optional(tb.String()),
});

const OfferModel = tb.Object({
  offerId: tb.String(),
  description: tb.String(),
  live: tb.Boolean(),
  claimsTotal: tb.Number({ minimum: 1 }),
  claimsPerUser: tb.Number({ minimum: 1 }),
  claimableByGroups: tb.Optional(tb.Array(tb.String())),
  tsStart: clearable(tb.String({ format: "date-time" })),
  tsEnd: clearable(tb.String({ format: "date-time" })),
});

export const EventDetailOffersModel = tb.Object({
  nOrder: ModelNOrder,
  type: tb.Literal("offer"),
  blockTitle: tb.String({ default: "Offers" }),
  offers: tb.Array(OfferModel, { default: [] }),
  linkedPoi: tb.Optional(tb.String()),
});
