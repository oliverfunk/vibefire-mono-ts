import { tb, type Static } from "!models/modelling";

export type TModelVibefireOwnership = Static<typeof ModelVibefireOwnership>;
export const ModelVibefireOwnership = tb.Object({
  id: tb.String(),
  ownerType: tb.Union([
    tb.Literal("user"),
    tb.Literal("group"),
    tb.Literal("organisation"),
  ]),
  ownerName: tb.String(),
});
