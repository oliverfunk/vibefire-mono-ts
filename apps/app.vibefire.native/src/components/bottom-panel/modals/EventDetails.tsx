import { forwardRef, useCallback, useMemo, type Ref } from "react";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { type VibefireEventT } from "@vibefire/models";

import { CustomBackground } from "~/components/bottom-panel/CustomBackground";
import { EventImage, StandardImage } from "~/components/EventImage";
import { EventImageCarousel } from "~/components/EventImageCarousel";
import { EventTimeline } from "~/components/EventTimeline";
import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { trpc } from "~/apis/trpc-client";
import { navViewEventClose } from "~/nav";
import {
  ErrorSheet,
  LoadingSheet,
  ScrollViewSheet,
  useSheetBackdrop,
} from "../_shared";

const _EventOrganiserBarView = (props: {
  organiserName: string;
  organiserProfileUrl?: string;
  organiserId?: string;
}) => {
  const { organiserName, organiserProfileUrl, organiserId } = props;
  return (
    <Pressable
      className="flex-row items-center justify-center space-x-4 bg-black p-2"
      onPress={() => {
        console.log("pressed organiser bar");
      }}
    >
      {organiserProfileUrl ? (
        <StandardImage
          cn="h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-white bg-orange-400"
          source={organiserProfileUrl}
          alt="Event Organizer Profile Picture"
        />
      ) : (
        <View className="h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-white bg-red-600">
          <Text className="text-lg text-white">
            {organiserName.at(0)!.toUpperCase()}
            {"."}
          </Text>
        </View>
      )}
      <View className="flex-1 flex-col justify-center">
        <Text className="text-xs text-white">Organised by</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-lg font-bold text-white"
        >
          {organiserName}
        </Text>
      </View>
    </Pressable>
  );
};

const _EventDetailsView = (props: { event: VibefireEventT }) => {
  const { event } = props;

  const width = Dimensions.get("window").width;

  const imgs = useMemo(
    () => [event.images.banner].concat(event.images.additional),
    [event.images],
  );

  return (
    <ScrollViewSheet>
      {/* Header */}
      <View className="relative">
        {/* Background image */}
        {imgs.length === 1 ? (
          <EventImage vfImgKey={imgs[0]} alt="Event Banner" />
        ) : (
          <EventImageCarousel vfImgKeys={imgs} width={width} />
        )}

        <LinearGradient
          className="absolute bottom-0 w-full items-center justify-center pt-2"
          // colors={["rgba(0,0,0,0)", "rgba(10, 10, 210, 1)"]}
          colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 0.9)"]}
          locations={[0, 1]}
        >
          <Text className="text-center text-2xl text-white">{event.title}</Text>
        </LinearGradient>
      </View>
      {/* Main */}
      <View className="flex-col">
        <_EventOrganiserBarView organiserName="Organiser Name Organiser Name Organiser Name Organiser Name" />

        {/* Description */}
        <View className="bg-black p-2">
          <Text className="pb-2 text-2xl font-bold text-white">Details</Text>
          <Text className="text-base text-white">{event.description}</Text>
        </View>

        {/* Timeline */}
        <View className="bg-black p-2">
          <Text className="pb-2 text-2xl font-bold text-white">Timeline</Text>
          <EventTimeline
            timelineElements={event.timeline}
            timeStartIsoNTZ={event.timeStartIsoNTZ}
            timeEndIsoNTZ={event.timeEndIsoNTZ}
          />
        </View>

        {/* Map */}
        <View className="bg-black p-2">
          <Text className="pb-2 text-2xl font-bold text-white">Location</Text>
          <Pressable
            className="aspect-[4/4] "
            onPress={() => {
              console.log("pressed map");
            }}
          >
            <LocationSelectionMap
              currentSelectedPosition={event.location.position}
              fixed={true}
            />
          </Pressable>
          <View className="flex-row items-center space-x-2 bg-black px-4 py-2">
            <FontAwesome5 name="map-marker-alt" size={20} color="white" />
            <Text className="text-center text-lg  text-white">
              {event.location.addressDescription}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-evenly bg-black pb-2 pt-4">
          <View className="flex-col items-center">
            <TouchableOpacity className="rounded-lg bg-white p-4">
              <FontAwesome5 name="car" size={20} color="black" />
            </TouchableOpacity>
            <Text className="text-lg text-white">Get there</Text>
          </View>
          <View className="flex-col items-center">
            <TouchableOpacity className="rounded-lg bg-white p-4">
              <FontAwesome5 name="share-alt" size={20} color="black" />
            </TouchableOpacity>
            <Text className="text-lg text-white">Share</Text>
          </View>
        </View>
      </View>
    </ScrollViewSheet>
  );
};

const _EventDetailsController = (props: { eventId: string }) => {
  const { eventId } = props;
  const eventQuery = trpc.events.eventForExternalView.useQuery({ eventId });

  switch (eventQuery.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="This event is unavailable" />;
    case "success":
      return <_EventDetailsView event={eventQuery.data} />;
  }
};

const _EventDetailsPreviewController = (props: { eventId: string }) => {
  const { eventId } = props;
  const eventQuery = trpc.events.eventForReadyPreview.useQuery({
    eventId,
  });

  switch (eventQuery.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="This event is unavailable" />;
    case "success":
      return <_EventDetailsView event={eventQuery.data} />;
  }
};

const _EventDetails = (
  props: { eventQuery: string },
  ref: Ref<BottomSheetModalMethods>,
) => {
  const { eventQuery } = props;

  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["80%"], []);

  const backdrop = useSheetBackdrop();

  const [eventId, preview] = useMemo(() => {
    const [eventId, preview] = eventQuery.split(",");
    return [eventId, preview === "preview"];
  }, [eventQuery]);

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={backdrop}
      backgroundComponent={CustomBackground}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={snapPoints}
      handleComponent={null}
      onDismiss={() => {
        navViewEventClose();
      }}
    >
      {preview ? (
        <_EventDetailsPreviewController eventId={eventId} />
      ) : (
        <_EventDetailsController eventId={eventId} />
      )}
    </BottomSheetModal>
  );
};

export const EventDetails = forwardRef(_EventDetails);
