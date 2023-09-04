import React, {
  memo,
  useEffect,
  useMemo,
  type FC,
  type ReactNode,
} from "react";
import Constants from "expo-constants";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createStore, Provider, useAtomValue, useSetAtom } from "jotai";
import superjson from "superjson";

import { BASEPATH_TRPC } from "@vibefire/api/src/basepaths";

import { debounce } from "~/utils/debounce";
import { tokenCache } from "~/utils/sec-store-cache";
import { trpc } from "~/apis/trpc-client";
import { userAtom, userSessionRetryAtom } from "~/atoms";

const getBaseUrl = () => {
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

const _UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const userSessionRetry = useAtomValue(userSessionRetryAtom);
  const { isLoaded } = useUser();
  const getSession = trpc.auth.getSession.useMutation();
  const getSessionMutDbc = useMemo(
    () => debounce(getSession.mutate, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const getSessionMutDbcLong = useMemo(
    () => debounce(getSession.mutate, 60000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    if (isLoaded) {
      getSessionMutDbc();
    }
  }, [isLoaded, getSessionMutDbc, userSessionRetry]);

  useEffect(() => {
    switch (getSession.status) {
      case "loading":
        setUser({ state: "loading" });
        break;
      case "error":
        console.log("error getting session");
        setUser({ state: "error", error: getSession.error.message });
        if (!__DEV__) {
          console.log("calling getSessionMutDbc");
          getSessionMutDbcLong();
        }
        break;
      case "success":
        setUser(getSession.data);
        break;
    }
  }, [getSession, getSessionMutDbcLong, setUser]);

  return <>{children}</>;
};

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
    [getToken],
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Provider store={myStore}>
          <_UserProvider>{children}</_UserProvider>
        </Provider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey) {
    throw new Error("Missing Clerk publishable key");
  }
  return (
    <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
      <_AppProviders>{children}</_AppProviders>
    </ClerkProvider>
  );
};

export default memo(AppProviders);
