import { useMemo } from "react";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";

import { trpc } from "!/api/trpc-client";

import { EventActionsBar } from "!/components/event/EventActionBar";
import { EventImageCarousel } from "!/components/event/EventImageCarousel";
import {
  EventInfoAddressBar,
  EventInfoTimesBar,
} from "!/components/event/EventInfoBars";
import { EventOrganiserBarView } from "!/components/event/EventOrganiserBar";
import { VibefireImage } from "!/components/image/VibefireImage";
import { LocationDisplayMap } from "!/components/map/LocationDisplayMap";
import {
  LinearRedOrangeView,
  ScrollViewSheet,
  ScrollViewSheetWithRef,
} from "!/components/misc/sheet-utils";
import { withSuspenseErrorBoundarySheet } from "!/components/misc/SuspenseWithError";
import { VibefireBottomLogo } from "!/components/VibefireBottomLogo";
import { navEditEvent, navManageEvent } from "!/nav";

import { EventDetailWidgetView } from "./EventDetailWidgetView";

const MapLocationView = (props: { event: TModelVibefireEvent }) => {
  const { event } = props;

  return (
    <View>
      <Text className="pb-2 text-2xl font-bold text-white">Location</Text>
      <Pressable
        className="flex-row items-center space-x-2 px-2 pb-2"
        onPress={() => {
          // todo
          // Clipboard.setString(event.location.addressDescription);
          Toast.show({
            type: "success",
            text1: "Address copied",
            position: "bottom",
            bottomOffset: 50,
            visibilityTime: 1000,
          });
        }}
      >
        <FontAwesome6 name="map-pin" size={20} color="white" />
        <Text className="text-sm text-white">
          {event.location.addressDescription}
        </Text>
      </Pressable>

      <Text className="pb-2 text-center text-sm text-white">
        (Tap to view on the map)
      </Text>
    </View>
  );
};

const ViewEventSheet = (props: {
  event: TModelVibefireEvent;
  onEditEventPress: () => void;
  onManageEventPress: () => void;
  onOrganiserPress: () => void;
}) => {
  const { event, onEditEventPress, onManageEventPress, onOrganiserPress } =
    props;

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const bannerImgKeys = useMemo(
    () => event.images.bannerImgKeys,
    [event.images],
  );

  const details = useMemo(() => {
    return event.event.details;
  }, [event.event.details]);

  return (
    <ScrollViewSheet>
      {/* image, title header */}
      <View className="relative">
        {/* Background image */}
        {bannerImgKeys.length === 1 ? (
          <VibefireImage imgIdKey={bannerImgKeys[0]} alt="Event Banner" />
        ) : (
          <EventImageCarousel imgIdKeys={bannerImgKeys} width={width} />
        )}

        <LinearGradient
          className="absolute bottom-0 w-full px-4 pt-2"
          colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 0.8)"]}
          locations={[0, 1]}
        >
          <Text className="py-2 text-center text-2xl text-white">
            {event.name}
          </Text>
        </LinearGradient>
      </View>

      {/* black bars */}
      <EventOrganiserBarView event={event} onPress={onOrganiserPress} />
      <EventActionsBar event={event} />

      {/* infos */}
      <LinearRedOrangeView className="flex-col p-0.5">
        <View className="flex-col space-y-4 rounded-md bg-neutral-900 p-3.5">
          <View>
            <EventInfoTimesBar event={event} />
          </View>
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(event.location.addressDescription);
              Toast.show({
                type: "success",
                text1: "Address copied",
                position: "top",
                topOffset: height / 10,
                visibilityTime: 1000,
              });
            }}
          >
            <EventInfoAddressBar event={event} />
          </TouchableOpacity>
        </View>
      </LinearRedOrangeView>

      {/* map */}
      <View className="pt-1">
        {/* <Text className="p-2 text-center text-white">
          (Tap the map to select a location)
        </Text> */}
        <View className="aspect-[4/4]">
          <LocationDisplayMap markerPosition={event.location.position} />
        </View>
      </View>

      {/* details */}
      <View className="flex-col space-y-4 p-4">
        {details.map((detail, index) => (
          <View key={index}>
            <EventDetailWidgetView detail={detail} />
          </View>
        ))}
      </View>
    </ScrollViewSheet>
  );
};

const ViewEventSheetCommon = (props: { event: TModelVibefireEvent }) => {
  const { event } = props;

  const router = useRouter();

  return (
    <ViewEventSheet
      event={event}
      onEditEventPress={() => navEditEvent(router, event.id)}
      onManageEventPress={() => {
        navManageEvent(router, event.id);
      }}
      onOrganiserPress={() => {}}
    />
  );
};

export const ViewEventPreviewSheet = withSuspenseErrorBoundarySheet(
  (props: { eventId: string }) => {
    const { eventId } = props;

    const [viewManage] = trpc.events.viewManage.useSuspenseQuery(
      {
        eventId,
      },
      {
        gcTime: 1000,
      },
    );

    if (!viewManage.ok) {
      throw viewManage.error;
    }

    return <ViewEventSheetCommon event={viewManage.value} />;
  },
);

export const ViewEventPublishedSheet = withSuspenseErrorBoundarySheet(
  (props: { eventId: string }) => {
    const { eventId } = props;

    const [viewPublished] = trpc.events.viewPublished.useSuspenseQuery(
      {
        eventId,
      },
      {
        gcTime: 1000,
      },
    );

    if (!viewPublished.ok) {
      throw viewPublished.error;
    }

    return <ViewEventSheetCommon event={viewPublished.value} />;
  },
);

export const ViewEventViaLinkSheet = withSuspenseErrorBoundarySheet(
  (props: { eventId: string }) => {
    const { eventId } = props;

    const [viewManage] = trpc.events.viewPublished.useSuspenseQuery(
      {
        eventId,
      },
      {
        gcTime: 1000,
      },
    );

    if (!viewManage.ok) {
      throw viewManage.error;
    }

    return <ViewEventSheetCommon event={viewManage.value} />;
  },
);
