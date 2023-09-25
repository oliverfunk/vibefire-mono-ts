import { Type as t, type TSchema } from "@sinclair/typebox";

export const unsettable = <S extends TSchema>(setSchema: S) =>
  t.Optional(t.Union([setSchema, t.Null()]));
