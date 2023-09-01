import { WebhooksClerkManager } from "./webhooks-clerk-manager";
import { WebhooksDataManager } from "./webhooks-data-manager";

let _WebhooksDataManager: WebhooksDataManager | undefined;
export const getWebhooksDataManager = (
  faunaKey: string,
): WebhooksDataManager => {
  "use strict";
  if (!_WebhooksDataManager) {
    console.debug("Creating new WebhooksDataManager");
    _WebhooksDataManager = new WebhooksDataManager(faunaKey);
  }
  return _WebhooksDataManager;
};

let _WebhooksClerkManager: WebhooksClerkManager | undefined;
export const getWebhooksClerkManager = (
  faunaKey: string,
): WebhooksClerkManager => {
  "use strict";
  if (!_WebhooksClerkManager) {
    console.debug("Creating new WebhooksClerkManager");
    _WebhooksClerkManager = new WebhooksClerkManager(faunaKey);
  }
  return _WebhooksClerkManager;
};
