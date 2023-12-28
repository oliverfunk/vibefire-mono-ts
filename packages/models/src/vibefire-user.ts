import { Type as t, type Static } from "@sinclair/typebox";

export const VibefireUserSchema = t.Object({
  id: t.String({ default: undefined }),
  aid: t.String({ default: undefined }),
  pushToken: t.Optional(t.String()),
  onboardingComplete: t.Boolean({ default: false }),
  name: t.String({ default: undefined }),
  contactEmail: t.Optional(t.String()),
  phoneNumber: t.Optional(t.String()),
  dateOfBirth: t.Optional(t.String({ format: "date-time" })),
  followedEvents: t.Array(t.String(), { default: [] }),
  hiddenEvents: t.Array(t.String(), { default: [] }),
  blockedOrganisers: t.Array(t.String(), { default: [] }),
});

export type VibefireUserT = Static<typeof VibefireUserSchema>;
export type VibefireUserInfoT = Pick<
  VibefireUserT,
  "name" | "phoneNumber" | "contactEmail" | "dateOfBirth"
>;
export type VibefireUserNoIdT = Omit<VibefireUserT, "id">;
