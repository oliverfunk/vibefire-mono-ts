import {
  signedInAuthObject,
  signedOutAuthObject,
  verifyToken,
  type AuthObject,
} from "@clerk/backend";

export type ClerkAuthContext = AuthObject;

export const authRequestWithClerk = async (
  pemString: string,
  req: Request,
): Promise<ClerkAuthContext> => {
  const reqJwtToken = req.headers.get("Authorization");
  if (!reqJwtToken || reqJwtToken === "undefined" || reqJwtToken === "null") {
    return signedOutAuthObject();
  }

  const jwtPayload = await verifyToken(reqJwtToken, {
    issuer: "https://settled-moray-32.clerk.accounts.dev",
    jwtKey: pemString,
  });

  return signedInAuthObject(jwtPayload, {
    // idk why you need these atm,
    // has something to do with loading the Clerk client
    apiUrl: "https://settled-moray-32.clerk.accounts.dev",
    apiVersion: "2023-06-07",
    token: reqJwtToken,
  });
};
