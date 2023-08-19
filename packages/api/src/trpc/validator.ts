import { TSchema } from "@sinclair/typebox";
import { TRPCError } from "@trpc/server";

import { SchemaValidationError, tbValidator } from "@vibefire/utils";

export const v = <S extends TSchema>(schema: S) => {
  return (value: unknown) => {
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
};
