import {
  createClerkClient,
  type ClerkClient,
  type WebhookEvent,
} from "@clerk/backend";
import {
  signedOutAuthObject,
  type AuthObject,
  type SignedInAuthObject,
  type SignedOutAuthObject,
} from "@clerk/backend/internal";
import { Webhook } from "svix";

const clerkApiUrl = "https://advanced-buffalo-6.clerk.accounts.dev";

export const getClerkAPIClient = (clerkSecretKey: string): ClerkClient =>
  createClerkClient({
    publishableKey:
      "***REMOVED***",
    secretKey: clerkSecretKey,
    apiUrl: clerkApiUrl,
  });

export type ClerkAuthContext = AuthObject;
export type ClerkSignedInAuthContext = SignedInAuthObject;
export type ClerkSignedOutAuthContext = SignedOutAuthObject;

export const authRequestWithClerk = async (
  clerkSecretKey: string,
  req: Request,
): Promise<ClerkAuthContext> => {
  const reqAuth =
    await getClerkAPIClient(clerkSecretKey).authenticateRequest(req);
  return reqAuth.toAuth() ?? signedOutAuthObject();
};

export const validateClerkWebhook = (
  reqHeaders: Record<string, string>,
  reqPayload: string,
  webhookSecret: string,
): WebhookEvent | undefined => {
  const wh = new Webhook(webhookSecret);
  try {
    return wh.verify(reqPayload, reqHeaders) as WebhookEvent;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const deleteUser = async (clerkSecretKey: string, userAid: string) => {
  const res = await fetch(`https://api.clerk.com/v1/users/${userAid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${clerkSecretKey}`,
    },
  });
  if (!res.ok) {
    throw new Error(
      `Failed to delete user ${userAid}\n${JSON.stringify(
        await res.json(),
        null,
        2,
      )}`,
    );
  }
};
