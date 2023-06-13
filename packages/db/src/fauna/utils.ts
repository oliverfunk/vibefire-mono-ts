import { fql } from "fauna";

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
