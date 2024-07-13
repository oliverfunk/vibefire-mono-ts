import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import { TimePeriodSchema, VibefireLocationSchema } from "!models/general";
import { clearable } from "!models/utils";

import { ModelEventType, newEventType, type TModelEventType } from "./types";

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
  customIcon: clearable(t.String()),
});

export { ModelEventType, type TModelEventType };

export type TModelVibefireEvent = Static<typeof ModelVibefireEvent>;
export const ModelVibefireEvent = t.Object({
  id: t.String({ default: undefined }),

  // form: 123-abc-edf -> easier to remember
  linkId: clearable(t.String()),

  // links to a 'plan' type event
  partOf: clearable(t.String()),

  ownerId: t.String({ default: undefined }),
  ownerType: t.Union([t.Literal("user"), t.Literal("group")], {
    default: undefined,
  }),
  // redundant, but prevents a join
  ownerName: t.String({ default: undefined }),

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
  ownerId: TModelVibefireEvent["ownerId"];
  ownerName: TModelVibefireEvent["ownerName"];
  ownerType: TModelVibefireEvent["ownerType"];
  title: TModelVibefireEvent["title"];
  epochCreated: TModelVibefireEvent["epochCreated"];
  epochLastUpdated: TModelVibefireEvent["epochLastUpdated"];
}): TModelVibefireEvent => {
  const d = Value.Create(ModelVibefireEvent);
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
    title: ModelVibefireEvent.properties.title,
    images: t.Partial(ModelEventImages),
    times: t.Partial(t.Omit(ModelEventTimes, ["datePeriods"])),
    location: t.Partial(VibefireLocationSchema),
    event: t.Partial(ModelEventType),
  }),
);
export type TModelEventUpdate = Static<typeof ModelEventUpdate>;

// todo: this may not be correct, better to create a custom model
// instead of using ModelEventUpdate
export const ModelIncompleteVibefireEvent = t.Object({
  ...ModelVibefireEvent.properties,
  ...ModelEventUpdate.properties,
});
export type TModelIncompleteVibefireEvent = Static<
  typeof ModelIncompleteVibefireEvent
>;
