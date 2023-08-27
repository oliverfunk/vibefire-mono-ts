import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { getApiDataQueryManager } from "@vibefire/managers/api";
import {
  authRequestWithClerk,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";

type ContextProps = {
  auth: ClerkAuthContext;
  apiDataQueryManager: ReturnType<typeof getApiDataQueryManager>;
};

const createContextInner = ({ auth, apiDataQueryManager }: ContextProps) => {
  return {
    auth,
    apiDataQueryManager,
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
    apiDataQueryManager: getApiDataQueryManager(faunaClientKey),
  });
};
export type Context = inferAsyncReturnType<typeof createContext>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  clerkPemString: string;
  clerkIssuerApiUrl: string;
  faunaClientKey: string;
  supabaseClientKey: string;
};
