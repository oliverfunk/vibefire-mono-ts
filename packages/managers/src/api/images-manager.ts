import { getUploadUrlForEventImage } from "@vibefire/services/cf-images";

export class ImagesManager {
  private cfAccountId: string;
  private cfImagesApiKey: string;
  constructor(cfAccountId: string, cfImagesApiKey: string) {
    this.cfAccountId = cfAccountId;
    this.cfImagesApiKey = cfImagesApiKey;
  }

  async uploadUrlEventBanner(eventId: string) {
    getUploadUrlForEventImage();
  }

  async eventImageRemove(imageKey: string) {
    switch (this.imgBackend) {
      case "r2":
        await this.bucketImagesEU.delete(imageKey);
    }
  }
}
