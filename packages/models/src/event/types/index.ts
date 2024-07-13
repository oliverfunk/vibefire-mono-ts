import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import {
  EventDetailDescModel,
  EventDetailOffersModel,
  EventDetailPoiModel,
  EventDetailTimelineModel,
} from "./detail";

const ModelEventTypeEventPublic = t.Object({
  type: t.Literal("event-public"),
  details: t.Array(
    t.Union([
      EventDetailDescModel,
      EventDetailTimelineModel,
      EventDetailOffersModel,
      EventDetailPoiModel,
    ]),
    {
      default: [],
    },
  ),
  tags: t.Array(t.String(), { default: [], uniqueItems: true }),
});

const ModelEventTypeEventPrivate = t.Object({
  type: t.Literal("event-private"),
  details: t.Array(t.Union([EventDetailDescModel, EventDetailTimelineModel]), {
    default: [],
  }),
});

const ModelEventTypeWhenWhere = t.Object({
  type: t.Literal("whenwhere"),
  description: t.Optional(t.String()),
});

export type TModelEventType = Static<typeof ModelEventType>;
export const ModelEventType = t.Union(
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
