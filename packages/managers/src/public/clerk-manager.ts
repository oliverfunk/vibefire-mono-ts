import { deleteUser, validateClerkWebhook } from "@vibefire/services/clerk";

import { managersContext } from "!managers/managers-context";

let _ClerkManager: ClerkManager | undefined;
export const getClerkManager = (): ClerkManager => {
  "use strict";
  if (!_ClerkManager) {
    const clerkWebhookEventSecret = managersContext().clerkWebhookEventSecret;
    const clerkSecretKey = managersContext().clerkSecretKey;
    _ClerkManager = new ClerkManager(clerkSecretKey, clerkWebhookEventSecret);
  }
  return _ClerkManager;
};

export class ClerkManager {
  private clerkWebhookEventSecret?: string;
  private clerkSecretKey?: string;
  constructor(clerkSecret?: string, clerkWebhookEventSecret?: string) {
    this.clerkWebhookEventSecret = clerkWebhookEventSecret;
    if (clerkSecret) {
      this.clerkSecretKey = clerkSecret;
    }
  }

  validateWebhookEvent(reqHeaders: Record<string, string>, reqPayload: string) {
    if (!this.clerkWebhookEventSecret) {
      throw new Error("ClerkManager missing clerkWebhookEventSecret");
    }
    const validatedWh = validateClerkWebhook(
      reqHeaders,
      reqPayload,
      this.clerkWebhookEventSecret,
    );
    if (!validatedWh) {
      throw new Error("Invalid webhook");
    }
    return validatedWh;
  }

  async userDeleteProfile(userAid: string) {
    if (!this.clerkSecretKey) {
      throw new Error("ClerkSecretKey is missing!");
    }
    return await deleteUser(this.clerkSecretKey, userAid);
  }
}
