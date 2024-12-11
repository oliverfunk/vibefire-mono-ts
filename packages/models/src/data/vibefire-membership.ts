import { tb, type Static } from "!models/modelling";

import { ModelVibefireAccess } from "./vibefire-access";
import { ModelVibefireUser } from "./vibefire-user";

export type TModelVibefireMembership = Static<typeof ModelVibefireMembership>;
export const ModelVibefireMembership = tb.Object({
  id: tb.String({ default: undefined }),

  userRef: ModelVibefireUser,
  accessRef: ModelVibefireAccess,

  role: tb.Union([
    tb.Literal("manger"),
    tb.Literal("member"),
    tb.Literal("pending"),
    tb.Literal("denied"),
  ]),

  epochExpires: tb.Optional(tb.Number({ default: undefined })),

  // meta
  epochCreated: tb.Number({ default: undefined }),
});
