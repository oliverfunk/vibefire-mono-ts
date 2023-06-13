import {
  decodeJwt,
  signedInAuthObject,
  signedOutAuthObject,
  type AuthObject,
} from "@clerk/backend";

export type AuthContext = AuthObject;

export const getBackendAuthContext = (req: Request): AuthContext => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader === "undefined") {
    return signedOutAuthObject();
  }
  const { payload } = decodeJwt(authHeader);
  return signedInAuthObject(payload, {
    apiUrl: "https://settled-moray-32.clerk.accounts.dev",
    apiVersion: "2023-06-07",
    // This is a test publishable key. You can find your publishable key in the API Keys section of your Clerk Dashboard.
    token: "***REMOVED***",
  });
};
