import { SocialLinksModel, VibefireLocationSchema } from "!models//general";
import { tb, Value, type Static } from "!models/modelling";

import { ModelVibefireAccess } from "./vibefire-access";
import { ModelVibefireOwnership } from "./vibefire-ownership";

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
  bannerImgKeys: tb.Array(tb.String(), { default: [] }),
});

export type TModelVibefireGroup = Static<typeof ModelVibefireGroup>;
export const ModelVibefireGroup = tb.Object({
  id: tb.String({ default: undefined }),

  ownershipRef: ModelVibefireOwnership,

  accessRef: ModelVibefireAccess,

  name: tb.String({ default: undefined }),
  description: tb.String({ default: undefined }),
  images: ModelGroupImages,

  socials: SocialLinksModel,

  location: VibefireLocationSchema,

  // partOfOrgId: tb.Optional(tb.String()),

  // meta
  epochCreated: tb.Number({ default: undefined }),
});

export const newVibefireGroup = (p: {
  ownershipRef: TModelVibefireGroup["ownershipRef"];
  accessRef: TModelVibefireGroup["accessRef"];
  name: TModelVibefireGroup["name"];
  description: TModelVibefireGroup["description"];
  epochCreated: TModelVibefireGroup["epochCreated"];
}): TModelVibefireGroup => {
  const d = Value.Create(ModelVibefireGroup);
  d.ownershipRef = p.ownershipRef;
  d.accessRef = p.accessRef;
  d.name = p.name;
  d.description = p.description;
  d.epochCreated = p.epochCreated;
  return d;
};
