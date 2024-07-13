import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import {
  ModelVibefireEntityAccess,
  newVibefireEntityAccess,
  VibefireLocationSchema,
  type TModelVibefireEntityAccessParams,
} from "./general";
import { clearable } from "./utils";

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

export type TModelVibefireGroupMembership = Static<
  typeof ModelVibefireGroupMembership
>;
export const ModelVibefireGroupMembership = t.Object({
  id: t.String({ default: undefined }),
  userId: t.String({ default: undefined }),
  groupId: t.String({ default: undefined }),
  epochCreated: t.Number({ default: undefined }),
  epochExpires: t.Optional(t.Number()),
  role: t.Union([t.Literal("member"), t.Literal("manager")], {
    default: undefined,
  }),
});

const ModelGroupImages = t.Object({
  banners: t.Array(t.String(), { default: [] }),
});

export type TModelVibefireGroup = Static<typeof ModelVibefireGroup>;
export const ModelVibefireGroup = t.Object({
  id: t.String({ default: undefined }),

  accessRef: ModelVibefireEntityAccess,

  ownerId: t.String({ default: undefined }),
  ownerType: t.Union([t.Literal("user"), t.Literal("org")]),
  linkId: t.String({ default: undefined }),
  linkEnabled: t.Boolean({ default: true }),

  name: t.String({ default: undefined }),
  description: t.String({ default: undefined }),
  images: ModelGroupImages,

  socials: t.Object(
    {
      x: t.Optional(t.String({ default: undefined })),
      facebook: t.Optional(t.String({ default: undefined })),
      instagram: t.Optional(t.String({ default: undefined })),
      tiktok: t.Optional(t.String({ default: undefined })),
      website: t.Optional(t.String({ default: undefined })),
    },
    { default: {} },
  ),

  group: t.Union([
    t.Object({
      type: t.Literal("public"),
      // location - used for discoverability
      // possibly an array
      location: t.Optional(VibefireLocationSchema),
    }),
    t.Object({
      // invite by owner/managers only, link requests require approval
      type: t.Literal("invite"),
      // group code - used instead of requesting
      inviteCode: clearable(t.String({ maxLength: 6 })),
    }),
    t.Object({
      // all members can invite, link requests require no approval
      type: t.Literal("open"),
    }),
  ]),

  // meta
  epochCreated: t.String({ default: undefined }),
});

export const newVibefireGroup = (
  p: TModelVibefireEntityAccessParams & {
    ownerId: TModelVibefireGroup["ownerId"];
    ownerType: TModelVibefireGroup["ownerType"];
    linkId: TModelVibefireGroup["linkId"];
    linkEnabled: TModelVibefireGroup["linkEnabled"];
    name: TModelVibefireGroup["name"];
    description: TModelVibefireGroup["description"];
    epochCreated: TModelVibefireGroup["epochCreated"];
  },
): TModelVibefireGroup => {
  const d = Value.Create(ModelVibefireGroup);
  d.accessRef = newVibefireEntityAccess({
    type: p.type,
    inviteCode: p.inviteCode,
  });
  d.name = p.name;
  d.description = p.description;
  d.epochCreated = p.epochCreated;
  return d;
};

export const newVibefireGroupMembership = (p: {
  userId: string;
  groupId: string;
  epochCreated: number;
  epochExpires?: number;
}): TModelVibefireGroupMembership => {
  const d = Value.Create(ModelVibefireGroupMembership);
  d.userId = p.userId;
  d.groupId = p.groupId;
  d.epochCreated = p.epochCreated;
  d.epochExpires = p.epochExpires;
  return d;
};
