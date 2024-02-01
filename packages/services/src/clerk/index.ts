import {
  Clerk,
  signedInAuthObject,
  signedOutAuthObject,
  verifyToken,
  type SignedInAuthObject,
  type SignedOutAuthObject,
  type WebhookEvent,
} from "@clerk/backend";
import { Webhook } from "svix";

const clerkApiUrl = "https://advanced-buffalo-6.clerk.accounts.dev";

export type ClerkClientType = ReturnType<typeof Clerk>;

export const getClerkClient = (clerkSecretKey: string): ClerkClientType =>
  Clerk({
    // apiUrl: clerkApiUrl,
    secretKey: clerkSecretKey,
  });

export type ClerkAuthContext =
  | ClerkSignedInAuthContext
  | ClerkSignedOutAuthContext;
export type ClerkSignedInAuthContext = SignedInAuthObject;
export type ClerkSignedOutAuthContext = SignedOutAuthObject;

export const authRequestWithClerk = async (
  clerkPemString: string,
  req: Request,
): Promise<ClerkAuthContext> => {
  const reqJwtToken = req.headers.get("Authorization");
  if (!reqJwtToken || reqJwtToken === "undefined" || reqJwtToken === "null") {
    return signedOutAuthObject();
  }

  const jwtPayload = await verifyToken(reqJwtToken, {
    issuer: clerkApiUrl,
    jwtKey: clerkPemString,
  });

  return signedInAuthObject(jwtPayload, {
    // idk why you need these atm,
    // has something to do with loading the Clerk client
    apiUrl: clerkApiUrl,
    apiVersion: "2023-06-07",
    token: reqJwtToken,
  });
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
