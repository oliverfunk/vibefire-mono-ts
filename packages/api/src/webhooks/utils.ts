import type { WebhookEvent } from "@clerk/backend";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { Webhook } from "svix";

const wss = "***REMOVED***";

export const validateClerkWebhook = async <T extends WebhookEvent>(
  c: Context,
): Promise<T> => {
  const headers = c.req.headers;
  const payload = await c.req.text();

  const h: Record<string, string> = {};
  headers.forEach((v, k) => {
    h[k] = v;
  });

  const wh = new Webhook(wss);
  let msg;
  try {
    msg = wh.verify(payload, h) as T;
  } catch (err) {
    throw new HTTPException(401, { message: "invalid_token" });
  }
  return msg;
};
