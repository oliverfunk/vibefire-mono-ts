import {
  createClerkClient,
  type AuthObject,
  type ClerkClient,
  type ClerkOptions,
} from "@clerk/backend";
import { signedOutAuthObject } from "@clerk/backend/internal";

import { resourceLocator } from "@vibefire/utils";

export type ClerkAuthContext = AuthObject;

export const clerkServiceSymbol = Symbol("clerkServiceSymbol");

export const getClerkService = (options?: ClerkOptions): ClerkService =>
  resourceLocator().bindResource<ClerkService>(clerkServiceSymbol, (ctx) => {
    const { clerk } = ctx;
    if (!clerk) {
      throw new Error("Clerk configuration is missing");
    }
    const clerkClient = createClerkClient({
      secretKey: clerk.secretKey,
      jwtKey: clerk.pemString,
      apiUrl: clerk.apiUrl ?? "https://advanced-buffalo-6.clerk.accounts.dev",
      publishableKey: clerk.publishableKey,
      ...options,
    });
    return new ClerkService(clerkClient);
  });

export class ClerkService {
  constructor(private readonly client: ClerkClient) {}

  async authenticateRequest(req: Request): Promise<ClerkAuthContext> {
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
