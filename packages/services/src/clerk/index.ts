import {
  signedInAuthObject,
  signedOutAuthObject,
  verifyToken,
  type AuthObject,
  type SignedInAuthObject,
  type SignedOutAuthObject,
} from "@clerk/backend";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

export type ClerkAuthContext = AuthObject;
export type ClerkSignedInAuthContext = SignedInAuthObject;
export type ClerkSignedOutAuthContext = SignedOutAuthObject;

export const authRequestWithClerk = async (
  clerkPemString: string,
  clerkIssuerApiUrl: string,
  req: Request,
): Promise<ClerkAuthContext> => {
  const reqJwtToken = req.headers.get("Authorization");
  if (!reqJwtToken || reqJwtToken === "undefined" || reqJwtToken === "null") {
    return signedOutAuthObject();
  }

  const jwtPayload = await verifyToken(reqJwtToken, {
    issuer: clerkIssuerApiUrl,
    jwtKey: clerkPemString,
  });

  return signedInAuthObject(jwtPayload, {
    // idk why you need these atm,
    // has something to do with loading the Clerk client
    apiUrl: clerkIssuerApiUrl,
    apiVersion: "2023-06-07",
    token: reqJwtToken,
  });
};

export const validateClerkWebhook = <T extends WebhookEvent>(
  reqHeaders: Record<string, string>,
  reqPayload: string,
  webhookSecret: string,
): T | undefined => {
  const wh = new Webhook(webhookSecret);
  let msg = undefined;
  try {
    msg = wh.verify(reqPayload, reqHeaders) as T;
  } catch (err) {
    console.error(err);
  }
  return msg;
};
