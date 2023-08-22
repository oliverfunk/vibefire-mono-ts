import { type Static, type TSchema } from "@sinclair/typebox";
import { TRPCError } from "@trpc/server";

import { SchemaValidationError, tbValidator } from "@vibefire/utils";

export const v = <S extends TSchema>(schema: S) => {
  const validator: Validator<S> = (value) => {
    try {
      return tbValidator(schema)(value);
    } catch (error) {
      if (error instanceof SchemaValidationError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }
      throw error;
    }
  };
  return validator;
};

export type Validator<S extends TSchema> = (value: unknown) => Static<S>;

export function vv<S extends TSchema>(schema: S) {
  return tbValidator(schema);
}
