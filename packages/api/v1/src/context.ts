// import { prisma } from "@acme/db"; will be fauna
import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { faunaClientInit } from "@vibefire/db";

import { getBackendAuthContext, type AuthContext } from "./auth";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type ContextProps = {
  auth: AuthContext;
  faunaClient: ReturnType<typeof faunaClientInit>;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = ({ auth, faunaClient }: ContextProps) => {
  return {
    auth,
    faunaClient,
  };
};

export const createContext = ({
  req,
  faunaClientKey,
}: CreateContextOptions) => {
  return createContextInner({
    auth: getBackendAuthContext(req),
    faunaClient: faunaClientInit(faunaClientKey),
  });
};
export type Context = inferAsyncReturnType<typeof createContext>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  faunaClientKey: string;
};
