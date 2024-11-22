import { tb, Value, type Static } from "!models/modelling";

import {
  EventDetailDescModel,
  EventDetailOffersModel,
  EventDetailPoiModel,
  EventDetailTimelineModel,
} from "./event-details";

export type EventDetail = Static<typeof EventDetail>;
export const EventDetail = tb.Union([
  EventDetailOffersModel,
  EventDetailTimelineModel,
  EventDetailPoiModel,
  EventDetailDescModel,
]);

const ModelEventTypeEventPublic = tb.Object({
  type: tb.Literal("event-public"),
  // all details available
  details: tb.Array(EventDetail, {
    default: [],
  }),
  tags: tb.Array(tb.String(), { default: [], uniqueItems: true }),
});

const ModelEventTypeEventPrivate = tb.Object({
  type: tb.Literal("event-private"),
  details: tb.Array(
    tb.Union([EventDetailDescModel, EventDetailTimelineModel]),
    {
      default: [],
    },
  ),
});

const ModelEventTypeWhenWhere = tb.Object({
  type: tb.Literal("whenwhere"),
  details: tb.Array(EventDetailDescModel, { default: [], maxItems: 1 }),
});

export type TModelEventType = Static<typeof ModelEventType>;
export const ModelEventType = tb.Union(
  [
    ModelEventTypeEventPublic,
    ModelEventTypeEventPrivate,
    ModelEventTypeWhenWhere,
  ],
  {
    default: undefined,
  },
);
export const newEventType = (
  type: TModelEventType["type"],
): TModelEventType => {
  switch (type) {
    case "event-public":
      return Value.Create(ModelEventTypeEventPublic);
    case "event-private":
      return Value.Create(ModelEventTypeEventPrivate);
    case "whenwhere":
      return Value.Create(ModelEventTypeWhenWhere);
    default:
      throw new Error("Invalid event type");
  }
};
