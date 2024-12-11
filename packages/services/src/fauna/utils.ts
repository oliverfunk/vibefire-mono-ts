import {
  AbortError,
  NullDocument,
  QueryCheckError,
  QueryRuntimeError,
  type Client,
  type Query,
  type QueryValue,
} from "fauna";

import {
  ModelVibefireError,
  Result,
  tbValidatorResult,
  type AsyncResult,
} from "@vibefire/models";

import { FaunaCallAborted } from "./errors";

export type FaunaAsyncResult<R> = AsyncResult<R, FaunaCallAborted>;

const runFaunaQuery = async <R extends QueryValue>(
  faunaClient: Client,
  query: Query<R>,
  logQuery = false,
  postProcess?: (d: R) => R,
): Promise<R> => {
  try {
    const qr = await faunaClient.query<R>(query);

    if (logQuery) console.log(JSON.stringify(qr, null, 2));

    if (postProcess) {
      return postProcess(qr.data);
    }

    return qr.data;
  } catch (e) {
    if (e instanceof QueryCheckError) {
      e.message = `\n\n-----------\n${e.name} [${e.code}]:\n${e.message}\n${e.queryInfo?.summary}\n-----------\n`;
    }
    if (e instanceof QueryRuntimeError) {
      e.message = `\n\n-----------\n${e.name} [${e.code}]:\n${e.message}\n${e.queryInfo?.summary}\n-----------\n`;
    } else if (e instanceof AbortError) {
      e.message = `\n\n-----------\n${e.name} [${e.code}]:\n${e.message}\n${e.queryInfo?.summary}\n-----------\n`;
    }
    throw e;
  }
};

const runFaunaNullableQuery = async <R extends QueryValue>(
  faunaClient: Client,
  query: Query<R>,
  logQuery?: boolean,
  postProcess?: (d: R | null) => R,
): Promise<R | null> => {
  const d = await runFaunaQuery<R | NullDocument>(faunaClient, query, logQuery);
  const r: R | null = d instanceof NullDocument ? null : d;
  if (postProcess) {
    return postProcess(r);
  }
  return r;
};

const runFaunaAbortableQuery = async <R extends QueryValue>(
  faunaClient: Client,
  query: Query<R>,
  logQuery?: boolean,
  postProcess?: (d: R) => R,
): FaunaAsyncResult<R> => {
  try {
    return Result.ok(
      await runFaunaQuery<R>(faunaClient, query, logQuery, postProcess),
    );
  } catch (e) {
    if (e instanceof AbortError) {
      const abtRes = tbValidatorResult(ModelVibefireError)(e.abort);
      if (abtRes.isOk) {
        return Result.err(new FaunaCallAborted(abtRes.value));
      }
    }
    throw e;
  }
};

export const faunaQuery = <R extends QueryValue>(
  faunaClient: Client,
  query: Query<R>,
  p?: {
    logQuery?: boolean;
    postProcess?: (d: R) => R;
  },
): {
  result: Promise<R>;
  query: Query;
} => ({
  result: runFaunaQuery<R>(faunaClient, query, p?.logQuery, p?.postProcess),
  query,
});

export const faunaNullableQuery = <R extends QueryValue>(
  faunaClient: Client,
  query: Query<R>,
  p?: {
    logQuery?: boolean;
    postProcess?: (d: R | null) => R;
  },
): {
  result: Promise<R | null>;
  query: Query<R>;
} => ({
  result: runFaunaNullableQuery<R>(
    faunaClient,
    query,
    p?.logQuery,
    p?.postProcess,
  ),
  query,
});

export const faunaAbortableQuery = <R extends QueryValue>(
  faunaClient: Client,
  query: Query<R>,
  p?: {
    logQuery?: boolean;
    postProcess?: (d: R) => R;
  },
): {
  result: FaunaAsyncResult<R>;
  query: Query<R>;
} => ({
  result: runFaunaAbortableQuery<R>(
    faunaClient,
    query,
    p?.logQuery,
    p?.postProcess,
  ),
  query,
});
