import React, { FC, memo, ReactNode, useMemo } from "react";
import Constants from "expo-constants";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createStore, Provider } from "jotai";
import superjson from "superjson";

import { BASEPATH_TRPC } from "@vibefire/api/src/basepaths";

import { tokenCache } from "~/utils/sec-store-cache";
import { trpc } from "~/apis/trpc-client";

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
  // return "https://api.vibefire.app";
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(":")[0];
  if (!localhost) {
    return "https://api.vibefire.app";
  }
  return `http://${localhost}:8787`;
};

const myStore = createStore();

const _AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
  const { getToken } = useAuth();
  const queryClient = useMemo(() => new QueryClient(), []);
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        transformer: superjson,
        links: [
          httpBatchLink({
            async headers() {
              const authToken = await getToken();
              return {
                ...(!!authToken && { Authorization: authToken }),
              };
            },
            url: `${getBaseUrl()}${BASEPATH_TRPC}`,
          }),
        ],
      }),
    [],
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Provider store={myStore}>{children}</Provider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      tokenCache={tokenCache}
    >
      <_AppProviders>{children}</_AppProviders>
    </ClerkProvider>
  );
};

export default memo(AppProviders);
