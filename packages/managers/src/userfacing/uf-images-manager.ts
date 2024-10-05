// import {
//   CloudFlareImagesService,
//   getCloudFlareImagesService,
// } from "@vibefire/services/cloudflare-images";
// import { resourceLocator } from "@vibefire/utils";

// export const imagesManagerSymbol = Symbol("imagesManagerSymbol");
// export const getImagesManager = (): ImagesManager => {
//   return resourceLocator().bindResource<ImagesManager>(
//     imagesManagerSymbol,
//     (ctx) => {
//       const { cloudFlare } = ctx;
//       if (!cloudFlare) {
//         throw new Error("CloudFlare configuration is missing");
//       }
//       return new ImagesManager(cloudFlare.accountId, cloudFlare.imagesApiKey);
//     },
//   );
// };

// export class ImagesManager {
//   constructor(private readonly cfImages: CloudFlareImagesService) {}

//   async eventUploadUrl(eventId: string, organiserId: string) {
//     const res = await getCloudFlareImagesService(
//       this.cfAccountId,
//       this.cfImagesApiKey,
//       eventId,
//       organiserId,
//     );
//     const uploadData = res["result"] as {
//       id: string;
//       uploadURL: string;
//     };
//     return uploadData;
//   }

//   async eventImageRemove(imageKey: string) {
//     // TODO
//   }
// }
