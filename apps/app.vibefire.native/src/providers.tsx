import React, {
  memo,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createStore, Provider, useAtomValue, useSetAtom } from "jotai";
import superjson from "superjson";

import { type VibefireUserT } from "@vibefire/models";

import { debounce } from "!/utils/debounce";
import { tokenCache } from "!/utils/sec-store-cache";
import { trpc, trpcUrl } from "!/api/trpc-client";

import { userAtom, userSessionRetryAtom } from "!/atoms";

export const routingInstrumentation =
  new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  enabled: !__DEV__,
  dsn: "https://959cd563f46e2574f10469f5b03e8d6e@o4506169650315264.ingest.sentry.io/4506169652412416",
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      // enableUserInteractionTracing: true,
    }),
  ],
});

const myAtomStore = createStore();

const UserSessionProvider = (props: { children: ReactNode }) => {
  const { children } = props;

  // for manually proc'ing a retry
  const userSessionRetry = useAtomValue(userSessionRetryAtom);

  const { isLoaded, isSignedIn } = useUser();
  const setUser = useSetAtom(userAtom);

  const getSession = trpc.auth.getSession.useMutation();
  const getSessionMutDbc = useMemo(
    () => debounce(getSession.mutate, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const getSessionMutDbcLong = useMemo(
    () => debounce(getSession.mutate, 10000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (isLoaded) {
      getSessionMutDbc();
    }
  }, [isLoaded, getSessionMutDbc, userSessionRetry, isSignedIn]);

  useEffect(() => {
    switch (getSession.status) {
      case "pending":
        setUser({ state: "loading" });
        break;
      case "error":
        setUser({ state: "error", error: getSession.error.message });
        getSessionMutDbcLong();
        break;
      case "success":
        const d = getSession.data;
        if (d.state === "authenticated") {
          const userInfo = d.userInfo as VibefireUserT;
          Sentry.setUser({
            id: userInfo.id,
            email: userInfo.contactEmail,
          });
        } else {
          Sentry.setUser({
            id: d.anonId,
          });
        }
        setUser(getSession.data);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSession.status, getSessionMutDbcLong, setUser]);

  return children;
};

const JotaiAtomsProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  return <Provider store={myAtomStore}>{children}</Provider>;
};

const TrpcProvider = (props: { children: ReactNode }) => {
  const { children } = props;

  const { getToken } = useAuth();
  const [trpcLinks] = useState(() => [
    httpBatchLink({
      async headers() {
        const authToken = await getToken();
        return {
          ...(!!authToken && { Authorization: authToken }),
        };
      },
      url: trpcUrl,
      transformer: superjson,
    }),
  ]);
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: trpcLinks,
    }),
  );
  const [queryClient] = useState(() => new QueryClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

const ClerkAuthProvider = (props: { children: ReactNode }) => {
  const { children } = props;

  const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey) {
    throw new Error("Missing Clerk publishable key");
  }

  return (
    <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
      {children}
    </ClerkProvider>
  );
};

const AppProviders = Sentry.wrap((props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <JotaiAtomsProvider>
      <ClerkAuthProvider>
        <TrpcProvider>
          <UserSessionProvider>
            <ClerkLoaded>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
              </GestureHandlerRootView>
              <Toast />
            </ClerkLoaded>
          </UserSessionProvider>
        </TrpcProvider>
      </ClerkAuthProvider>
    </JotaiAtomsProvider>
  );
});

export default memo(AppProviders);
