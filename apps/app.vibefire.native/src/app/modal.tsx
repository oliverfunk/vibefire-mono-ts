import { Button, Text, View } from "react-native";
import { Link, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";

import SignInWithOAuth from "~/components/auth/SignInWithOAuth";
import { trpc } from "~/apis/trpc";

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <Button title="Sign Out" onPress={() => void signOut()} />
    </View>
  );
};

const Modal = () => {
  const createCollectionMut = trpc.events.createCollection.useMutation();
  const callSeshInfo = trpc.auth.getSession.useQuery(undefined, {
    enabled: false,
  });

  return (
    <View className="container flex-1 items-center justify-center bg-black">
      <Text className="m-10 text-white">
        Loading:{" "}
        {createCollectionMut.isLoading
          ? "createCollectionMut.isLoading: true"
          : "createCollectionMut.isLoading: false"}
      </Text>
      <Text className="m-10 text-white">
        Sesh info:{"\n"}
        {callSeshInfo.data !== undefined
          ? JSON.stringify(callSeshInfo.data, null, 2)
          : "callSeshInfo got no data"}
      </Text>

      <Text className="m-10 text-white">
        {createCollectionMut.data ?? "Nuthin"}
      </Text>
      <Button
        title="Do create coll"
        onPress={() =>
          createCollectionMut
            .mutateAsync()
            .catch((err) => console.error(`large err: ${err}`))
        }
      />
      <Button
        title="Get sesh info"
        onPress={() =>
          callSeshInfo
            .refetch()
            .catch((err) => console.error(`large call sesh err: ${err}`))
        }
      />
      <SignedIn>
        <SignOut />
      </SignedIn>
      <SignedOut>
        <SignInWithOAuth />
      </SignedOut>
    </View>
  );
};
export default Modal;
