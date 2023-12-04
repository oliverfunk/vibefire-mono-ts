import { validateClerkWebhook } from "@vibefire/services/clerk";

import { managersContext } from "~/managers-context";

let _ClerkWebhookManager: ClerkWebhookManager | undefined;
export const getClerkWebhookManager = (): ClerkWebhookManager => {
  "use strict";
  if (!_ClerkWebhookManager) {
    const clerkWebhookSecret = managersContext().clerkWebhookSecret!;
    _ClerkWebhookManager = new ClerkWebhookManager(clerkWebhookSecret);
  }
  return _ClerkWebhookManager;
};

export class ClerkWebhookManager {
  private clerkWebhookSecret: string;
  constructor(clerkWebhookSecret: string) {
    this.clerkWebhookSecret = clerkWebhookSecret;
  }
  validateWebhookEvent(reqHeaders: Record<string, string>, reqPayload: string) {
    const validatedWh = validateClerkWebhook(
      reqHeaders,
      reqPayload,
      this.clerkWebhookSecret,
    );
    if (!validatedWh) {
      throw new Error("Invalid webhook");
    }
    return validatedWh;
  }
}
