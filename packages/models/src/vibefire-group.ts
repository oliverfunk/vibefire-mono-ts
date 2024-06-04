import { Type as t, type Static } from "@sinclair/typebox";

import {
  VibefireIndexableLocationSchema,
  VibefireLocationSchema,
} from "./general";

export const VibefireGroupMembership = t.Object({
  id: t.String({ default: undefined }),
  userId: t.String(),
  groupId: t.String(),
  dateCreatedUTC: t.String({ default: undefined }),
  dateExpiresUTC: t.Optional(t.String({ default: undefined })),
});

export const VibefireGroupPlanEntry = t.Object({
  entry: t.Union([
    t.Object({
      type: t.Literal("event"),
      eventId: t.String(),
      label: t.String({ maxLength: 100 }),
    }),
    t.Object({
      type: t.Literal("text"),
      description: t.String(),
      location: t.Optional(VibefireLocationSchema),
    }),
  ]),
  when: t.String({ format: "date-time" }),
});

export const VibefireGroupPlanComment = t.Object({
  byUserId: t.String(),
  comment: t.String({ maxLength: 1000 }),
  datePostedUTC: t.String({ format: "date-time" }),
});

export const VibefireGroupPlan = t.Object({
  id: t.String({ default: undefined }),
  groupId: t.String(),
  byUserId: t.String(),
  dateCreatedUTC: t.String({ default: undefined }),
  message: t.String({ maxLength: 1000 }),
  entries: t.Array(VibefireGroupPlanEntry, { default: [] }),
  comments: t.Array(VibefireGroupPlanComment, { default: [] }),
  // user ids of people who have said yes
  yesses: t.Array(t.String(), { default: [] }),
});

export const VibefireGroupSuggestion = t.Object({
  byUserId: t.String(),
  dateCreatedUTC: t.String({ default: undefined }),
  message: t.String({ maxLength: 1000 }),
  entry: VibefireGroupPlanEntry,
  // user ids of people who have said yes
  yesses: t.Array(t.String(), { default: [] }),
});

export const VibefireGroup = t.Object({
  id: t.String({ default: undefined }),

  // used for qr codes/share links, randomly generated when the link is created
  // can be removed or reset by owner/managers
  linkId: t.Optional(t.String({ default: undefined })),

  ownerId: t.String({ default: undefined }),
  ownerType: t.Union([t.Literal("user"), t.Literal("org")], {
    default: undefined,
  }),
  managerIds: t.Array(t.String(), { default: [] }),

  name: t.String({ default: undefined }),
  description: t.String({ default: undefined }),
  imgKeys: t.Object({
    banner: t.String({ default: undefined }),
  }),

  socials: t.Optional(
    t.Object({
      twitter: t.Optional(t.String({ default: undefined })),
      facebook: t.Optional(t.String({ default: undefined })),
      instagram: t.Optional(t.String({ default: undefined })),
      tiktok: t.Optional(t.String({ default: undefined })),
      website: t.Optional(t.String({ default: undefined })),
    }),
  ),

  // meta
  dateCreatedUTC: t.String({ default: undefined }),
  dateUpdatedUTC: t.String({ default: undefined }),
  groupTypeSpecifics: t.Union([
    t.Object({
      type: t.Literal("public"),
      // location - used for discoverability
      // possibly an array
      location: t.Optional(VibefireIndexableLocationSchema),
    }),
    t.Object({
      type: t.Literal("private"),
      joinType: t.Union([
        // invite by owner/managers only, requests require approval
        t.Literal("invite"),
        // all members can invite, requests require no approval
        t.Literal("open"),
      ]),
      // group code - used instead of requesting (for invite groups)
      code: t.Optional(t.String({ default: undefined })),
      // only private groups can have suggestions
      suggestions: t.Array(VibefireGroupSuggestion, { default: [] }),
    }),
  ]),
});
// // discoverable by anyone in an area
// t.Literal("public"),
// // invite by members/link, not discoverable
// t.Literal("private-joinable"),
// // invite by owner/manager only, not discoverable
// t.Literal("private-invite-only"),
export type VibefireGroupT = Static<typeof VibefireGroup>;
