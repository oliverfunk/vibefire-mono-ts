// import { prisma } from "@acme/db"; will be fauna
import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import {
  getBackendAuthContext,
  type AuthContext,
} from "@vibefire/auth-backend";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type AuthContextProps = {
  auth: AuthContext;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = ({ auth }: AuthContextProps) => {
  return {
    auth,
    // fauna,
  };
};

export const createContext = ({ req }: FetchCreateContextFnOptions) => {
  return createContextInner({ auth: getBackendAuthContext(req) });
};
export type Context = inferAsyncReturnType<typeof createContext>;
