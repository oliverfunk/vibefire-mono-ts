import { type R2Bucket } from "@cloudflare/workers-types";
import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import {
  getApiDataQueryManager,
  getGoogleMapsManager,
  getImagesManager,
} from "@vibefire/managers/api";
import {
  authRequestWithClerk,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";

type ContextProps = {
  auth: ClerkAuthContext;
  googleMapsManager: ReturnType<typeof getGoogleMapsManager>;
  apiDataQueryManager: ReturnType<typeof getApiDataQueryManager>;
  imagesManager: ReturnType<typeof getImagesManager>;
};

export const createContext = async ({
  req,
  googleMapsApiKey,
  clerkPemString,
  clerkIssuerApiUrl,
  faunaClientKey,
  bucketImagesEU,
}: CreateContextOptions) => {
  return {
    auth: await authRequestWithClerk(clerkPemString, clerkIssuerApiUrl, req),
    googleMapsManager: getGoogleMapsManager(googleMapsApiKey),
    apiDataQueryManager: getApiDataQueryManager(
      googleMapsApiKey,
      faunaClientKey,
    ),
    imagesManager: getImagesManager(bucketImagesEU),
  } as ContextProps;
};
export type Context = inferAsyncReturnType<typeof createContext>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  googleMapsApiKey: string;
  clerkPemString: string;
  clerkIssuerApiUrl: string;
  faunaClientKey: string;
  supabaseClientKey: string;
  bucketImagesEU: R2Bucket;
};
