import { useEffect, useMemo } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { DateTime } from "luxon";
import { type PartialDeep } from "type-fest";

import {
  type VibefireEventManagementT,
  type VibefireEventT,
} from "@vibefire/models";

import { EventCard } from "~/components/EventCard";
import { EventImage } from "~/components/EventImage";
import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { vfImgUrlDebug } from "~/apis/base-urls";
import { trpc } from "~/apis/trpc-client";
import {
  ErrorSheet,
  LinearRedOrangeView,
  LoadingSheet,
  navManageEvent,
  navManageEventEditDescription,
  navManageEventEditImages,
  navManageEventEditLocation,
  navManageEventEditTimes,
  ScrollViewSheet,
} from "../_shared";

const _ManagementView = (props: {
  event: VibefireEventT;
  eventManagement: VibefireEventManagementT;
}) => {
  const { event, eventManagement } = props;
  return (
    <ScrollViewSheet>
      <View className="my-5 flex h-full flex-col items-center space-y-14">
        {/* Heading */}
        <LinearRedOrangeView className="flex-row p-4">
          <View className="w-full bg-black p-4">
            <Text className="text-center text-2xl font-bold text-white">
              Manage
            </Text>
          </View>
        </LinearRedOrangeView>

        <EventCard
          eventInfo={{
            title: event.title,
            addressDescription: event.location.addressDescription,
            orgName: "a name",
            bannerImgURL: "",
            orgProfileImgURL: "",
            timeStart: DateTime.fromISO(event.timeStartIsoNTZ, { zone: "utc" }),
            timeEnd: event.timeEndIsoNTZ
              ? DateTime.fromISO(event.timeEndIsoNTZ, { zone: "utc" })
              : undefined,
          }}
          onPress={() => {}}
        />
      </View>
    </ScrollViewSheet>
  );
};

export const ManageEventManagement = (props: { eventId: string }) => {
  const { eventId } = props;
  const eventForManagement = trpc.events.eventAllInfoForManagement.useQuery({
    eventId,
  });

  switch (eventForManagement.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="Couldn't load the event" />;
    case "success":
      return (
        <_ManagementView
          event={eventForManagement.data.event}
          eventManagement={eventForManagement.data.eventManagement}
        />
      );
  }
};
