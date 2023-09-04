import {
  fql,
  QueryCheckError,
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

export const dfq = async <R extends QueryValue>(
  faunaClient: Client,
  query: Query,
): Promise<R> => {
  try {
    const qr = await faunaClient.query<R>(query);
    return qr.data;
  } catch (e) {
    if (e instanceof QueryCheckError) {
      console.error(
        `###\nQueryCheckError:\n${e.message}\n${e.queryInfo?.summary}\n###`,
      );
    } else {
      console.error(JSON.stringify(e, null, " "));
    }
    throw e;
  }
};
