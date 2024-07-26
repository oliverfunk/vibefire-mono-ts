import { tb, type Static } from "@vibefire/utils";

export type TModelFaunaAbortCallValue = Static<typeof ModelFaunaAbortCallValue>;
export const ModelFaunaAbortCallValue = tb.Union([
  tb.Object({
    code: tb.Union([
      tb.Literal("ise"),
      tb.Literal("does_not_exist"),
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
      tb.Literal("login"),
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

export class FaunaAbortedCall extends Error {
  constructor(readonly value: TModelFaunaAbortCallValue) {
    super();
  }
}
