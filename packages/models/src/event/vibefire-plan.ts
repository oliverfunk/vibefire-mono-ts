import { Type as t, type Static } from "@sinclair/typebox";

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
    // state: t.Union(
    //   [t.Literal("draft"), t.Literal("published"), t.Literal("deleted")],
    //   { default: "draft" },
    // ),
    createdAt: t.String(),
    updatedAt: t.String(),
  },
  { default: {} },
);
