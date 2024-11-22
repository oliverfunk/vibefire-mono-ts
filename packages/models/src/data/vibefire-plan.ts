import { tb, Value, type Static } from "!models/modelling";

import { ModelVibefireEntityAccess } from "./vibefire-access";

export type TModelPlanItem = Static<typeof ModelPlanItem>;
export const ModelPlanItem = tb.Object({
  tsWhen: tb.Optional(tb.String({ format: "date-time" })),
  caption: tb.Optional(tb.String()),
  eventId: tb.String({ default: undefined }),
});
export const newPlanItem = (p: TModelPlanItem): TModelPlanItem => {
  const d = Value.Create(ModelPlanItem);
  d.tsWhen = p.tsWhen;
  d.caption = p.caption;
  d.eventId = p.eventId;
  return d;
};

export type TModelVibefirePlan = Static<typeof ModelVibefirePlan>;
export const ModelVibefirePlan = tb.Object({
  id: tb.String({ default: undefined }),

  accessRef: ModelVibefireEntityAccess,

  ownerId: tb.String({ default: undefined }),
  planOwnerType: tb.Union([tb.Literal("user"), tb.Literal("group")]),
  linkId: tb.String({ default: undefined }),
  linkEnabled: tb.Boolean({ default: true }),

  // could be different from ownerId if the plan is for a group
  organiserId: tb.String({ default: undefined }),

  name: tb.String({ default: "" }),
  description: tb.String({ default: "" }),

  items: tb.Array(ModelPlanItem, { default: [], maxLength: 10 }),

  epochCreated: tb.Number({ default: undefined }),
});

export const newVibefirePlan = (p: {
  ownerId: TModelVibefirePlan["ownerId"];
  planOwnerType: TModelVibefirePlan["planOwnerType"];
  linkId: TModelVibefirePlan["linkId"];
  linkEnabled: TModelVibefirePlan["linkEnabled"];
  organiserId: TModelVibefirePlan["organiserId"];
  name: TModelVibefirePlan["name"];
  description: TModelVibefirePlan["description"];
  epochCreated: TModelVibefirePlan["epochCreated"];
}): TModelVibefirePlan => {
  const d = Value.Create(ModelVibefirePlan);
  d.planOwnerType = p.planOwnerType;
  d.linkId = p.linkId;
  d.linkEnabled = p.linkEnabled;
  d.organiserId = p.organiserId;
  d.name = p.name;
  d.description = p.description;
  d.epochCreated = p.epochCreated;
  return d;
};
