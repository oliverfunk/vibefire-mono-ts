import { tb, Value, type Static } from "@vibefire/utils";

import {
  EventDetailDescModel,
  EventDetailOffersModel,
  EventDetailPoiModel,
  EventDetailTimelineModel,
} from "./event-details";

const ModelEventTypeEventPublic = tb.Object({
  type: tb.Literal("event-public"),
  details: tb.Array(
    tb.Union([
      EventDetailDescModel,
      EventDetailTimelineModel,
      EventDetailOffersModel,
      EventDetailPoiModel,
    ]),
    {
      default: [],
    },
  ),
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
  description: tb.Optional(tb.String()),
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
