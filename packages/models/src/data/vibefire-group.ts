import { tb, Value, type Static } from "@vibefire/utils";

import { VibefireLocationSchema } from "!models//general";

import { ModelVibefireEntityAccess } from "./vibefire-access";

// export const VibefireGroupPlanEntry = t.Object({
//   entry: t.Union([
//     t.Object({
//       type: t.Literal("event"),
//       eventId: t.String(),
//       label: t.String({ maxLength: 100 }),
//     }),
//     t.Object({
//       type: t.Literal("text"),
//       description: t.String(),
//       location: t.Optional(VibefireLocationSchema),
//     }),
//   ]),
//   when: t.String({ format: "date-time" }),
// });

// export const VibefireGroupPlanComment = t.Object({
//   byUserId: t.String(),
//   comment: t.String({ maxLength: 1000 }),
//   datePostedUTC: t.String({ format: "date-time" }),
// });

// export const VibefireGroupPlan = t.Object({
//   id: t.String({ default: undefined }),
//   groupId: t.String(),
//   byUserId: t.String(),
//   dateCreatedUTC: t.String({ default: undefined }),
//   message: t.String({ maxLength: 1000 }),
//   entries: t.Array(VibefireGroupPlanEntry, { default: [] }),
//   comments: t.Array(VibefireGroupPlanComment, { default: [] }),
//   // user ids of people who have said yes
//   yesses: t.Array(t.String(), { default: [] }),
// });

// export const VibefireGroupSuggestion = t.Object({
//   byUserId: t.String(),
//   dateCreatedUTC: t.String({ default: undefined }),
//   message: t.String({ maxLength: 1000 }),
//   entry: VibefireGroupPlanEntry,
//   // user ids of people who have said yes
//   yesses: t.Array(t.String(), { default: [] }),
// });

const ModelGroupImages = tb.Object({
  banners: tb.Array(tb.String(), { default: [] }),
});

export type TModelVibefireGroup = Static<typeof ModelVibefireGroup>;
export const ModelVibefireGroup = tb.Object({
  id: tb.String({ default: undefined }),

  accessRef: ModelVibefireEntityAccess,

  ownerId: tb.String({ default: undefined }),
  ownerType: tb.Union([tb.Literal("user"), tb.Literal("org")]),
  linkId: tb.String({ default: undefined }),
  linkEnabled: tb.Boolean({ default: true }),

  name: tb.String({ default: undefined }),
  description: tb.String({ default: undefined }),
  images: ModelGroupImages,

  socials: tb.Object(
    {
      x: tb.Optional(tb.String({ default: undefined })),
      facebook: tb.Optional(tb.String({ default: undefined })),
      instagram: tb.Optional(tb.String({ default: undefined })),
      tiktok: tb.Optional(tb.String({ default: undefined })),
      website: tb.Optional(tb.String({ default: undefined })),
    },
    { default: {} },
  ),

  location: tb.Optional(VibefireLocationSchema),

  // meta
  epochCreated: tb.Number({ default: undefined }),
});

export const newVibefireGroup = (p: {
  ownerId: TModelVibefireGroup["ownerId"];
  ownerType: TModelVibefireGroup["ownerType"];
  linkId: TModelVibefireGroup["linkId"];
  linkEnabled: TModelVibefireGroup["linkEnabled"];
  name: TModelVibefireGroup["name"];
  description: TModelVibefireGroup["description"];
  epochCreated: TModelVibefireGroup["epochCreated"];
}): TModelVibefireGroup => {
  const d = Value.Create(ModelVibefireGroup);
  d.ownerId = p.ownerId;
  d.ownerType = p.ownerType;
  d.linkId = p.linkId;
  d.linkEnabled = p.linkEnabled;
  d.name = p.name;
  d.description = p.description;
  d.epochCreated = p.epochCreated;
  return d;
};
