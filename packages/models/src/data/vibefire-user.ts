import { tb, Value, type Static } from "@vibefire/utils";

export type TModelVibefireUser = Static<typeof ModelVibefireUser>;
export type TModelVibefireUserNoId = Omit<TModelVibefireUser, "id">;
export const ModelVibefireUser = tb.Object({
  id: tb.String({ default: undefined }),
  aid: tb.String({ default: undefined }),
  pushToken: tb.Optional(tb.String()),
  onboardingComplete: tb.Boolean({ default: false }),
  name: tb.String({ default: undefined }),
  email: tb.Optional(tb.String()),
  phoneNumber: tb.Optional(tb.String()),
  dateOfBirth: tb.Optional(tb.String({ format: "date" })),
  hiddenEvents: tb.Array(tb.String(), { default: [] }),
  blockedOrganisers: tb.Array(tb.String(), { default: [] }),
  kycStatus: tb.Union([
    tb.Literal("not_started"),
    tb.Literal("pending"),
    tb.Literal("approved"),
  ]),
  state: tb.Union([
    tb.Literal("active"),
    tb.Literal("blocked"),
    tb.Literal("deleting"),
  ]),

  // meta
  epochCreated: tb.Number({ default: undefined }),
  epochLastSession: tb.Number({ default: undefined }),
});

export const newVibefireUser = (p: {
  aid: TModelVibefireUser["aid"];
  name: TModelVibefireUser["name"];
  email: TModelVibefireUser["email"];
  epochCreated: TModelVibefireUser["epochCreated"];
}): TModelVibefireUserNoId => {
  const d = Value.Create(ModelVibefireUser);
  d.aid = p.aid;
  d.name = p.name;
  d.email = p.email;
  d.epochCreated = p.epochCreated;
  return d;
};
