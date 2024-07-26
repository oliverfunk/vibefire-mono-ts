import {
  AbortError,
  fql,
  NullDocument,
  QueryCheckError,
  QueryRuntimeError,
  type Client,
  type Query,
  type QueryValue,
} from "fauna";

import {
  Result,
  tbValidator,
  tbValidatorResult,
  type AsyncResult,
} from "@vibefire/utils";

import { FaunaAbortedCall, ModelFaunaAbortCallValue } from "./abort-errors";

export type FaunaAsyncResult<R> = AsyncResult<R, FaunaAbortedCall>;

const runFaunaQuery = async <R extends QueryValue>(
  faunaClient: Client,
  query: Query,
  logQuery = false,
  postProcess?: (d: R) => R,
): Promise<R> => {
  try {
    const qr = await faunaClient.query<R>(query);

    if (logQuery) console.log(qr);

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
  query: Query,
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
  query: Query,
  logQuery?: boolean,
  postProcess?: (d: R) => R,
): FaunaAsyncResult<R> => {
  try {
    return Result.ok(
      await runFaunaQuery<R>(faunaClient, query, logQuery, postProcess),
    );
  } catch (e) {
    if (e instanceof AbortError) {
      const ab = e.abort;
      if (tbValidatorResult(ModelFaunaAbortCallValue)(ab).isOk) {
        return Result.err(new FaunaAbortedCall(ab));
      }
    }
    throw e;
  }
};

export const faunaQuery = <R extends QueryValue>(
  faunaClient: Client,
  query: Query,
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
  query: Query,
  p?: {
    logQuery?: boolean;
    postProcess?: (d: R | null) => R;
  },
): {
  result: Promise<R | null>;
  query: Query;
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
  query: Query,
  p?: {
    logQuery?: boolean;
    postProcess?: (d: R) => R;
  },
): {
  result: FaunaAsyncResult<R>;
  query: Query;
} => ({
  result: runFaunaAbortableQuery<R>(
    faunaClient,
    query,
    p?.logQuery,
    p?.postProcess,
  ),
  query,
});
