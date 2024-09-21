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
      apiKey: env.GOOGLE_MAP_API_KEY,
    },
  });
  return {
    auth: await getClerkService().authRequest(req),
  } as ContextProps;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  env: {
    FAUNA_ROLE_KEY: string;
    CLERK_SECRET_KEY: string;
    CLERK_PEM_STRING: string;
    CLERK_PUBLISHABLE_KEY: string;
    GOOGLE_MAP_API_KEY: string;
  };
};
