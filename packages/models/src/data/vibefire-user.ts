import { tb, Value, type Static } from "!models/modelling";

export type TModelVibefireUser = Static<typeof ModelVibefireUser>;
export type TModelVibefireUserNoId = Omit<TModelVibefireUser, "id">;
export const ModelVibefireUser = tb.Object({
  id: tb.String({ default: undefined }),
  aid: tb.String({ default: undefined }),
  pushToken: tb.Optional(tb.String()),
  onboardingComplete: tb.Boolean({ default: false }),
  name: tb.Optional(tb.String()),
  email: tb.Optional(tb.String()),
  phoneNumber: tb.Optional(tb.String()),
  dateOfBirth: tb.Optional(tb.String({ format: "date" })),
  hiddenEvents: tb.Array(tb.String(), { default: [] }),
  blockedOrganisers: tb.Array(tb.String(), { default: [] }),
  kycStatus: tb.Union([
    tb.Literal("not-started"),
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
  phoneNumber: TModelVibefireUser["phoneNumber"];
  dateOfBirth: TModelVibefireUser["dateOfBirth"];
  epochCreated: TModelVibefireUser["epochCreated"];
}): TModelVibefireUserNoId => {
  const d = Value.Create(ModelVibefireUser);
  d.aid = p.aid;
  d.kycStatus = "not-started";
  d.name = p.name;
  d.email = p.email;
  d.dateOfBirth = p.dateOfBirth;
  d.epochCreated = p.epochCreated;
  return d;
};
