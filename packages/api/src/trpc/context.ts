import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import {
  getApiDataQueryManager,
  getGoogleMapsManager,
} from "@vibefire/managers/api";
import {
  authRequestWithClerk,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";

type ContextProps = {
  auth: ClerkAuthContext;
  googleMapsManager: ReturnType<typeof getGoogleMapsManager>;
  apiDataQueryManager: ReturnType<typeof getApiDataQueryManager>;
};

const createContextInner = ({
  auth,
  googleMapsManager,
  apiDataQueryManager,
}: ContextProps) => {
  return {
    auth,
    googleMapsManager,
    apiDataQueryManager,
  };
};

export const createContext = async ({
  req,
  googleMapsApiKey,
  clerkPemString,
  clerkIssuerApiUrl,
  faunaClientKey,
}: CreateContextOptions) => {
  return createContextInner({
    auth: await authRequestWithClerk(clerkPemString, clerkIssuerApiUrl, req),
    googleMapsManager: getGoogleMapsManager(googleMapsApiKey),
    apiDataQueryManager: getApiDataQueryManager(
      googleMapsApiKey,
      faunaClientKey,
    ),
  });
};
export type Context = inferAsyncReturnType<typeof createContext>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  googleMapsApiKey: string;
  clerkPemString: string;
  clerkIssuerApiUrl: string;
  faunaClientKey: string;
  supabaseClientKey: string;
};
