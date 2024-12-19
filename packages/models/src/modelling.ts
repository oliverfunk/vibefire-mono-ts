import {
  Kind,
  Type as tb,
  type Static,
  type TLiteral,
  type TObject,
  type TSchema,
  type TUnion,
} from "@sinclair/typebox";
import { TypeCompiler, type TypeCheck } from "@sinclair/typebox/compiler";
import { type ValueErrorIterator } from "@sinclair/typebox/errors";
import { Value } from "@sinclair/typebox/value";

import { wrapToResult, type Result } from "./result";

export { tb, Static, Value };

export const clearable = <S extends TSchema>(setSchema: S) =>
  tb.Optional(tb.Union([setSchema, tb.Null()]));

export class SchemaValidationError extends Error {
  constructor(errors: ValueErrorIterator | string, schemaTitle?: string) {
    let msg = "";
    if (typeof errors === "string") {
      msg = errors;
    } else {
      const msgHolder: { [key: string]: string } = {};
      for (const error of errors) {
        if (Object.keys(msgHolder).length >= 5) {
          break;
        }
        msgHolder[error.path] =
          (msgHolder[error.path] ?? `Got ${error.value} -> `) +
          error.message +
          ", ";
      }
      msg = Object.entries(msgHolder)
        .map(([path, message]) => `${path}: ${message}`)
        .join("\n");
      if (Object.keys(msgHolder).length >= 5) {
        msg += "\n...";
      }
    }
    let forTitle = "";
    if (schemaTitle) {
      forTitle = `[for ${schemaTitle}]`;
    }
    super(`Schema validation failed: ${forTitle}\n${msg}`);
  }
}

export const tbCompiledValidator = <S extends TSchema>(check: TypeCheck<S>) => {
  return (value: unknown) => {
    if (check.Check(value)) return value;
    throw new SchemaValidationError(check.Errors(value));
  };
};

const tbUnionSchemaFromValue = <S extends TSchema>(
  schema: S,
  value: unknown,
  unionDiscriminantKey: string = "type",
) => {
  if (schema[Kind] !== "Union") {
    throw new SchemaValidationError(
      `Schema is not a union schema`,
      schema.title,
    );
  }

  const discriminantValue: unknown = (value as Record<string, unknown>)[
    unionDiscriminantKey
  ];
  if (typeof discriminantValue !== "string") {
    throw new SchemaValidationError(
      `No discriminant key '${unionDiscriminantKey}' found in value input or is not a string`,
      schema.title,
    );
  }

  const schemaAsUnion = schema as unknown as TUnion<TObject[]>;
  const matchingSchema = schemaAsUnion.anyOf.find((memberSchema) => {
    const discriminantKeySchema = memberSchema.properties[unionDiscriminantKey];
    if (
      discriminantKeySchema === undefined ||
      discriminantKeySchema[Kind] !== "Literal"
    ) {
      throw new SchemaValidationError(
        `Discriminant key schema for '${unionDiscriminantKey}' does not exist or is a non string literal. Add '${unionDiscriminantKey}' to the schema as a string literal.`,
        schema.title,
      );
    }
    return (
      (discriminantKeySchema as TLiteral<string>).const === discriminantValue
    );
  });

  if (matchingSchema === undefined) {
    throw new Error(
      `No schema discernable for key '${unionDiscriminantKey}' from value: '${discriminantValue}'`,
    );
  }
  return matchingSchema;
};

export const tbValidator = <S extends TSchema>(
  schema: S,
  p: {
    isUnion?: boolean;
    unionDiscriminantKey?: string;
  } = {
    isUnion: false,
    unionDiscriminantKey: "type",
  },
) => {
  return (value: unknown) => {
    let sch: TSchema = schema;
    if (p.isUnion) {
      sch = tbUnionSchemaFromValue(schema, value, p.unionDiscriminantKey);
    }
    if (Value.Check(sch, value)) return value as Static<S>;
    throw new SchemaValidationError(Value.Errors(sch, value), sch.title);
  };
};

export const tbValidatorResult =
  <S extends TSchema>(
    schema: S,
    p: {
      isUnion?: boolean;
      unionDiscriminantKey?: string;
    } = {
      isUnion: false,
      unionDiscriminantKey: "type",
    },
  ): ((value: unknown) => Result<Static<S>, Error>) =>
  (value: unknown) =>
    wrapToResult(() => tbValidator(schema, { ...p })(value));

export const tbValidatorWithCompile = <S extends TSchema>(schema: S) => {
  const check = TypeCompiler.Compile(schema);
  return (value: unknown) => {
    if (check.Check(value)) return value;
    throw new SchemaValidationError(check.Errors(value), schema.title);
  };
};

export const tbClean = <S extends TSchema, T>(schema: S, value: T) => {
  return Value.Clean(schema, value) as Static<S>;
};
