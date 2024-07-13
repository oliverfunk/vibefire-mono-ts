import {
  fql,
  NullDocument,
  QueryCheckError,
  QueryRuntimeError,
  type Client,
  type Query,
  type QueryValue,
} from "fauna";

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
