import { tb, type Static } from "@vibefire/utils";

export const ModelVibefireUser = tb.Object({
  id: tb.String({ default: undefined }),
  aid: tb.String({ default: undefined }),
  pushToken: tb.Optional(tb.String()),
  onboardingComplete: tb.Boolean({ default: false }),
  name: tb.String({ default: undefined }),
  contactEmail: tb.Optional(tb.String()),
  phoneNumber: tb.Optional(tb.String()),
  dateOfBirth: tb.Optional(tb.String({ format: "date-time" })),
  hiddenEvents: tb.Array(tb.String(), { default: [] }),
  blockedOrganisers: tb.Array(tb.String(), { default: [] }),
  kycStatus: tb.Optional(
    tb.Union([tb.Literal("pending"), tb.Literal("approved")]),
  ),
  state: tb.Optional(
    tb.Union([
      tb.Literal("active"),
      tb.Literal("blocked"),
      tb.Literal("deleting"),
    ]),
  ),
  epochCreated: tb.String(),
  epochLastSession: tb.String(),
});

export type TModelVibefireUser = Static<typeof ModelVibefireUser>;
export type VibefireUserInfoT = Pick<
  TModelVibefireUser,
  "name" | "phoneNumber" | "contactEmail" | "dateOfBirth"
>;
export type VibefireUserNoIdT = Omit<TModelVibefireUser, "id">;
