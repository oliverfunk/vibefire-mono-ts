import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { capitalize } from "lodash";

import {
  type AppUserAuthenticated,
  type VibefireUserT,
} from "@vibefire/models";

import { DeleteAccount } from "~/components/auth/DeleteAccount";
import { SignOut } from "~/components/auth/SignOut";
import { IconButton } from "~/components/button/IconButton";
import {
  LinearRedOrangeView,
  ScrollViewSheet,
} from "~/components/utils/sheet-utils";
import { VibefireIconImage } from "~/components/utils/VibefireIconImage";
import { GroupsListAllForUser } from "~/features/groups-list";
import { navCreateEvent, navOwnEventsByOrganiser } from "~/nav";

const UserEventsChipListEmbed = () => {
  return (
    <LinearRedOrangeView className="flex-col space-y-10 px-2 py-10">
      <Text className="text-center text-xl text-white">
        View your previous events or create new ones from here
      </Text>
      <View className="flex-row items-center justify-around">
        <TouchableOpacity
          className="rounded-lg bg-black px-4 py-4"
          onPress={() => {
            navCreateEvent();
          }}
        >
          <Text className="text-lg font-bold text-white">Create event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-lg bg-black px-4 py-4"
          onPress={() => {
            navOwnEventsByOrganiser();
          }}
        >
          <Text className="text-lg font-bold text-white">Your events</Text>
        </TouchableOpacity>
      </View>
    </LinearRedOrangeView>
  );
};

const GroupsChipListEmbed = () => {
  return (
    <View className="flex-col bg-black p-2">
      <View className="flex-row items-center p-2">
        <Text className="text-xl font-bold text-white">Your groups</Text>
        <View className="grow" />
        <IconButton
          onPress={() => {
            // todo
            // create join
          }}
          cn="bg-black/80"
        >
          <View className="flex-col items-center justify-center">
            <FontAwesome name="plus" size={15} color="white" />
            <Text className="text-sm text-white">New</Text>
          </View>
        </IconButton>
        {/* Find and create groups */}
      </View>
      <GroupsListAllForUser />
    </View>
  );
};

export const UserProfileAuthenticatedView = (props: {
  appUser: AppUserAuthenticated;
}) => {
  const { appUser: user } = props;

  const userInfo = user.userInfo as VibefireUserT;

  return (
    <ScrollViewSheet>
      <View className="flex-col space-y-10 px-2 py-10">
        {/* Name */}
        <View className="flex-col items-center justify-center space-y-2">
          <View className="rounded-lg bg-black p-4">
            <Text className="text-2xl text-white">
              {capitalize(userInfo.name)}
            </Text>
          </View>
        </View>

        <View className="flex-col items-center space-y-2">
          <View className="w-full flex-col">
            <Text className="ml-4">Email</Text>
            <View className="rounded-lg bg-slate-200 py-2">
              {userInfo.contactEmail ? (
                <Text className="ml-4">{userInfo.contactEmail}</Text>
              ) : (
                <TouchableOpacity onPress={async () => {}}>
                  <Text className="ml-4">Tap to add email</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* <View className="w-full flex-col">
                <Text className="ml-4">Phone number</Text>
                <View className="rounded-lg bg-slate-200 py-2">
                  {userInfo.phoneNumber ? (
                    <Text className="ml-4">{userInfo.phoneNumber}</Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        console.log("prepareSecondFactor");
                        // Prepare the second factor verification by
                        // specifying the phone code strategy. An SMS
                        // message with a one-time code will be sent
                        // to the user's verified phone number.
                      }}
                    >
                      <Text className="ml-4">Tap to add phone number</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View> */}
        </View>

        <View>
          <UserEventsChipListEmbed />
        </View>

        <View>
          <GroupsChipListEmbed />
        </View>

        {/* <View className="w-full px-2">
              <FeedbackCard />
            </View> */}

        {/* <View className="w-full px-2">
              <FeedbackCard />
            </View> */}

        <View>
          <VibefireIconImage />
        </View>

        <View className="flex-row justify-evenly">
          <SignOut />
          <DeleteAccount />
        </View>
      </View>
    </ScrollViewSheet>
  );
};
