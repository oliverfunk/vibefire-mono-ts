import { Type as t, type Static } from "@sinclair/typebox";

import { CoordSchema, TimePeriodSchema } from "./general";
import { unsettable } from "./utils";

const VibefireGroupMembership = t.Object({
  userId: t.String(),
  dateJoinedUTC: t.String({ default: undefined }),
  dateExpiresUTC: t.Optional(t.String({ default: undefined })),
  subgroup: t.Optional(t.String({ default: "default" })),
  isAdmin: t.Boolean({ default: false }),
});

export const VibefireGroup = t.Object({
  // meta
  dateCreatedUTC: t.String({ default: undefined }),
  dateUpdatedUTC: t.String({ default: undefined }),

  name: t.String({ default: undefined }),
  linkId: t.String({ default: undefined }),

  members: t.Array(VibefireGroupMembership, { default: [] }),
});
