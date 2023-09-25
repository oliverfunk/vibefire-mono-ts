import { type R2Bucket } from "@cloudflare/workers-types";

import { ApiDataQueryManager } from "./data-query/api-data-query-manager";
import { GoogleMapsManager } from "./google-maps-manager";
import { ImagesManager } from "./images-manager";

let _ApiDataQueryManager: ApiDataQueryManager | undefined;
export const getApiDataQueryManager = (
  googleMapsApiKey: string,
  faunaKey: string,
): ApiDataQueryManager => {
  "use strict";
  if (!_ApiDataQueryManager) {
    console.debug("Creating new ApiDataQueryManager");
    _ApiDataQueryManager = new ApiDataQueryManager(googleMapsApiKey, faunaKey);
  }
  return _ApiDataQueryManager;
};

let _GoogleMapsManager: GoogleMapsManager | undefined;
export const getGoogleMapsManager = (
  googleMapsApiKey: string,
): GoogleMapsManager => {
  "use strict";
  if (!_GoogleMapsManager) {
    console.debug("Creating new GoogleMapsManager");
    _GoogleMapsManager = new GoogleMapsManager(googleMapsApiKey);
  }
  return _GoogleMapsManager;
};

let _imagesManager: ImagesManager | undefined;
export const getImagesManager = (bucketImagesEU: R2Bucket): ImagesManager => {
  "use strict";
  if (!_imagesManager) {
    console.debug("Creating new ImagesManager");
    _imagesManager = new ImagesManager(bucketImagesEU);
  }
  return _imagesManager;
};
