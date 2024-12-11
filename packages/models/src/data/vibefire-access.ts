import { tb, Value, type Static } from "!models/modelling";

export type TModelVibefireAccess = Static<typeof ModelVibefireAccess>;
export type TModelVibefireAccessNoId = Omit<TModelVibefireAccess, "id">;
export const ModelVibefireAccess = tb.Object(
  {
    id: tb.String({ default: undefined }),
    type: tb.Union([
      tb.Literal("public"),
      tb.Literal("open"),
      tb.Literal("invite"),
    ]),
  },
  { default: {} },
);
export const newVibefireAccess = (
  p: TModelVibefireAccessNoId,
): TModelVibefireAccessNoId => {
  const d = Value.Create(ModelVibefireAccess);
  d.type = p.type;

  return d;
};

export type AccessAction =
  | {
      action: "link";
      accessId: string;
    }
  | {
      action: "create";
      access: TModelVibefireAccessNoId;
      userId: string;
    };
