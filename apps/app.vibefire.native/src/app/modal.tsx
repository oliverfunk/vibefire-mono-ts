import { Text, View } from "react-native";
import { Link, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { api } from "~/utils/trpc";
import SignInWithOAuth from "~/components/auth/SignInWithOAuth";
import Idk from "~/components/idk";

export default function Modal() {
  const navigation = useNavigation();
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = navigation.canGoBack();

  console.log(isPresented);

  const { isLoadingError, data } = api.auth.getSecretMessage.useQuery();

  console.log("REFRESHED BBY");
  console.log(`isLoadingError: ${isLoadingError}`);

  return (
    <View className="container flex-1 items-center justify-center bg-black">
      <Text className="m-10 text-white">{data ?? "Nuthin"}</Text>
      <SignInWithOAuth />
    </View>
  );
}
