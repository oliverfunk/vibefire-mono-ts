import { useLayoutEffect } from "react";
import { TouchableOpacity, View, type ViewProps } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { atom, useAtom, useSetAtom } from "jotai";
import { capitalize } from "lodash";

import { type AppUserAuthenticated } from "@vibefire/models";

import { trpc } from "!/api/trpc-client";

import { TextB, TextL, TextLL, TextSS } from "!/components/atomic/text";
import { BContC, BContN, BContR, ContC } from "!/components/atomic/view";
import { PillTouchableOpacity } from "!/components/button/PillTouchableOpacity";
import { useItemSeparator } from "!/components/misc/ItemSeparator";
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

const numberOPublishedEventsAtom = atom(0);

const EventsListSuspense = withSuspenseErrorBoundary(
  () => {
    const router = useRouter();
    const itemSep = useItemSeparator(2);
    const setNumberOfPublishedEventsAtom = useSetAtom(
      numberOPublishedEventsAtom,
    );
    const [eventsByUser] = trpc.events.listSelfAllManage.useSuspenseQuery({
      pageLimit: 0,
    });

    if (!eventsByUser.ok) {
      throw eventsByUser.error;
    }
    const events = eventsByUser.value.data;

    useLayoutEffect(() => {
      setNumberOfPublishedEventsAtom(events.filter((e) => e.state == 1).length);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [events]);

    return (
      <ContC>
        <EventsSimpleListChipView
          events={events}
          limit={5}
          noEventsMessage="Create your first event"
          onItemPress={(e) => {
            navEditEvent(router, e.id!);
          }}
          ItemSeparatorComponent={itemSep}
        />
        {events.length > 5 && (
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
      </ContC>
    );
  },
  {
    ErrorFallback: ({ error, resetErrorBoundary }) => (
      <View className="p-4">
        <ErrorDisplay
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          textWhite={true}
        />
      </View>
    ),
    LoadingFallback: (
      <View className="p-4">
        <LoadingDisplay loadingWhite={true} />
      </View>
    ),
  },
);

const UsersManagedEventsSummary = (props: ViewProps) => {
  const router = useRouter();
  const [numberOPublishedEvents] = useAtom(numberOPublishedEventsAtom);

  return (
    <View {...props}>
      <SummaryComponent
        headerMainComponent={
          <View className="flex-1 flex-row items-center space-x-4">
            <TextL className="font-bold">Your Events</TextL>
            <TextSS className="rounded-full border  border-green-500 px-2 py-1 font-bold">
              {`Published: ${numberOPublishedEvents}`}
            </TextSS>
          </View>
        }
        headerButtonText="New"
        onHeaderButtonPress={() => {
          navCreateEvent(router);
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
        <UsersManagedEventsSummary />
      </BContN>
    </SheetScrollViewGradientVF>
  );
};
