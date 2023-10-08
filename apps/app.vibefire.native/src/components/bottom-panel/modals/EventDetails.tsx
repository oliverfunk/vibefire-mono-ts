import { forwardRef, useMemo, type Ref } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { type VibefireEventT } from "@vibefire/models";

import { EventImage } from "~/components/EventImage";
import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { trpc } from "~/apis/trpc-client";
import {
  ErrorSheet,
  LinearRedOrangeView,
  LoadingSheet,
  ScrollViewSheet,
  useSheetBackdrop,
} from "../_shared";

const _EventDetailsView = (props: { event: VibefireEventT }) => {
  const { event } = props;

  return (
    <ScrollViewSheet>
      <View className="flex-col space-y-4">
        <EventImage vfImgKey={event.images.banner} alt="Event Banner" />
        <Text className="text-center text-2xl font-bold">{event.title}</Text>
        <Text className="px-2 text-lg">{event.description}</Text>
        {/* Organised by ... */}
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
