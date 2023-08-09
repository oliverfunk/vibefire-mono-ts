import { Static, TSchema } from "@sinclair/typebox";
import { ParserCustomValidatorEsque } from "@trpc/server/dist/core/parser";

import { tbValidator } from "@vibefire/utils";

export const v = <S extends TSchema>(
  schema: S,
): ParserCustomValidatorEsque<Static<S>> => tbValidator(schema);
