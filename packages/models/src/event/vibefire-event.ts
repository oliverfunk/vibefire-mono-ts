import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import {
  ModelVibefireEntityAccess,
  newVibefireEntityAccess,
  TimePeriodSchema,
  VibefireLocationSchema,
  type TModelVibefireEntityAccessParams,
} from "!models/general";
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

  accessRef: ModelVibefireEntityAccess,

  ownerId: t.String({ default: undefined }),
  ownerType: t.Union([t.Literal("user"), t.Literal("group")]),
  linkId: t.String({ default: undefined }),
  linkEnabled: t.Boolean({ default: true }),

  // links to a 'plan' type event
  partOf: clearable(t.String()),

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

  name: t.String({
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
});
export const newVibefireEvent = (
  p: TModelVibefireEntityAccessParams & {
    ownerId: TModelVibefireEvent["ownerId"];
    ownerType: TModelVibefireEvent["ownerType"];
    linkId: TModelVibefireEvent["linkId"];
    linkEnabled: TModelVibefireEvent["linkEnabled"];
    name: TModelVibefireEvent["name"];
    epochCreated: TModelVibefireEvent["epochCreated"];
    eventType: TModelEventType["type"];
  },
): TModelVibefireEvent => {
  const d = Value.Create(ModelVibefireEvent);
  d.accessRef = newVibefireEntityAccess({
    type: p.type,
    inviteCode: p.inviteCode,
  });
  d.ownerId = p.ownerId;
  d.ownerType = p.ownerType;
  d.linkId = p.linkId;
  d.linkEnabled = p.linkEnabled;
  d.name = p.name;
  d.epochCreated = p.epochCreated;
  d.event = newEventType(p.eventType);
  return d;
};

export type TModelEventUpdate = Static<typeof ModelEventUpdate>;
export const ModelEventUpdate = t.Partial(
  t.Object({
    name: ModelVibefireEvent.properties.name,
    images: t.Partial(ModelEventImages),
    times: t.Partial(t.Omit(ModelEventTimes, ["datePeriods"])),
    location: t.Partial(VibefireLocationSchema),
    event: t.Partial(ModelEventType),
  }),
);

// todo: this may not be correct, better to create a custom model
// instead of using ModelEventUpdate
export const ModelIncompleteVibefireEvent = t.Object({
  ...ModelVibefireEvent.properties,
  ...ModelEventUpdate.properties,
});
export type TModelIncompleteVibefireEvent = Static<
  typeof ModelIncompleteVibefireEvent
>;
