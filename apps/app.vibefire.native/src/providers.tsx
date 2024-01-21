import React, {
  memo,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Toast from "react-native-toast-message";
import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createStore, Provider, useAtomValue, useSetAtom } from "jotai";
import * as Sentry from "sentry-expo";
import superjson from "superjson";

import { type VibefireUserT } from "@vibefire/models";

import { debounce } from "~/utils/debounce";
import { tokenCache } from "~/utils/sec-store-cache";
import { trpc, trpcUrl } from "~/apis/trpc-client";
import { userAtom, userSessionRetryAtom } from "~/atoms";

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
      case "loading":
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
          Sentry.Native.setUser({
            id: userInfo.id,
            email: userInfo.contactEmail,
          });
        } else {
          Sentry.Native.setUser({
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
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
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
          url: trpcUrl,
        }),
      ],
    }),
  );

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

const AppProviders = (props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <JotaiAtomsProvider>
      <ClerkAuthProvider>
        <TrpcProvider>
          <UserSessionProvider>
            <BottomSheetModalProvider>
              <ClerkLoaded>{children}</ClerkLoaded>
            </BottomSheetModalProvider>
            <Toast />
          </UserSessionProvider>
        </TrpcProvider>
      </ClerkAuthProvider>
    </JotaiAtomsProvider>
  );
};

export default memo(AppProviders);
