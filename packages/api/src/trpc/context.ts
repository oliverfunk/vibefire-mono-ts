import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import {
  getClerkService,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";
import { resourceLocator } from "@vibefire/utils";

type ContextProps = {
  auth: ClerkAuthContext;
};

export const createContext = async ({ req, env }: CreateContextOptions) => {
  // all implicitly used in this API
  resourceLocator().setCtx({
    fauna: {
      roleKey: env.FAUNA_ROLE_KEY,
    },
    clerk: {
      secretKey: env.CLERK_SECRET_KEY,
      pemString: env.CLERK_PEM_STRING,
      publishableKey: env.CLERK_PUBLISHABLE_KEY,
    },
    gooleMaps: {
      apiKey: env.GOOGLE_MAPS_API_KEY,
    },
    cloudFlare: {
      accountId: env.CF_ACCOUNT_ID,
      imagesApiKey: env.CF_IMAGES_API_KEY,
    },
  });
  return {
    auth: await getClerkService().authenticateRequest(req),
  } as ContextProps;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  env: {
    FAUNA_ROLE_KEY: string;
    CLERK_SECRET_KEY: string;
    CLERK_PEM_STRING: string;
    CLERK_PUBLISHABLE_KEY: string;
    GOOGLE_MAPS_API_KEY: string;
    CF_ACCOUNT_ID: string;
    CF_IMAGES_API_KEY: string;
  };
};
