import { type ImageVariant } from "./typings";

const separator = "/";

const imageId = (base: string, id: string) => [base, id].join(separator);

const imagePath = (base: string, id: string, variant: ImageVariant) =>
  [imageId(base, id), variant].join(separator);

export const organisationProfileImageId = (orgId: string) =>
  imageId("profiles", orgId);

export const organisationProfileImagePath = (orgId: string) =>
  imagePath("profiles", orgId, "public");
