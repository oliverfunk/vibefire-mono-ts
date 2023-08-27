import { ApiDataQueryManager } from "./data-query/api-data-query-manager";

let _ApiDataQueryManager: ApiDataQueryManager | undefined;
export const getApiDataQueryManager = (
  faunaKey: string,
): ApiDataQueryManager => {
  "use strict";
  if (!_ApiDataQueryManager) {
    console.debug("Creating new ApiDataQueryManager");
    _ApiDataQueryManager = new ApiDataQueryManager(faunaKey, "");
  }
  return _ApiDataQueryManager;
};
