import { resourceLocator } from "@vibefire/utils";

import { CloudFlareImagesClient } from "./client";

export const cloudFlareImagesServiceSymbol = Symbol(
  "cloudFlareImagesServiceSymbol",
);

export const getCloudFlareImagesService = (): CloudFlareImagesService =>
  resourceLocator().bindResource<CloudFlareImagesService>(
    cloudFlareImagesServiceSymbol,
    (ctx) => {
      const { cloudFlare } = ctx;
      if (!cloudFlare) {
        throw new Error("cloudFlare configuration is missing");
      }
      return new CloudFlareImagesService(
        new CloudFlareImagesClient(
          cloudFlare.accountId,
          cloudFlare.imagesApiKey,
        ),
      );
    },
  );

export class CloudFlareImagesService {
  constructor(private readonly client: CloudFlareImagesClient) {}

  async getUploadUrl(p: {
    expiry?: string;
    metadata?: Record<string, string>;
  }) {
    const { metadata, expiry } = p;
    // todo: extract relevant data from response
    console.log("!!!! todo: extract relveant data from response");
    return await this.client.directUpload({ expiry, metadata });
  }

  async deleteImage(imageId: string) {
    await this.client.deleteImage(imageId);
  }
}
