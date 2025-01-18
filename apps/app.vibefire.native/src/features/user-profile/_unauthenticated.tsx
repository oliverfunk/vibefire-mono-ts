import { Platform, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { TextB } from "!/components/atomic/text";
import { BContC, ContC } from "!/components/atomic/view";
import { ContinueWithApple } from "!/components/auth/ContinueWithApple";
import { ContinueWithFacebook } from "!/components/auth/ContinueWithFacebook";
import { ContinueWithGoogle } from "!/components/auth/ContinueWithGoogle";
import { SheetScrollViewGradientVF } from "!/components/layouts/SheetScrollViewGradientVF";

export const UserProfileUnauthenticatedSheet = () => {
  return (
    <SheetScrollViewGradientVF>
      <BContC>
        <FontAwesome5 name="user-alt" size={50} color="white" />
        <TextB className="text-center">
          Sign in to create private events, get invites and share events with
          friends, filter and follow events and organisers and more.
        </TextB>
      </BContC>
      <ContC className="self-center pt-10">
        <View>
          <ContinueWithGoogle />
        </View>
        <View>
          <ContinueWithFacebook />
        </View>
        {Platform.OS === "ios" && (
          <View>
            <ContinueWithApple />
          </View>
        )}
      </ContC>
    </SheetScrollViewGradientVF>
  );
};
