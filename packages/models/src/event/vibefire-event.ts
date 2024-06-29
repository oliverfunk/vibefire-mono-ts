import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import { TimePeriodSchema, VibefireLocationSchema } from "!models/general";
import { clearable } from "!models/utils";

import { EventTypeModel, newEventType, TEventType } from "./types";

const ImagesModel = t.Object(
  {
    bannerImgKeys: t.Array(t.String(), {
      minItems: 1,
      maxItems: 5,
    }),
    customIcon: t.Optional(t.String()),
  },
  { default: {} },
);

const TimesModel = t.Object(
  {
    startTS: t.String({ default: undefined }),
    endTS: clearable(t.String()),
    datePeriods: t.Array(TimePeriodSchema, { default: [] }),
  },
  { default: {} },
);

export { EventTypeModel, type TEventType };

export const EventUpdateModel = t.Partial(EventTypeModel);
export type TEventUpdate = Static<typeof EventUpdateModel>;

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

  title: t.String({ default: undefined, minLength: 2 }),
  images: ImagesModel,
  times: TimesModel,
  location: VibefireLocationSchema,

  event: EventTypeModel,

  zoomGroup: t.Union(
    [
      t.Literal(0), // local
      t.Literal(1), // regional
      t.Literal(2), // national
    ],
    { default: 0 },
  ),

  // meta
  timeCreatedEpoch: t.Number({ default: undefined }),
  timeUpdateEpoch: t.Number({ default: undefined }),
});

export const newVibefireEventModel = (p: {
  type: TEventType["type"];
  public: TEventType["public"];
  ownerId: TVibefireEvent["ownerId"];
  ownerName: TVibefireEvent["ownerName"];
  ownerType: TVibefireEvent["ownerType"];
  title: TVibefireEvent["title"];
  timeCreatedEpoch: TVibefireEvent["timeCreatedEpoch"];
  timeUpdateEpoch: TVibefireEvent["timeUpdateEpoch"];
}): TVibefireEvent => {
  const d = Value.Create(VibefireEventModel);
  d.ownerId = p.ownerId;
  d.ownerName = p.ownerName;
  d.ownerType = p.ownerType;
  d.title = p.title;
  d.timeCreatedEpoch = p.timeCreatedEpoch;
  d.timeUpdateEpoch = p.timeUpdateEpoch;
  d.event = newEventType(p.type, p.public);
  return d;
};
