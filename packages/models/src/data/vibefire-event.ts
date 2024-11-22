import {
  ModelEventType,
  newEventType,
  type TModelEventType,
} from "!models/data/event-types";
import { DatePeriodSchema, VibefireLocationSchema } from "!models/general";
import { clearable, tb, Value, type Static } from "!models/modelling";

import { ModelVibefireEntityAccess } from "./vibefire-access";

const ModelEventImages = tb.Object({
  bannerImgKeys: tb.Array(tb.String(), {
    default: [],
    maxItems: 5,
    uniqueItems: true,
  }),
});

const ModelEventTimes = tb.Object(
  {
    tsStart: tb.String({ default: undefined }),
    tsEnd: clearable(tb.String()),
    datePeriods: tb.Array(DatePeriodSchema, { default: [] }),
  },
  { default: {} },
);

const ModelEventCustomMapData = tb.Object({
  zoomGroup: tb.Union(
    [
      tb.Literal(0), // local
      tb.Literal(1), // regional
      tb.Literal(2), // national
    ],
    { default: 0 },
  ),
  vibe: tb.Union(
    [
      tb.Literal(-2), // "Very chilled"
      tb.Literal(-1), // "Cool"
      tb.Literal(0), // "Neutral"
      tb.Literal(1), // "Warm"
      tb.Literal(2), // "Fire"
    ],
    { default: 0 },
  ),
  rank: tb.Number({ default: 0 }),
  customIcon: clearable(tb.String()),
});

export { ModelEventType, type TModelEventType };

export type TModelVibefireEvent = Static<typeof ModelVibefireEvent>;
export type TModelVibefireEventNoId = Omit<TModelVibefireEvent, "id">;
export const ModelVibefireEvent = tb.Object({
  id: tb.String({ default: undefined }),

  accessRef: ModelVibefireEntityAccess,

  ownerId: tb.String({ default: undefined }),
  eventOwnerType: tb.Union([tb.Literal("user"), tb.Literal("group")]),
  ownerName: tb.String({ default: undefined }),

  linkId: tb.String({ default: undefined }),
  linkEnabled: tb.Boolean({ default: true }),

  // links to a 'plan' type event
  partOf: clearable(tb.String()),

  state: tb.Union(
    [
      tb.Literal(-1), // draft
      tb.Literal(0), // hidden
      tb.Literal(1), // published
      tb.Literal(2), // archived
      tb.Literal(3), // deleted
    ],
    { default: -1 },
  ),

  name: tb.String({
    default: undefined,
    minLength: 2,
    maxLength: 100,
  }),
  event: ModelEventType,

  images: ModelEventImages,
  times: ModelEventTimes,
  location: VibefireLocationSchema,
  map: ModelEventCustomMapData,

  // meta
  epochCreated: tb.Number({ default: undefined }),
});
export const newVibefireEvent = (p: {
  ownerId: TModelVibefireEvent["ownerId"];
  eventOwnerType: TModelVibefireEvent["eventOwnerType"];
  ownerName: TModelVibefireEvent["ownerName"];
  linkId: TModelVibefireEvent["linkId"];
  linkEnabled: TModelVibefireEvent["linkEnabled"];
  name: TModelVibefireEvent["name"];
  epochCreated: TModelVibefireEvent["epochCreated"];
  eventType: TModelEventType["type"];
}): TModelVibefireEventNoId => {
  const d = Value.Create(ModelVibefireEvent);
  // @ts-expect-error the access ref is set later during creation.
  d.accessRef = undefined;
  d.ownerId = p.ownerId;
  d.eventOwnerType = p.eventOwnerType;
  d.ownerName = p.ownerName;
  d.linkId = p.linkId;
  d.linkEnabled = p.linkEnabled;
  d.name = p.name;
  d.epochCreated = p.epochCreated;
  d.event = newEventType(p.eventType);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...dWithoutId } = d;
  return dWithoutId;
};

export type TModelEventUpdate = Static<typeof ModelEventUpdate>;
export const ModelEventUpdate = tb.Partial(
  tb.Object({
    name: ModelVibefireEvent.properties.name,
    images: tb.Partial(ModelEventImages),
    times: tb.Partial(tb.Omit(ModelEventTimes, ["datePeriods"])),
    location: tb.Partial(VibefireLocationSchema),
    event: tb.Partial(ModelEventType),
  }),
);

// todo: this may not be correct, better to create a custom model
// instead of using ModelEventUpdate
export const ModelIncompleteVibefireEvent = tb.Object({
  ...ModelVibefireEvent.properties,
  ...ModelEventUpdate.properties,
});
export type TModelIncompleteVibefireEvent = Static<
  typeof ModelIncompleteVibefireEvent
>;
