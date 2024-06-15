import { Type as t } from "@sinclair/typebox";

import { TimePeriodSchema, VibefireLocationSchema } from "!models/general";
import { clearable } from "!models/utils";

import { EventTypeModel } from "./event-type";

const ImagesModel = t.Object({
  banners: t.Array(t.String(), { default: [], maxItems: 5 }),
  customIcon: t.Optional(t.String()),
});

const TimesModel = t.Object({
  dtsStart: t.String({ default: undefined }),
  dtsEnd: clearable(t.String()),
  datePeriods: t.Array(TimePeriodSchema, { default: [] }),
});

export const VibefireEventModel = t.Object({
  id: t.String({ default: undefined }),
  linkId: t.Optional(t.String({ default: undefined })),

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
      t.Literal(0), // hidden
      t.Literal(1), // published
      t.Literal(2), // archived
      t.Literal(3), // deleted
    ],
    { default: 0 },
  ),

  title: t.String({ default: undefined, minLength: 2 }),
  images: ImagesModel,

  event: EventTypeModel,

  times: TimesModel,
  location: VibefireLocationSchema,
  zoomGroup: t.Union(
    [
      t.Literal(0), // local
      t.Literal(1), // regional
      t.Literal(2), // national
    ],
    { default: 0 },
  ),

  // meta
  dtsCreatedUTC: t.String({ default: undefined }),
  dtsUpdatedUTC: t.String({ default: undefined }),
});
