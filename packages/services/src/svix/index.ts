import { type WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

export const validateClerkWebhook = (
  reqHeaders: Record<string, string>,
  reqPayload: string,
  webhookSecret: string,
): WebhookEvent | undefined => {
  const wh = new Webhook(webhookSecret);
  try {
    return wh.verify(reqPayload, reqHeaders) as WebhookEvent;
  } catch (err) {
    console.error("validateClerkWebhook", err);
    return undefined;
  }
};
