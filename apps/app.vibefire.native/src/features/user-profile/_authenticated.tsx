import { Text, TouchableOpacity, View } from "react-native";
import { capitalize } from "lodash";

import {
  type AppUserAuthenticated,
  type TModelVibefireUser,
} from "@vibefire/models";

import { UsersEventsSummary } from "!/features/events-list";
import { UsersGroupsSummary } from "!/features/groups-list";
import { DeleteAccount } from "!/c/auth/DeleteAccount";
import { SignOut } from "!/c/auth/SignOut";
import { LinearRedOrangeView, ScrollViewSheet } from "!/c/misc/sheet-utils";
import { VibefireIconImage } from "!/c/misc/VibefireIconImage";

// const UserEventsChipListEmbed = () => {
//   return (
//     <LinearRedOrangeView className="mt-1 flex-col py-2">
//       <Text className="text-center text-xl text-black">
//         View your previous events or create new ones from here
//       </Text>
//       <View className="flex-row items-center justify-around">
//         <TouchableOpacity
//           className="rounded-lg bg-black px-4 py-4"
//           onPress={() => {
//             navCreateEvent();
//           }}
//         >
//           <Text className="text-lg font-bold text-white">Create event</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           className="rounded-lg bg-black px-4 py-4"
//           onPress={() => {
//             navOwnEventsByOrganiser();
//           }}
//         >
//           <Text className="text-lg font-bold text-white">Your events</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearRedOrangeView>
//   );
// };

export const UserProfileAuthenticatedView = (props: {
  appUser: AppUserAuthenticated;
}) => {
  const { appUser: user } = props;

  const userInfo = user.userInfo;

  return (
    <ScrollViewSheet>
      <View className="mt-1 flex-col space-y-5 py-5">
        {/* Name */}
        <View className="flex-col items-center justify-center space-y-2">
          <View className="rounded-lg bg-black p-4">
            <Text className="text-2xl text-white">
              {capitalize(userInfo.name)}
            </Text>
          </View>
        </View>

        <View className="flex-col items-center space-y-2 px-2">
          <View className="w-full flex-col">
            <Text className="ml-4">Email</Text>
            <View className="rounded-lg bg-slate-200 py-2">
              {userInfo.email ? (
                <Text className="ml-4">{userInfo.email}</Text>
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
          <View className="py-10">
            <UsersEventsSummary />
          </View>
          {/* <UsersGroupsSummary /> */}
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
