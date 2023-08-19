import { DBServiceManager } from "./db/db-service-manager";

var _dbServiceManager: DBServiceManager | undefined;
export const getDBServiceManager = (faunaKey: string): DBServiceManager => {
  "use strict";
  if (!_dbServiceManager) {
    console.debug("Creating new DBServiceManager");
    _dbServiceManager = new DBServiceManager(faunaKey, "");
  }
  return _dbServiceManager;
};
