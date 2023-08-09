import { TSchema } from "@sinclair/typebox";
import { TypeCheck, TypeCompiler } from "@sinclair/typebox/compiler";
import { ValueErrorIterator } from "@sinclair/typebox/errors";
import { Value } from "@sinclair/typebox/value";

export class SchemaValidationError extends Error {
  constructor(errors: ValueErrorIterator) {
    super(
      `Schema validation failed:\n${JSON.stringify(errors.First(), null, 2)}`,
    );
  }
}

export const tbCompiledValidator = <S extends TSchema>(check: TypeCheck<S>) => {
  return (value: unknown) => {
    if (check.Check(value)) return value;
    throw new SchemaValidationError(check.Errors(value));
  };
};

export const tbValidator = <S extends TSchema>(schema: S) => {
  return (value: unknown) => {
    if (Value.Check(schema, value)) return value;
    throw new SchemaValidationError(Value.Errors(schema, value));
  };
};

export const tbValidatorWithCompile = <S extends TSchema>(schema: S) => {
  const check = TypeCompiler.Compile(schema);
  return (value: unknown) => {
    if (check.Check(value)) return value;
    throw new SchemaValidationError(check.Errors(value));
  };
};
