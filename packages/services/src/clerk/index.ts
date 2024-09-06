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

import { serviceLocator } from "!services/locator";

export type ClerkAuthContext = AuthObject;
export type ClerkSignedInAuthContext = SignedInAuthObject;
export type ClerkSignedOutAuthContext = SignedOutAuthObject;

export type ClerkService = ClerkServiceImpl;

export const getClerkService = (
  clerkSecretKey: string,
  clerkPemString: string,
  clerkApiUrl = "https://advanced-buffalo-6.clerk.accounts.dev",
  clerkPublishableKey = "***REMOVED***",
): ClerkService =>
  serviceLocator<ClerkService>().throughBind("clerk", () => {
    const clerkClient = createClerkClient({
      publishableKey: clerkPublishableKey,
      secretKey: clerkSecretKey,
      jwtKey: clerkPemString,
      apiUrl: clerkApiUrl,
    });
    return new ClerkServiceImpl(clerkClient);
  });

class ClerkServiceImpl {
  constructor(private readonly client: ClerkClient) {}

  async authRequest(req: Request) {
    const reqAuth = await this.client.authenticateRequest(req);
    return reqAuth.toAuth() ?? signedOutAuthObject();
  }

  async deleteUser(userAid: string) {
    return await this.client.users.deleteUser(userAid);
  }
}

// export const deleteUser = async (clerkSecretKey: string, userAid: string) => {
//   const res = await fetch(`https://api.clerk.com/v1/users/${userAid}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${clerkSecretKey}`,
//     },
//   });
//   if (!res.ok) {
//     throw new Error(
//       `Failed to delete user ${userAid}\n${JSON.stringify(
//         await res.json(),
//         null,
//         2,
//       )}`,
//     );
//   }
// };
