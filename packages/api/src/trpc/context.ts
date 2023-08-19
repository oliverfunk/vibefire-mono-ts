import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { getDBServiceManager } from "@vibefire/service-managers/backend";
import {
  authRequestWithClerk,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";

type ContextProps = {
  auth: ClerkAuthContext;
  dbServiceManager: ReturnType<typeof getDBServiceManager>;
};

const createContextInner = ({ auth, dbServiceManager }: ContextProps) => {
  return {
    auth,
    dbServiceManager,
  };
};

export const createContext = async ({
  req,
  clerkPemString,
  clerkIssuerApiUrl,
  faunaClientKey,
}: CreateContextOptions) => {
  return createContextInner({
    auth: await authRequestWithClerk(clerkPemString, clerkIssuerApiUrl, req),
    dbServiceManager: getDBServiceManager(faunaClientKey),
  });
};
export type Context = inferAsyncReturnType<typeof createContext>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  clerkPemString: string;
  clerkIssuerApiUrl: string;
  faunaClientKey: string;
  supabaseClientKey: string;
};
