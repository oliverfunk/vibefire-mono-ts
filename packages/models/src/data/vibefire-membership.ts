import { tb, Value, type Static } from "@vibefire/utils";

import { ModelVibefireEntityAccess } from "./vibefire-access";
import { ModelVibefireUser } from "./vibefire-user";

export type TModelVibefireMembership = Static<typeof ModelVibefireMembership>;
export const ModelVibefireMembership = tb.Object({
  id: tb.String({ default: undefined }),

  userRef: ModelVibefireUser,
  accessRef: ModelVibefireEntityAccess,

  role: tb.Union([
    tb.Literal("owner"),
    tb.Literal("manger"),
    tb.Literal("member"),
    tb.Literal("pending"),
    tb.Literal("denied"),
  ]),

  epochExpires: tb.Optional(tb.Number({ default: undefined })),

  // meta
  epochCreated: tb.Number({ default: undefined }),
});
