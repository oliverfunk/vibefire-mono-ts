import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import {
  ModelVibefireEntityAccess,
  newVibefireEntityAccess,
  type TModelVibefireEntityAccessParams,
} from "!models/general";

export type TModelPlanItem = Static<typeof ModelPlanItem>;
export const ModelPlanItem = t.Object({
  tsWhen: t.Optional(t.String({ format: "date-time" })),
  caption: t.Optional(t.String()),
  eventId: t.String({ default: undefined }),
});
export const newPlanItem = (p: TModelPlanItem): TModelPlanItem => {
  const d = Value.Create(ModelPlanItem);
  d.tsWhen = p.tsWhen;
  d.caption = p.caption;
  d.eventId = p.eventId;
  return d;
};

export type TModelVibefirePlan = Static<typeof ModelVibefirePlan>;
export const ModelVibefirePlan = t.Object({
  id: t.String({ default: undefined }),

  accessRef: ModelVibefireEntityAccess,

  ownerId: t.String({ default: undefined }),
  ownerType: t.Union([t.Literal("user"), t.Literal("group")]),
  linkId: t.String({ default: undefined }),
  linkEnabled: t.Boolean({ default: true }),

  // could be different from ownerId if the plan is for a group
  organiserId: t.String({ default: undefined }),
  // if group, the person that made the plan
  // if the group is public, this is can be hidden
  organiserName: t.String({ default: undefined }),

  name: t.String(),
  description: t.String({ default: "" }),

  items: t.Array(
    t.Object({
      tsWhen: t.Optional(t.String({ format: "date-time" })),
      caption: t.Optional(t.String()),
      eventId: t.String({ default: undefined }),
    }),
    { default: [], maxLength: 10 },
  ),

  epochCreated: t.Number({ default: undefined }),
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
