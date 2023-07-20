import {
  Button,
  FlatList,
  Platform,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
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
  return (
    <View className="container flex-1 items-center justify-center bg-black">
      <View className="h-20 w-[150px]">
        <FlatList
          horizontal={true}
          snapToInterval={100}
          snapToAlignment="center"
          className="bg-purple-400 align-middle"
          // ItemSeparatorComponent={
          //   Platform.OS !== "android" &&
          //   (({ highlighted }) => (
          //     <View
          //       style={[
          //         { borderColor: "blue" },
          //         highlighted && { marginLeft: 0 },
          //       ]}
          //     />
          //   ))
          // }
          data={[
            { title: "Title Text", key: "item1" },
            { title: "Title Text Another", key: "item2" },
          ]}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index, separators }) => (
            <TouchableHighlight
              className="bg-yellow-400 align-middle"
              key={item.key}
              onPress={() => console.log("onPress")}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
            >
              <View className="p-4" style={{ backgroundColor: "white" }}>
                <Text>{item.title}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>
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
