import { Type as t, type Static } from "@sinclair/typebox";

import { VibefireLocationSchema } from "./general";

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

export const VibefireGroupMembership = t.Object({
  id: t.String({ default: undefined }),
  userId: t.String(),
  groupId: t.String(),
  dateCreatedUTC: t.String({ default: undefined }),
  dateExpiresUTC: t.Optional(t.String({ default: undefined })),
});

const VibefireGroupImages = t.Object({
  banners: t.Array(t.String(), { default: [] }),
});

export type TVibefireGroup = Static<typeof VibefireGroupModel>;
export const VibefireGroupModel = t.Object({
  id: t.String({ default: undefined }),

  // used for qr codes/share links, randomly generated when the link is created
  // can be removed or reset by owner/managers
  linkId: t.Optional(t.String({ default: undefined })),

  ownerAid: t.String({ default: undefined }),
  ownerType: t.Union([t.Literal("user"), t.Literal("org")], {
    default: undefined,
  }),

  // todo: possibly change to canManageEvents
  managerAids: t.Array(t.String(), { default: [] }),

  name: t.String({ default: undefined }),
  description: t.String({ default: undefined }),
  images: VibefireGroupImages,

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
      type: t.Literal("private"),
      access: t.Union([
        // invite by owner/managers only, requests require approval
        t.Literal("invite"),
        // all members can invite, requests require no approval
        t.Literal("open"),
      ]),
      // group code - used instead of requesting (for invite groups)
      inviteCode: t.Optional(t.String({ default: undefined, maxLength: 6 })),
    }),
  ]),

  // meta
  dtsCreatedUTC: t.String({ default: undefined }),
  dtsUpdatedUTC: t.String({ default: undefined }),
});
