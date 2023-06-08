import {
  decodeJwt,
  signedInAuthObject,
  signedOutAuthObject,
  type AuthObject,
} from "@clerk/backend";

export type AuthContext = AuthObject;

export const getBackendAuthContext = (req: Request): AuthContext => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return signedOutAuthObject();
  }
  const { payload } = decodeJwt(authHeader);
  return signedInAuthObject(payload, {
    apiUrl: "https://settled-moray-32.clerk.accounts.dev",
    apiVersion: "2023-06-07",
    token: "***REMOVED***",
  });
};
