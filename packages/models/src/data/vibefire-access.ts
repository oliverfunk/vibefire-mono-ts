import { tb, type Static } from "!models/modelling";

import { ModelVibefireOwnership } from "./vibefire-ownership";

export type TModelVibefireAccess = Static<typeof ModelVibefireAccess>;
export type TModelVibefireAccessNoId = Omit<TModelVibefireAccess, "id">;
export const ModelVibefireAccess = tb.Object(
  {
    id: tb.String({ default: undefined }),
    accessType: tb.Union([
      tb.Literal("public"),
      tb.Literal("open"),
      tb.Literal("invite"),
    ]),
    ownerRef: ModelVibefireOwnership,
  },
  { default: {} },
);
