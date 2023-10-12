import { forwardRef, useMemo, type Ref } from "react";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { type VibefireEventT } from "@vibefire/models";

import { EventImage, StandardImage } from "~/components/EventImage";
import { EventTimeline } from "~/components/EventTimeline";
import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { trpc } from "~/apis/trpc-client";
import {
  ErrorSheet,
  LinearRedOrangeView,
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
      className="flex-row items-center space-x-4 bg-black p-2"
      onPress={() => {}}
    >
      {organiserProfileUrl ? (
        <StandardImage
          cn="h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-orange-400"
          source={organiserProfileUrl}
          alt="Event Organizer Profile Picture"
        />
      ) : (
        <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-orange-400">
          <Text className="text-lg text-white">
            {organiserName.at(0)!.toUpperCase()}
          </Text>
        </View>
      )}
      <Text className="text-lg text-white">{organiserName}</Text>
    </Pressable>
  );
};

const _EventDetailsView = (props: { event: VibefireEventT }) => {
  const { event } = props;

  const width = Dimensions.get("window").width;

  return (
    <ScrollViewSheet>
      {/* Header */}
      <View className="relative">
        <EventImage vfImgKey={event.images.banner} alt="Event Banner" />
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
        <View className="mx-2 mt-2 rounded-lg border-2 border-slate-50 bg-slate-200 p-2">
          <Text className="text-lg">{event.description}</Text>
        </View>
        {/* Timeline */}
        <View className="px-2">
          <EventTimeline
            timelineElements={event.timeline}
            timeStartIsoNTZ={event.timeStartIsoNTZ}
            timeEndIsoNTZ={event.timeEndIsoNTZ}
          />
        </View>
        {/* Map */}
        <LinearRedOrangeView className="flex-col bg-black p-2">
          <View className="aspect-[4/4]">
            <LocationSelectionMap
              currentSelectedPosition={event.location.position}
              fixed={true}
            />
          </View>
          <Text className="bg-black p-2 text-center text-lg text-white">
            {event.location.addressDescription}
          </Text>
        </LinearRedOrangeView>
        {/* Add. images */}
        {event.images.additional && (
          <Carousel
            width={width}
            height={width}
            defaultIndex={0}
            loop={false}
            data={event.images.additional}
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
            renderItem={({ index, item }) => {
              return (
                <View className="relative items-center">
                  <EventImage
                    vfImgKey={item}
                    alt={`Additional Image ${index}`}
                  />
                </View>
              );
            }}
          />
        )}
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
      bottomInset={insets.bottom}
      index={0}
      snapPoints={snapPoints}
      handleComponent={null}
      onDismiss={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router.setParams({ eventId: undefined });
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
