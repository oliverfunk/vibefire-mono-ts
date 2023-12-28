import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { Entypo } from "@expo/vector-icons";
import { DateTime } from "luxon";

import {
  type VibefireEventManagementT,
  type VibefireEventT,
} from "@vibefire/models";
import { vibefireEventShareURL } from "@vibefire/utils";

import { EventCard } from "~/components/event/EventCard";
import { VibefireIconImage } from "~/components/VibefireIconImage";
import { trpc } from "~/apis/trpc-client";
import { useShareEventLink } from "~/hooks/useShareEventLink";
import { navEditEvent, navViewEventAsPreview } from "~/nav";
import {
  FormTitleInput,
  LinearRedOrangeView,
  ScrollViewSheet,
} from "../../_shared";

const ShareEventLinkComponent = (props: { event: VibefireEventT }) => {
  const { event } = props;

  const onShareEvent = useShareEventLink(event);

  return (
    <Pressable
      className="flex-row border bg-orange-100"
      onPress={async () => {
        await Clipboard.setUrlAsync(vibefireEventShareURL(event.linkId));
        Toast.show({
          type: "success",
          text1: "Link copied!",
          position: "bottom",
          bottomOffset: 50,
          visibilityTime: 800,
        });
      }}
    >
      <Pressable
        className="items-center justify-center bg-black px-4 py-2"
        onPress={onShareEvent}
      >
        <Entypo name="share-alternative" size={20} color="white" />
      </Pressable>
      <View className="inline-block justify-center px-2">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          selectable={true}
          className="text-center text-lg text-black"
        >
          {vibefireEventShareURL(event.linkId)}
        </Text>
      </View>
    </Pressable>
  );
};

export const ManagementView = (props: {
  event: VibefireEventT;
  eventManagement: VibefireEventManagementT;
  dataRefetch: () => void;
}) => {
  const { event, eventManagement, dataRefetch } = props;

  const setPublishedMut = trpc.events.setPublished.useMutation();
  const setUnpublishedMut = trpc.events.setUnpublished.useMutation();
  const setVisibilityMut = trpc.events.setVisibility.useMutation();

  return (
    <ScrollViewSheet>
      <View className="flex-col space-y-4 bg-black p-2">
        <Text className="text-left text-lg text-white">
          {event.published
            ? "To hide this event, tap the button below"
            : "Your event is currently hidden, tap the button below to make it visible to others"}
        </Text>

        <View className="items-center">
          {event.published ? (
            <TouchableOpacity
              onPress={async () => {
                await setUnpublishedMut.mutateAsync({
                  eventId: event.id,
                });
                dataRefetch();
              }}
              className="items-center"
            >
              <LinearRedOrangeView className="rounded-lg px-4 py-2">
                <Text className="text-xl font-bold text-white">Hide</Text>
              </LinearRedOrangeView>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                await setPublishedMut.mutateAsync({
                  eventId: event.id,
                });
                dataRefetch();
              }}
              className="items-center rounded-lg bg-green-400 px-4 py-2"
            >
              <Text className="text-xl font-bold text-white">Publish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main col */}
      <View className="flex-col space-y-5 p-2 pb-5">
        {/* Visibility */}
        <View className="flex-col space-y-4">
          {(event.visibility === "public" && (
            <>
              <Text className="text-lg">
                {`This event is public. It can seen on the map by anyone ${
                  !event.published ? "(when published)" : ""
                }.`}
              </Text>
              <View>
                <ShareEventLinkComponent event={event} />
              </View>
              <View>
                <TouchableOpacity
                  onPress={async () => {
                    await setVisibilityMut.mutateAsync({
                      eventId: event.id,
                      visibility: "link-only",
                    });
                    dataRefetch();
                  }}
                  className="items-center rounded-lg bg-black px-4 py-2"
                >
                  <Text className="text-lg font-bold text-white">
                    Make private
                  </Text>
                </TouchableOpacity>
              </View>
            </>
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
                  {`This event is private, link-only. Only those with the link can see it ${
                    !event.published ? "(when published)" : ""
                  }.`}
                </Text>
                <View>
                  <ShareEventLinkComponent event={event} />
                </View>
                <View>
                  <TouchableOpacity
                    onPress={async () => {
                      await setVisibilityMut.mutateAsync({
                        eventId: event.id,
                        visibility: "public",
                      });
                      dataRefetch();
                    }}
                    className="items-center rounded-lg bg-black px-4 py-2"
                  >
                    <Text className="text-lg font-bold text-white">
                      Make public
                    </Text>
                  </TouchableOpacity>
                </View>
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

        <View>
          <FormTitleInput title="Event Card" underneathText="(Tap to preview)">
            <EventCard
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
                navViewEventAsPreview(event.linkId);
              }}
            />
          </FormTitleInput>
        </View>

        <View className="items-center">
          <TouchableOpacity
            className="items-center rounded-lg bg-black p-4"
            onPress={() => {
              navEditEvent(event.linkId);
            }}
          >
            <Text className="text-xl text-white">Edit event details</Text>
          </TouchableOpacity>
        </View>
      </View>
      <VibefireIconImage />
    </ScrollViewSheet>
  );
};
