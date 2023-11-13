import { useEffect } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { DateTime } from "luxon";

import {
  type VibefireEventManagementT,
  type VibefireEventT,
} from "@vibefire/models";
import { eventUrl } from "@vibefire/utils";

import { EventCard } from "~/components/event/EventCard";
import { EventTimeline } from "~/components/event/EventTimeline";
import { trpc } from "~/apis/trpc-client";
import {
  navManageEventEditReview,
  navManageEventEditTimeline,
  navViewEventAsPreview,
} from "~/nav";
import {
  ErrorSheet,
  LinearRedOrangeView,
  LoadingSheet,
  ScrollViewSheet,
  ScrollViewSheetWithHeader,
} from "../../_shared";

const _ManagementView = (props: {
  event: VibefireEventT;
  eventManagement: VibefireEventManagementT;
  dataRefetch: () => void;
}) => {
  const { event, eventManagement, dataRefetch } = props;

  const setPublishedMut = trpc.events.setPublished.useMutation();
  const setUnpublishedMut = trpc.events.setUnpublished.useMutation();

  useEffect(() => {
    if (setPublishedMut.status === "success") {
      dataRefetch();
    }
  }, [setPublishedMut.status, dataRefetch]);
  useEffect(() => {
    if (setUnpublishedMut.status === "success") {
      dataRefetch();
    }
  }, [setUnpublishedMut.status, dataRefetch]);

  return (
    <ScrollViewSheetWithHeader header="Manage">
      {/* Main col */}
      <View className="flex-col space-y-5 p-2">
        {/* Shareability */}
        <View className="flex-col space-y-2">
          {(event.visibility === "public" && (
            <Text className="text-lg">
              This event is public and can seen on the map by anyone when
              published.
            </Text>
          )) ||
            (event.visibility === "invite-only" && (
              <Text className="text-lg">
                This event is invite-only and can only be seen by those you
                invite.
              </Text>
            )) ||
            (event.visibility === "link-only" && (
              <>
                <Text className="text-lg">
                  This event is link-only and can be seen by anyone with the
                  link.
                </Text>
                <Pressable
                  className="flex-row border bg-orange-100"
                  onPress={() => {
                    console.log("copy link");
                  }}
                >
                  <View className="items-center justify-center bg-black px-4 py-2">
                    <FontAwesome5 name="link" size={20} color="white" />
                  </View>
                  <View className="inline-block justify-center px-2">
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      selectable={true}
                      className="text-center text-lg text-black"
                    >
                      {eventUrl(event)}
                    </Text>
                  </View>
                </Pressable>

                {/* <Text className="text-center">(Tap to copy)</Text> */}
                {/* Change share btn */}
                {/* <View className="items-center">
                <TouchableOpacity
                  className="items-center rounded-lg bg-black px-4 py-2"
                  onPress={() => {
                    navManageEventEditReview(event.id);
                  }}
                >
                  <Text className="text-xl text-white">Make invite-only</Text>
                </TouchableOpacity>
              </View> */}
              </>
            ))}
        </View>

        <View className="border-b" />

        {/* Event card */}
        <View className="flex-col space-y-4">
          <Text className="text-lg font-bold">Event Card (tap to preview)</Text>
          <View>
            <EventCard
              eventId={event.id}
              state="ready"
              published={event.published}
              eventInfo={{
                title: event.title,
                addressDescription: event.location.addressDescription,
                organiserId: event.organiserId,
                organiserType: event.organiserType,
                organiserName: event.organiserName,
                bannerImgKey: event.images.banner,
                timeStart: DateTime.fromISO(event.timeStartIsoNTZ, {
                  zone: "utc",
                }),
                timeEnd: event.timeEndIsoNTZ
                  ? DateTime.fromISO(event.timeEndIsoNTZ, { zone: "utc" })
                  : undefined,
              }}
              onPress={() => {
                navViewEventAsPreview(event.id);
              }}
            />
          </View>
          <View className="items-center">
            <TouchableOpacity
              className="items-center rounded-lg bg-black px-4 py-2"
              onPress={() => {
                navManageEventEditReview(event.id);
              }}
            >
              <Text className="text-xl text-white">Edit details</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="border-b" />

        {/* Timeline */}
        <View className="flex-col space-y-2">
          <View className="bg-black p-4">
            <EventTimeline
              timelineElements={event.timeline}
              timeStartIsoNTZ={event.timeStartIsoNTZ}
              timeEndIsoNTZ={event.timeEndIsoNTZ}
            />
          </View>
          <View className="items-center">
            <TouchableOpacity
              className="items-center rounded-lg bg-black px-4 py-2"
              onPress={() => {
                navManageEventEditTimeline(event.id);
              }}
            >
              <Text className="text-xl text-white">Edit timeline</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Adds the right spacing for the message/btn below */}
        <View />
      </View>

      <View className="flex-col items-center justify-center space-y-5 bg-black px-5 py-5">
        <Text className="text-xl text-white">
          {event.published
            ? "To hide this event, tap the button below"
            : "This event is currently hidden. When you're ready, tap the button below to publish it and make it visible 🔥"}
        </Text>
        {event.published ? (
          <TouchableOpacity
            onPress={() => {
              setUnpublishedMut.mutate({
                eventId: event.id,
              });
            }}
            className="w-min items-center rounded-lg bg-red-400 px-6 py-4"
          >
            <Text className="text-xl font-bold text-white">Hide</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setPublishedMut.mutate({
                eventId: event.id,
              });
            }}
            className="w-min items-center rounded-lg bg-green-400 px-6 py-4"
          >
            <Text className="text-xl font-bold text-white">Publish</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollViewSheetWithHeader>
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
          dataRefetch={eventForManagement.refetch}
        />
      );
  }
};
