import {
  fql,
  QueryCheckError,
  QueryRuntimeError,
  type Client,
  type Query,
  type QueryValue,
} from "fauna";

import { Result } from "@vibefire/utils";

export const CollectionExists = (collectionName: string) =>
  fql`Collection.byName(${collectionName}) != null`;

export const CreateCollection = (collectionName: string) => {
  return fql`Collection.create({ name: ${collectionName} })`;
};

export const CreateCollectionIfDne = (collectionName: string) => {
  return fql`
    if (${CollectionExists(collectionName)} == false) {
        ${CreateCollection(collectionName)}
    }
`;
};

const runFaunaQuery = async <R extends QueryValue>(
  faunaClient: Client,
  query: Query,
): Promise<Result<R, Error>> => {
  try {
    const qr = await faunaClient.query<R>(query);
    return Result.ok(qr.data);
  } catch (e) {
    if (e instanceof QueryCheckError) {
      e.message = `\n\n-----------\n${e.name} [${e.code}]:\n${e.message}\n${e.queryInfo?.summary}\n-----------\n`;
    }
    if (e instanceof QueryRuntimeError) {
      e.message = `\n\n-----------\n${e.name} [${e.code}]:\n${e.message}\n${e.queryInfo?.summary}\n-----------\n`;
    }
    throw e;
  }
};

export const faunaQuery = <R extends QueryValue>(
  faunaClient: Client,
  query: Query,
): {
  result: Promise<Result<R, Error>>;
  query: Query;
} => ({
  result: runFaunaQuery<R>(faunaClient, query),
  query,
});
