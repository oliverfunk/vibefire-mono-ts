import { Type as t } from "@sinclair/typebox";

import { CoordSchema } from "!models/general";
import { clearable } from "!models/utils";

const PoiModel = t.Object({
  poiLetter: t.String(),
  position: CoordSchema,
  label: t.String({ default: undefined, maxLength: 100, minLength: 1 }),
});

export const EventDetailPoiModel = t.Object({
  v: t.Literal(1),
  nOrder: t.Number(),
  type: t.Literal("poi"),
  blockTitle: t.String({ default: "Points of Interest" }),
  pois: t.Array(PoiModel, { default: [] }),
});

export const EventDetailDescModel = t.Object({
  v: t.Literal(1),
  nOrder: t.Number(),
  type: t.Literal("description"),
  blockTitle: t.String({ default: "Details" }),
  description: t.String(),
});

const TimelineElementModel = t.Object({
  elementId: t.String(),
  message: t.String({ default: undefined }),
  tsWhen: t.String({ default: undefined }),
  isNotification: t.Boolean({ default: false }),
  hasNotified: t.Boolean({ default: false }),
});

export const EventDetailTimelineModel = t.Object({
  v: t.Literal(1),
  nOrder: t.Number(),
  type: t.Literal("timeline"),
  blockTitle: t.String({ default: "Timeline" }),
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
  tsStart: clearable(t.String({ format: "date-time" })),
  tsEnd: clearable(t.String({ format: "date-time" })),
});

export const EventDetailOffersModel = t.Object({
  v: t.Literal(1),
  nOrder: t.Number(),
  type: t.Literal("offer"),
  blockTitle: t.String({ default: "Offers" }),
  offers: t.Array(OfferModel, { default: [] }),
  linkedPoi: t.Optional(t.String()),
});
