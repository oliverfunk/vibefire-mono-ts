import { clearable, tb, Value, type Static } from "!models/modelling";

// desc
export type EventDetailDescModel = Static<typeof EventDetailDescModel>;
export const EventDetailDescModel = tb.Object({
  type: tb.Literal("description"),
  blockTitle: tb.String({ default: "Description", minLength: 1 }),
  value: tb.String({ default: "" }),
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
export type EventDetailTimelineModel = Static<
  typeof EventDetailSimpleTimelineModel
>;
export const EventDetailSimpleTimelineModel = tb.Object({
  type: tb.Literal("timeline"),
  blockTitle: tb.String({ default: "Timeline" }),
  value: tb.Array(TimelineElementModel, { default: [] }),
});
export const newEventDetailTimelineModel = (
  value: EventDetailTimelineModel["value"],
  blockTitle: string,
): EventDetailTimelineModel => {
  const mv = Value.Create(EventDetailSimpleTimelineModel);
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
  // should maybe be an epoch or ts (with tz)
  tsStart: clearable(tb.String({ format: "date-time" })),
  tsEnd: clearable(tb.String({ format: "date-time" })),
});
export type EventDetailOffersModel = Static<typeof EventDetailOffersModel>;
export const EventDetailOffersModel = tb.Object({
  type: tb.Literal("offer"),
  blockTitle: tb.String({ default: "Offers" }),
  value: tb.Array(OfferModel, { default: [] }),
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

export type EventDetail = Static<typeof EventDetail>;
export const EventDetail = tb.Union([
  EventDetailOffersModel,
  EventDetailSimpleTimelineModel,
  EventDetailDescModel,
]);
