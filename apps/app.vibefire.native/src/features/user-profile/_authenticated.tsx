import { Text, TouchableOpacity, View, type ViewProps } from "react-native";
import { useRouter } from "expo-router";
import {
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { capitalize } from "lodash";

import { type AppUserAuthenticated } from "@vibefire/models";

import { trpc } from "!/api/trpc-client";

import { EventsListSimpleChipView } from "!/components/event/EventsList";
import {
  ErrorDisplay,
  LoadingDisplay,
  withSuspenseErrorBoundary,
} from "!/components/misc/SuspenseWithError";
import { SummaryComponent } from "!/components/structural/SummaryComponent";
import { VibefireLogoName } from "!/components/VibefireBottomLogo";
import { DeleteAccount } from "!/c/auth/DeleteAccount";
import { SignOut } from "!/c/auth/SignOut";
import { LinearRedOrangeView, ScrollViewSheet } from "!/c/misc/sheet-utils";
import { navCreateEvent, navEditEvent } from "!/nav";

const UsersEventsManageSummary = (props: ViewProps) => {
  const router = useRouter();

  const EventsListSuspense = withSuspenseErrorBoundary(
    () => {
      const [eventsByUser] = trpc.events.listSelfAllManage.useSuspenseQuery({
        pageLimit: 5,
      });

      if (!eventsByUser.ok) {
        throw eventsByUser.error;
      }
      const events = eventsByUser.value.data;
      // const events = [];

      return (
        <View className="flex-col space-y-2">
          <EventsListSimpleChipView
            events={events}
            limit={4}
            noEventsMessage="Create your first event"
            onChipPress={(e) => {
              navEditEvent(router, e.id!);
            }}
          />
          {events.length > 4 && (
            <TouchableOpacity
              //todo!!!
              onPress={() => {}}
              className="self-center rounded-full border-2 border-white p-2 px-4"
            >
              <Text className="text-center text-base text-white">
                <FontAwesome6 name="list" size={15} /> View all
              </Text>
            </TouchableOpacity>
          )}
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
    <SummaryComponent
      headerTitle="Your Events"
      headerButtonText="New"
      onHeaderButtonPress={() => {
        navCreateEvent(router);
      }}
    >
      <EventsListSuspense />
    </SummaryComponent>
  );
};

export const UserProfileAuthenticatedSheet = (props: {
  appUser: AppUserAuthenticated;
}) => {
  const { appUser: user } = props;

  const userInfo = user.userInfo;

  return (
    <LinearRedOrangeView className="h-full">
      <ScrollViewSheet
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}
        className="space-y-4 p-2"
      >
        {/* main content */}
        <View className="flex-col space-y-4">
          <View className="flex-row items-center justify-center rounded-2xl bg-black p-4">
            {/* <SimpleLineIcons name="fire" size={50} color="orange" /> */}
            {/* <Text className="text-4xl">🕺</Text> */}
            {/* <Text className="text-4xl">🔥</Text> */}
            <View className="flex-col items-center space-y-2">
              <Text className="text-center text-2xl text-white">
                Hey, {capitalize(userInfo.name)}!{"\n"}Welcome to Vibefire
              </Text>
              {userInfo.email ? (
                <Text className="text-base text-white">{userInfo.email}</Text>
              ) : (
                <TouchableOpacity onPress={async () => {}}>
                  <Text className="text-base text-white">Tap to add email</Text>
                </TouchableOpacity>
              )}
            </View>
            {/* <Text className="text-4xl">💃</Text> */}
            {/* <Text className="text-4xl">🔥</Text> */}
            {/* <MaterialCommunityIcons name="firework" size={50} color="red" /> */}
            {/* <SimpleLineIcons name="fire" size={50} color="orange" /> */}
          </View>

          <View className="rounded-2xl bg-black p-4">
            <UsersEventsManageSummary />
          </View>
        </View>

        {/* footer */}
        <View className="flex-col space-y-4 pb-2">
          <View className="flex-row justify-evenly rounded-2xl bg-black p-4">
            <SignOut />
            <DeleteAccount />
          </View>
          <VibefireLogoName />
        </View>
      </ScrollViewSheet>
    </LinearRedOrangeView>
  );
};
