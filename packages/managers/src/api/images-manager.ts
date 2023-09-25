import { type R2Bucket } from "@cloudflare/workers-types";
import { DateTime } from "luxon";

type Type = {
  mimeType: string;
  suffix: string;
};

const signatures: Record<string, Type> = {
  R0lGODdh: { mimeType: "image/gif", suffix: "gif" },
  R0lGODlh: { mimeType: "image/gif", suffix: "gif" },
  iVBORw0KGgo: { mimeType: "image/png", suffix: "png" },
  "/9j/": { mimeType: "image/jpg", suffix: "jpg" },
  "UklGRg==": { mimeType: "image/webp", suffix: "webp" },
};

const detectType = (b64: string): Type | undefined => {
  for (const s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s];
    }
  }
};

export class ImagesManager {
  private bucketImagesEU: R2Bucket;
  //   private bucketImagesUS: R2Bucket;
  private environment: "production" | "development";
  constructor(bucketImagesEU: R2Bucket) {
    this.bucketImagesEU = bucketImagesEU;
    this.environment = "development";
  }

  imagePath(
    eventId: string,
    belonging: "banner" | "additional" | "icon",
    imageType: Type,
  ) {
    return this.environment === "production"
      ? `${eventId}/${belonging}/${DateTime.now().toUnixInteger()}.${
          imageType.suffix
        }`
      : `${eventId}_${belonging}_${DateTime.now().toUnixInteger()}.${
          imageType.suffix
        }`;
  }

  async eventImageSet(
    eventId: string,
    b64_image: string,
    belonging: "banner" | "additional" | "icon",
  ) {
    const imgDetectType = detectType(b64_image);
    if (!imgDetectType) throw Error("Cannot decode image");

    const imgData = Uint8Array.from(atob(b64_image), (c) => c.charCodeAt(0));

    const imgPath = this.imagePath(eventId, belonging, imgDetectType);

    const r2Obj = await this.bucketImagesEU.put(imgPath, imgData, {
      httpMetadata: { contentType: imgDetectType.mimeType },
    });

    return r2Obj.key;
  }

  async eventImageRemove(imageKey: string) {
    await this.bucketImagesEU.delete(imageKey);
  }
}
