import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import { clearable } from "!models/utils";

// import { Value } from "@sinclair/typebox/value";

export type TModelVibefirePlan = Static<typeof ModelVibefirePlan>;
export const ModelVibefirePlan = t.Object(
  {
    id: t.String({ default: undefined }),

    linkId: clearable(t.String()),

    ownerId: t.String({ default: undefined }),
    ownerType: t.Union([t.Literal("user"), t.Literal("group")], {
      default: undefined,
    }),

    // could be different from ownerId if the plan is for a group
    organiserId: t.String({ default: undefined }),
    // if group, the person that made the plan
    // if the group is public, this is can be hidden
    organiserName: t.String({ default: undefined }),

    name: t.String(),
    description: t.String({ default: "" }),

    eventIds: t.Array(t.String({ default: [], minLength: 1, maxLength: 10 })),

    epochCreatedAt: t.Number({ default: undefined }),
    epochUpdatedAt: t.Number({ default: undefined }),
  },
  { default: {} },
);

export const newVibefirePlanModel = (p: {
  ownerId: string;
  ownerType: TModelVibefirePlan["ownerType"];
  organiserId: string;
  organiserName: string;
  name: string;
  description: string;
  epochCreatedAt: number;
  epochUpdatedAt: number;
}): TModelVibefirePlan => {
  const d = Value.Create(ModelVibefirePlan);
  d.ownerId = p.ownerId;
  d.ownerType = p.ownerType;
  d.organiserId = p.organiserId;
  d.organiserName = p.organiserName;
  d.name = p.name;
  d.description = p.description;
  d.epochCreatedAt = p.epochCreatedAt;
  d.epochUpdatedAt = p.epochUpdatedAt;
  return d;
};
