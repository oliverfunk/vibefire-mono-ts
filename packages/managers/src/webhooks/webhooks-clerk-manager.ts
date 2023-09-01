import { type UserWebhookEvent } from "@clerk/backend";

import { validateClerkWebhook } from "@vibefire/services/clerk";

export class WebhooksClerkManager {
  private clerkWebhookSecret: string;
  constructor(clerkWebhookSecret: string) {
    this.clerkWebhookSecret = clerkWebhookSecret;
  }
  validateUserWebhookEvent(
    reqHeaders: Record<string, string>,
    reqPayload: string,
  ) {
    const validatedWh = validateClerkWebhook<UserWebhookEvent>(
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
