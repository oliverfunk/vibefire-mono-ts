import { tb, type Static } from "!models/modelling";

import { ModelVibefireAccess } from "./vibefire-access";
import { ModelVibefireUser } from "./vibefire-user";

export type TModelVibefireMembership = Static<typeof ModelVibefireMembership>;
export const ModelVibefireMembership = tb.Object({
  id: tb.String({ default: undefined }),

  userRef: ModelVibefireUser,
  accessRef: ModelVibefireAccess,

  roleType: tb.Union([
    tb.Literal("owner"),
    tb.Literal("manager"),
    tb.Literal("member"),
  ]),
  shareCode: tb.String({ default: undefined }),
  invitedBy: tb.Optional(ModelVibefireUser),

  epochExpires: tb.Optional(tb.Number({ default: undefined })),

  // meta
  epochCreated: tb.Number({ default: undefined }),
});
