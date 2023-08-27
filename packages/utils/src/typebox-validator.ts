import {
  Kind,
  type Static,
  type TLiteral,
  type TObject,
  type TSchema,
  type TUnion,
} from "@sinclair/typebox";
import { TypeCompiler, type TypeCheck } from "@sinclair/typebox/compiler";
import { type ValueErrorIterator } from "@sinclair/typebox/errors";
import { Value } from "@sinclair/typebox/value";

export class SchemaValidationError extends Error {
  constructor(errors: ValueErrorIterator | string) {
    const msg = typeof errors === "string" ? errors : errors.First();
    super(`Schema validation failed:\n${JSON.stringify(msg, null, 2)}`);
  }
}

export const tbCompiledValidator = <S extends TSchema>(check: TypeCheck<S>) => {
  return (value: unknown) => {
    if (check.Check(value)) return value;
    throw new SchemaValidationError(check.Errors(value));
  };
};

export const tbValidator = <S extends TSchema>(
  schema: S,
  unionDiscriminantKey: string = "type",
) => {
  return (value: unknown) => {
    let sch: TSchema = schema;
    if (schema[Kind] === "Union") {
      const discriminantValue: unknown = (value as Record<string, unknown>)[
        unionDiscriminantKey
      ];
      if (typeof discriminantValue !== "string") {
        throw new SchemaValidationError(
          `No discriminant key '${unionDiscriminantKey}' found in value input or is not a string`,
        );
      }

      const unionSchema = schema as unknown as TUnion<TObject[]>;
      const _schema = unionSchema.anyOf.find((memberSchema) => {
        const discriminantKeySchema =
          memberSchema.properties?.[unionDiscriminantKey];
        if (
          discriminantKeySchema === undefined ||
          discriminantKeySchema[Kind] !== "Literal"
        ) {
          throw new SchemaValidationError(
            `Discriminant key schema for '${unionDiscriminantKey}' does not exist or is a non string literal. Add '${unionDiscriminantKey}' to the schema as a string literal.`,
          );
        }
        return (
          (discriminantKeySchema as TLiteral<string>).const ===
          discriminantValue
        );
      });

      if (_schema === undefined) {
        throw new Error(
          `No schema discernable for key '${unionDiscriminantKey}' from value: '${discriminantValue}'`,
        );
      }
      sch = _schema;
    }
    if (Value.Check(sch, value)) return value as Static<S>;
    throw new SchemaValidationError(Value.Errors(sch, value));
  };
};

export const tbValidatorWithCompile = <S extends TSchema>(schema: S) => {
  const check = TypeCompiler.Compile(schema);
  return (value: unknown) => {
    if (check.Check(value)) return value;
    throw new SchemaValidationError(check.Errors(value));
  };
};
