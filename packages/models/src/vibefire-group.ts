import { Type as t } from "@sinclair/typebox";

import { VibefireIndexableLocationSchema } from "./general";

export const VibefireGroupMembership = t.Object({
  id: t.String({ default: undefined }),
  userId: t.String(),
  groupId: t.String(),
  dateCreatedUTC: t.String({ default: undefined }),
  dateExpiresUTC: t.Optional(t.String({ default: undefined })),
});

export const VibefireGroup = t.Object({
  id: t.String({ default: undefined }),
  linkId: t.String({ default: undefined }),

  ownerId: t.String({ default: undefined }),
  ownerType: t.Union([t.Literal("user"), t.Literal("org")], {
    default: undefined,
  }),
  managerIds: t.Array(t.String(), { default: [] }),

  name: t.String({ default: undefined }),
  description: t.String({ default: undefined }),
  banner: t.String({ default: undefined }),

  // location - used for discoverability of public groups
  location: t.Optional(VibefireIndexableLocationSchema),

  // meta
  dateCreatedUTC: t.String({ default: undefined }),
  dateUpdatedUTC: t.String({ default: undefined }),
  type: t.Union([
    // discoverable by anyone in an area
    t.Literal("public"),
    // invite by members/link
    t.Literal("private-joinable"),
    // invite by owner/manager only
    t.Literal("private-invite-only"),
  ]),
});
