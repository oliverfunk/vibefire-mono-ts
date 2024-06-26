import { Type as t } from "@sinclair/typebox";

import { CoordSchema } from "!models/general";

export const PoiModel = t.Object({
  poiId: t.String(),
  position: CoordSchema,
  label: t.String(),
});

export const EventDetailDescModel = t.Object({
  v: t.Literal(1),
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

export const EventDetailTimelineModel = t.Object({
  v: t.Literal(1),
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

export const EventDetailOffersModel = t.Object({
  v: t.Literal(1),
  nOrder: t.Number(),
  type: t.Literal("offer"),
  blockTitle: t.Optional(t.String()),
  offers: t.Array(OfferModel, { default: [] }),
  linkedPoi: t.Optional(t.String()),
});
