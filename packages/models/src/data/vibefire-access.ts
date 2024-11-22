import { tb, Value, type Static } from "!models/modelling";

export type TModelVibefireEntityAccess = Static<
  typeof ModelVibefireEntityAccess
>;
export type TModelVibefireEntityAccessNoId = Omit<
  TModelVibefireEntityAccess,
  "id"
>;
export const ModelVibefireEntityAccess = tb.Object(
  {
    id: tb.String({ default: undefined }),
    type: tb.Union([
      tb.Literal("public"),
      tb.Literal("open"),
      tb.Literal("invite"),
    ]),
    inviteCode: tb.Optional(tb.String()),
  },
  { default: {} },
);
export const newVibefireEntityAccess = (
  p: TModelVibefireEntityAccessNoId,
): TModelVibefireEntityAccessNoId => {
  const d = Value.Create(ModelVibefireEntityAccess);
  d.type = p.type;
  d.inviteCode = p.inviteCode;

  return d;
};

export type AccessAction =
  | {
      action: "link";
      accessId: string;
    }
  | {
      action: "create";
      access: TModelVibefireEntityAccessNoId;
      userId: string;
    };
