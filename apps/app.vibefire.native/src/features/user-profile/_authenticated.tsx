import { TouchableOpacity, View, type ViewProps } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { capitalize } from "lodash";

import { type AppUserAuthenticated } from "@vibefire/models";

import { trpc } from "!/api/trpc-client";

import { TextB, TextLL } from "!/components/atomic/text";
import { BContC, BContN, BContR } from "!/components/atomic/view";
import { PillTouchableOpacity } from "!/components/button/PillTouchableOpacity";
import { SummaryComponent } from "!/components/structural/SummaryComponent";
import { DeleteAccount } from "!/c/auth/DeleteAccount";
import { SignOut } from "!/c/auth/SignOut";
import { EventsSimpleListChipView } from "!/c/event/EventsList";
import { SheetScrollViewGradientVF } from "!/c/layouts/SheetScrollViewGradientVF";
import {
  ErrorDisplay,
  LoadingDisplay,
  withSuspenseErrorBoundary,
} from "!/c/misc/SuspenseWithError";
import { navCreateEvent, navEditEvent, navViewUserManagedEvents } from "!/nav";

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

      return (
        <View className="flex-col space-y-2">
          <EventsSimpleListChipView
            events={events}
            limit={4}
            noEventsMessage="Create your first event"
            onItemPress={(e) => {
              navEditEvent(router, e.id!);
            }}
          />
          {events.length > 4 && (
            <PillTouchableOpacity
              className="self-center"
              onPress={() => {
                navViewUserManagedEvents(router);
              }}
            >
              <TextB className="text-center">
                <FontAwesome6 name="list" size={15} /> View all
              </TextB>
            </PillTouchableOpacity>
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
  const { appUser } = props;

  const userInfo = appUser.userInfo;

  return (
    <SheetScrollViewGradientVF
      footer={
        <BContR className="justify-evenly">
          <SignOut />
          <DeleteAccount />
        </BContR>
      }
    >
      <BContC>
        <TextLL className="text-center">
          Hey, {capitalize(userInfo.name)}!{"\n"}Welcome to Vibefire
        </TextLL>
        {userInfo.email ? (
          <TextB>{userInfo.email}</TextB>
        ) : (
          <TouchableOpacity onPress={async () => {}}>
            <TextB>Tap to add email</TextB>
          </TouchableOpacity>
        )}
      </BContC>

      <BContN>
        <UsersEventsManageSummary />
      </BContN>
    </SheetScrollViewGradientVF>
  );
};
