import { Static, Type as t } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import {
  EventDetailDescModel,
  EventDetailOffersModel,
  EventDetailTimelineModel,
  PoiModel,
} from "./detail";

const ModelEventTypeEventPublic = t.Object({
  type: t.Literal("event"),
  public: t.Literal(true),
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
});

const ModelEventTypeEventPrivate = t.Object({
  type: t.Literal("event"),
  public: t.Literal(false),
  details: t.Array(t.Union([EventDetailDescModel, EventDetailTimelineModel]), {
    default: [],
  }),
  canView: t.Array(t.String(), { default: [] }),
});

const ModelEventTypeWhenWherePublic = t.Object({
  type: t.Literal("whenwhere"),
  public: t.Literal(true),
  description: t.Optional(t.String()),
});

const ModelEventTypeWhenWherePrivate = t.Object({
  type: t.Literal("whenwhere"),
  public: t.Literal(false),
  description: t.Optional(t.String()),
  canView: t.Array(t.String(), { default: [] }),
});

export type TModelEventType = Static<typeof ModelEventType>;
export const ModelEventType = t.Union(
  [
    ModelEventTypeEventPublic,
    ModelEventTypeEventPrivate,
    ModelEventTypeWhenWherePublic,
    ModelEventTypeWhenWherePrivate,
  ],
  {
    default: undefined,
  },
);

export const newEventType = (
  type: TModelEventType["type"],
  publicVis: TModelEventType["public"],
): TModelEventType => {
  switch (type) {
    case "event":
      return publicVis
        ? Value.Create(ModelEventTypeEventPublic)
        : Value.Create(ModelEventTypeEventPrivate);
    case "whenwhere":
      return publicVis
        ? Value.Create(ModelEventTypeWhenWherePublic)
        : Value.Create(ModelEventTypeWhenWherePrivate);
    default:
      throw new Error("Invalid event type");
  }
};
