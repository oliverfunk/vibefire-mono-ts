import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import { TimePeriodSchema, VibefireLocationSchema } from "!models/general";
import { clearable } from "!models/utils";

import { ModelEventType, newEventType, TModelEventType } from "./types";

const ModelEventImages = t.Object(
  {
    bannerImgKeys: t.Array(t.String(), {
      minItems: 1,
      maxItems: 5,
      uniqueItems: true,
    }),
  },
  { default: {} },
);

const ModelEventTimes = t.Object(
  {
    tsStart: t.String({ default: undefined }),
    tsEnd: clearable(t.String()),
    datePeriods: t.Array(TimePeriodSchema, { default: [] }),
  },
  { default: {} },
);

const ModelEventCustomMapData = t.Object({
  zoomGroup: t.Union(
    [
      t.Literal(0), // local
      t.Literal(1), // regional
      t.Literal(2), // national
    ],
    { default: 0 },
  ),
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
  customIcon: t.Optional(t.String()),
});

export { ModelEventType as EventTypeModel, type TModelEventType as TEventType };

export type TVibefireEvent = Static<typeof VibefireEventModel>;
export const VibefireEventModel = t.Object({
  id: t.String({ default: undefined }),

  // form: 123-abc-edf -> easier to remember
  linkId: clearable(t.String()),

  // links to a 'plan' type event
  partOf: t.Optional(t.String()),

  ownerId: t.String({ default: undefined }),
  // redundant, but prevents a join
  ownerName: t.String({ default: undefined }),
  ownerType: t.Union([t.Literal("user"), t.Literal("group")], {
    default: undefined,
  }),

  state: t.Union(
    [
      t.Literal(-1), // draft
      t.Literal(0), // hidden
      t.Literal(1), // published
      t.Literal(2), // archived
      t.Literal(3), // deleted
    ],
    { default: -1 },
  ),

  title: t.String({
    default: undefined,
    minLength: 2,
    maxLength: 100,
  }),
  images: ModelEventImages,
  times: ModelEventTimes,
  location: VibefireLocationSchema,

  event: ModelEventType,

  map: ModelEventCustomMapData,

  // meta
  epochCreated: t.Number({ default: undefined }),
  epochLastUpdated: t.Number({ default: undefined }),
});

export const newVibefireEventModel = (p: {
  type: TModelEventType["type"];
  public: TModelEventType["public"];
  ownerId: TVibefireEvent["ownerId"];
  ownerName: TVibefireEvent["ownerName"];
  ownerType: TVibefireEvent["ownerType"];
  title: TVibefireEvent["title"];
  epochCreated: TVibefireEvent["epochCreated"];
  epochLastUpdated: TVibefireEvent["epochLastUpdated"];
}): TVibefireEvent => {
  const d = Value.Create(VibefireEventModel);
  d.ownerId = p.ownerId;
  d.ownerName = p.ownerName;
  d.ownerType = p.ownerType;
  d.title = p.title;
  d.epochCreated = p.epochCreated;
  d.epochLastUpdated = p.epochLastUpdated;
  d.event = newEventType(p.type, p.public);
  return d;
};

export const ModelEventUpdate = t.Partial(
  t.Object({
    title: VibefireEventModel.properties.title,
    images: t.Partial(ModelEventImages),
    times: t.Partial(
      t.Object({
        tsStart: ModelEventTimes.properties.tsStart,
        tsEnd: ModelEventTimes.properties.tsEnd,
      }),
    ),
    location: t.Partial(VibefireLocationSchema),
    event: t.Partial(ModelEventType),
  }),
);
export type ModelEventUpdateT = Static<typeof ModelEventUpdate>;
