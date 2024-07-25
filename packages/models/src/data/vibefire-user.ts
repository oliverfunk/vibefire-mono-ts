import { Type as t, type Static } from "@sinclair/typebox";

export const ModelVibefireUser = t.Object({
  id: t.String({ default: undefined }),
  aid: t.String({ default: undefined }),
  pushToken: t.Optional(t.String()),
  onboardingComplete: t.Boolean({ default: false }),
  name: t.String({ default: undefined }),
  contactEmail: t.Optional(t.String()),
  phoneNumber: t.Optional(t.String()),
  dateOfBirth: t.Optional(t.String({ format: "date-time" })),
  hiddenEvents: t.Array(t.String(), { default: [] }),
  blockedOrganisers: t.Array(t.String(), { default: [] }),
  kycStatus: t.Optional(t.Union([t.Literal("pending"), t.Literal("approved")])),
  state: t.Optional(
    t.Union([t.Literal("active"), t.Literal("blocked"), t.Literal("deleting")]),
  ),
  epochCreated: t.String(),
  epochLastSession: t.String(),
});

export type TModelVibefireUser = Static<typeof ModelVibefireUser>;
export type VibefireUserInfoT = Pick<
  TModelVibefireUser,
  "name" | "phoneNumber" | "contactEmail" | "dateOfBirth"
>;
export type VibefireUserNoIdT = Omit<TModelVibefireUser, "id">;
