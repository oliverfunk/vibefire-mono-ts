import { Type as t, type Static } from "@sinclair/typebox";

export const VibefireUserSchema = t.Object({
  id: t.String(),
  aid: t.String(),
  onboardingComplete: t.Boolean(),
  name: t.String(),
  contactEmail: t.Optional(t.String()),
  phoneNumber: t.Optional(t.String()),
  dateOfBirth: t.Optional(t.String({ format: "date-time" })),
  followedEvents: t.Array(t.String()),
  followedOrganisations: t.Array(t.String()),
});

export type VibefireUserT = Static<typeof VibefireUserSchema>;
export type VibefireUserInfoT = Pick<
  VibefireUserT,
  "name" | "phoneNumber" | "contactEmail" | "dateOfBirth"
>;
export type VibefireUserNoIdT = Omit<VibefireUserT, "id">;
