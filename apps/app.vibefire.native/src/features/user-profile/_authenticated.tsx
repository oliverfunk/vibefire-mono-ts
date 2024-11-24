import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { capitalize } from "lodash";

import { type AppUserAuthenticated } from "@vibefire/models";

import { trpc } from "!/api/trpc-client";

import { IconButton } from "!/components/button/IconButton";
import { EventsListSimpleChipView } from "!/components/event/EventsList";
import {
  ErrorDisplay,
  LoadingDisplay,
  withSuspenseErrorBoundary,
} from "!/components/misc/SuspenseWithError";
import { SummaryComponent } from "!/components/structural/SummaryComponent";
import { DeleteAccount } from "!/c/auth/DeleteAccount";
import { SignOut } from "!/c/auth/SignOut";
import { ScrollViewSheet } from "!/c/misc/sheet-utils";
import { VibefireIconImage } from "!/c/misc/VibefireIconImage";
import { navEditEvent } from "!/nav";

const UsersEventsSummary = () => {
  const router = useRouter();

  const EventsListSuspense = withSuspenseErrorBoundary(
    () => {
      const [eventsByUser] = trpc.events.listSelfAll.useSuspenseQuery();

      if (!eventsByUser.ok) {
        throw eventsByUser.error;
      }

      return (
        <View className="flex-col">
          <EventsListSimpleChipView
            events={eventsByUser.value.data}
            onChipPress={(e) => {
              navEditEvent(router, e.id!);
            }}
          />
          {/* <View className="items-start py-4">
            <IconButton onPress={() => {}} useOpacity={true} size={1}>
              <View className="flex-row items-center justify-center rounded-sm bg-white/10 px-4 py-2">
                <FontAwesome name="eye" size={20} color="white" />
                <Text className="text-white"> View all</Text>
              </View>
            </IconButton>
          </View> */}
        </View>
      );
    },
    {
      ErrorFallback: ({ error, resetErrorBoundary }) => (
        <View className="p-5">
          <ErrorDisplay
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            textWhite={true}
          />
        </View>
      ),
      LoadingFallback: (
        <View className="p-5">
          <LoadingDisplay loadingWhite={true} />
        </View>
      ),
    },
  );

  return (
    <View className="bg-black px-2">
      <SummaryComponent
        headerTitle="Your Events"
        onHeaderButtonPress={() => {
          router.navigate("/event/create");
        }}
      >
        <EventsListSuspense />
      </SummaryComponent>
    </View>
  );
};

export const UserProfileAuthenticatedSheet = (props: {
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
