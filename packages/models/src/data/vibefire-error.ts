import { tb, type Static } from "@vibefire/utils";

export type TModelVibefireError = Static<typeof ModelVibefireError>;
export const ModelVibefireError = tb.Union([
  tb.Object({
    code: tb.Union([
      tb.Literal("ise"),
      tb.Literal("rule_violation"),
      tb.Literal("does_not_exist"),
      tb.Literal("already_exists"),
      tb.Literal("link_not_found"),
      tb.Literal("not_published"),
      tb.Literal("requested_membership"),
    ]),
    action: tb.String(),
    message: tb.String(),
  }),
  tb.Object({
    code: tb.Literal("unauthenticated"),
    action: tb.Union([
      tb.Literal("signin"),
      tb.Literal("deleted"),
      tb.Literal("blocked"),
    ]),
    message: tb.String(),
  }),
  tb.Object({
    code: tb.Literal("no_membership"),
    action: tb.Union([
      tb.Literal("join"),
      tb.Literal("request"),
      tb.Literal("code"),
    ]),
    message: tb.String(),
  }),
  tb.Object({
    code: tb.Literal("insufficient_permission"),
    action: tb.Union([tb.Literal("manager")]),
    message: tb.String(),
  }),
]);
