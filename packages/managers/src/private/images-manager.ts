import { getUploadUrlForEventImage } from "@vibefire/services/cf-images";

import { managersContext } from "~/managers-context";

let _imagesManager: ImagesManager | undefined;
export const getImagesManager = (): ImagesManager => {
  "use strict";
  if (!_imagesManager) {
    const cfAccountId = managersContext().cfAccountId!;
    const cfImagesApiKey = managersContext().cfImagesApiKey!;
    _imagesManager = new ImagesManager(cfAccountId, cfImagesApiKey);
  }
  return _imagesManager;
};

export class ImagesManager {
  private cfAccountId: string;
  private cfImagesApiKey: string;
  constructor(cfAccountId: string, cfImagesApiKey: string) {
    this.cfAccountId = cfAccountId;
    this.cfImagesApiKey = cfImagesApiKey;
  }

  async eventUploadUrl(eventId: string, organiserId: string) {
    const res = await getUploadUrlForEventImage(
      this.cfAccountId,
      this.cfImagesApiKey,
      eventId,
      organiserId,
    );
    const uploadData = res["result"] as {
      id: string;
      uploadURL: string;
    };
    return uploadData;
  }

  async eventImageRemove(imageKey: string) {
    // TODO
  }
}
