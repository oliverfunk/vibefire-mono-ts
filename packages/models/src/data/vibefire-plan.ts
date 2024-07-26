import { tb, Value, type Static } from "@vibefire/utils";

import {
  ModelVibefireEntityAccess,
  newVibefireEntityAccess,
  type TModelVibefireEntityAccessParams,
} from "!models/general";

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
  ownerType: tb.Union([tb.Literal("user"), tb.Literal("group")]),
  linkId: tb.String({ default: undefined }),
  linkEnabled: tb.Boolean({ default: true }),

  // could be different from ownerId if the plan is for a group
  organiserId: tb.String({ default: undefined }),
  // if group, the person that made the plan
  // if the group is public, this is can be hidden
  organiserName: tb.String({ default: undefined }),

  name: tb.String(),
  description: tb.String({ default: "" }),

  items: tb.Array(
    tb.Object({
      tsWhen: tb.Optional(tb.String({ format: "date-time" })),
      caption: tb.Optional(tb.String()),
      eventId: tb.String({ default: undefined }),
    }),
    { default: [], maxLength: 10 },
  ),

  epochCreated: tb.Number({ default: undefined }),
});

export const newVibefirePlan = (
  p: TModelVibefireEntityAccessParams & {
    ownerId: TModelVibefirePlan["ownerId"];
    ownerType: TModelVibefirePlan["ownerType"];
    linkId: TModelVibefirePlan["linkId"];
    linkEnabled: TModelVibefirePlan["linkEnabled"];
    organiserId: TModelVibefirePlan["organiserId"];
    organiserName: TModelVibefirePlan["organiserName"];
    name: TModelVibefirePlan["name"];
    description: TModelVibefirePlan["description"];
    epochCreated: TModelVibefirePlan["epochCreated"];
  },
): TModelVibefirePlan => {
  const d = Value.Create(ModelVibefirePlan);
  d.accessRef = newVibefireEntityAccess({
    type: p.type,
    inviteCode: p.inviteCode,
  });
  d.ownerId = p.ownerId;
  d.ownerType = p.ownerType;
  d.linkId = p.linkId;
  d.linkEnabled = p.linkEnabled;
  d.organiserId = p.organiserId;
  d.organiserName = p.organiserName;
  d.name = p.name;
  d.description = p.description;
  d.epochCreated = p.epochCreated;
  return d;
};
