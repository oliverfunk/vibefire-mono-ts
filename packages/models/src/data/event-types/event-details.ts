import { CoordSchema } from "!models/general";
import { clearable, tb, Value, type Static } from "!models/modelling";

// poi
const PoiModel = tb.Object({
  id: tb.String(),
  position: CoordSchema,
  label: tb.String({ default: undefined, maxLength: 100, minLength: 1 }),
});
export type EventDetailPoiModel = Static<typeof EventDetailPoiModel>;
export const EventDetailPoiModel = tb.Object({
  type: tb.Literal("poi"),
  blockTitle: tb.String({ default: "Points of Interest" }),
  value: tb.Array(PoiModel, { default: [] }),
});
export const newEventDetailPoiModel = (
  value: EventDetailPoiModel["value"],
  blockTitle: string,
): EventDetailPoiModel => {
  const mv = Value.Create(EventDetailPoiModel);
  mv.value = value;
  mv.blockTitle = blockTitle;
  return mv;
};
// poi

// desc
export type EventDetailDescModel = Static<typeof EventDetailDescModel>;
export const EventDetailDescModel = tb.Object({
  type: tb.Literal("description"),
  blockTitle: tb.String({ default: "Description" }),
  value: tb.String(),
});
export const newEventDetailDescModel = (p: {
  value: EventDetailDescModel["value"];
}): EventDetailDescModel => {
  const { value } = p;
  const mv = Value.Create(EventDetailDescModel);
  mv.value = value;
  return mv;
};
// desc

// timeline
const TimelineElementModel = tb.Object({
  elementId: tb.String(),
  message: tb.String({ default: undefined }),
  tsWhen: tb.String({ default: undefined }),
  isNotification: tb.Boolean({ default: false }),
  hasNotified: tb.Boolean({ default: false }),
});
export type EventDetailTimelineModel = Static<typeof EventDetailTimelineModel>;
export const EventDetailTimelineModel = tb.Object({
  type: tb.Literal("timeline"),
  blockTitle: tb.String({ default: "Timeline" }),
  value: tb.Array(TimelineElementModel, { default: [] }),
  linkedPoiId: tb.Optional(tb.String()),
});
export const newEventDetailTimelineModel = (
  value: EventDetailTimelineModel["value"],
  blockTitle: string,
): EventDetailTimelineModel => {
  const mv = Value.Create(EventDetailTimelineModel);
  mv.value = value;
  mv.blockTitle = blockTitle;
  return mv;
};
// timeline

// offer
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
export type EventDetailOffersModel = Static<typeof EventDetailOffersModel>;
export const EventDetailOffersModel = tb.Object({
  type: tb.Literal("offer"),
  blockTitle: tb.String({ default: "Offers" }),
  value: tb.Array(OfferModel, { default: [] }),
  linkedPoiId: tb.Optional(tb.String()),
});
export const newEventDetailOffersModel = (
  value: EventDetailOffersModel["value"],
  blockTitle: string,
): EventDetailOffersModel => {
  const mv = Value.Create(EventDetailOffersModel);
  mv.value = value;
  mv.blockTitle = blockTitle;
  return mv;
};
// offer
