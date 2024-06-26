import { Static, Type as t } from "@sinclair/typebox";

import {
  EventDetailDescModel,
  EventDetailOffersModel,
  EventDetailTimelineModel,
  PoiModel,
} from "./detail";

export const EventTypeModel = t.Union([
  t.Object({
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
    public: t.Literal(false),
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
