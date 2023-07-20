import React, { useEffect } from "react";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";
import { GetToken } from "@clerk/types";
import { httpBatchLink } from "@trpc/client";
import { createStore, Provider } from "jotai";
import { createTRPCJotai } from "jotai-trpc";
import superjson from "superjson";

import type { AppRouter } from "@vibefire/api-v1";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(":")[0];
  if (!localhost) {
    // return "https://your-production-url.com";
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }
  return `http://${localhost}:8787`;
};

export let authTokenGetter: GetToken | null = null;

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpcJot = createTRPCJotai<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      async headers() {
        const authToken = await authTokenGetter?.();
        return {
          ...(!!authToken && { Authorization: authToken }),
        };
      },
      url: `${getBaseUrl()}/v1/trpc`,
    }),
  ],
});

const myStore = createStore();

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export const JotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getToken } = useAuth();
  useEffect(() => {
    authTokenGetter = getToken;
  }, []);
  return <Provider store={myStore}>{children}</Provider>;
};
