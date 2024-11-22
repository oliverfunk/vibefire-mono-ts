import { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useBottomSheet } from "@gorhom/bottom-sheet";
import { useAtom, useSetAtom } from "jotai";

import { type TModelVibefireEvent } from "@vibefire/models";
import { selectedDateDTAtom } from "@vibefire/shared-state";
import {
  appleMapsOpenEventLocationURL,
  googleMapsOpenEventLocationURL,
  isoNTZToUTCDateTime,
  organisationProfileImagePath,
  uberClientRequestToEventLocationURL,
} from "@vibefire/utils";

import { defaultCameraForPosition } from "!/utils/constants";
import { trpc } from "!/api/trpc-client";
import { useShareEventLink } from "!/hooks/useShareEventLink";

import {
  eventMapMapRefAtom,
  userAuthStateAtom,
  userInfoAtom,
  userSessionRetryAtom,
} from "!/atoms";
import { EventImageCarousel } from "!/c/event/EventImageCarousel";
import { EventTimeline } from "!/c/event/EventTimeline";
import { StandardImage } from "!/c/image/StandardImage";
import { VibefireImage } from "!/c/image/VibefireImage";
import { LocationDisplayMap } from "!/c/map/LocationDisplayMap";
import {
  ErrorSheet,
  LoadingSheet,
  ScrollViewSheet,
} from "!/c/misc/sheet-utils";
import { navHomeWithCollapse, navManageEvent } from "!/nav";

const EventDetailsView = (props: { event: TModelVibefireEvent }) => {
  const { event } = props;

  const width = Dimensions.get("window").width;

  const [eventMapMapRef] = useAtom(eventMapMapRefAtom);
  const [selectedDateDT, setSelectedDateDT] = useAtom(selectedDateDTAtom);

  const [userInfo] = useAtom(userInfoAtom);
  const [userAuthState] = useAtom(userAuthStateAtom);
  const setUserSessionRetry = useSetAtom(userSessionRetryAtom);

  const eventFollowed = useMemo(() => {
    return userInfo?.followedEvents.includes(event.id) ?? false;
  }, [userInfo?.followedEvents, event.id]);

  const imgs = useMemo(
    () => [event.images.banner].concat(event.images.additional ?? []),
    [event.images],
  );

  const starEventMut = trpc.user.starEvent.useMutation();
  const onStarEvent = useCallback(async () => {
    if (userAuthState !== "authenticated") {
      Toast.show({
        type: "error",
        text1: "Sign in to star events",
        position: "bottom",
        bottomOffset: 50,
        visibilityTime: 2000,
      });
      return;
    }
    await starEventMut.mutateAsync({
      eventId: event.id,
      starIt: !eventFollowed,
    });
    setUserSessionRetry((prev) => !prev);
  }, [
    event.id,
    eventFollowed,
    setUserSessionRetry,
    starEventMut,
    userAuthState,
  ]);

  const onGoToEvent = useCallback(() => {
    setSelectedDateDT(isoNTZToUTCDateTime(event.timeStartIsoNTZ));
    eventMapMapRef?.animateCamera(
      defaultCameraForPosition(event.location.position),
    );
    navHomeWithCollapse();
  }, [event, eventMapMapRef, setSelectedDateDT]);

  return (
    <ScrollViewSheet>
      {/* Header */}
      <View className="relative">
        {/* Background image */}
        {imgs.length === 1 ? (
          <VibefireImage imgIdKey={imgs[0]} alt="Event Banner" />
        ) : (
          <EventImageCarousel imgIdKeys={imgs} width={width} />
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

      <EventOrganiserBarView event={event} />

      {/* Main */}
      <View className="flex-col space-y-2 px-2">
        {/* Actions */}

        <View>
          <Text className="text-center text-sm text-white">
            (Star the event to save it to the top of your events list)
          </Text>
        </View>

        {!selectedDateDT.hasSame(
          isoNTZToUTCDateTime(event.times.tsStart),
          "day",
        ) && (
          <View className="items-center pt-2">
            <TouchableOpacity
              className="flex-col items-center justify-between rounded-lg bg-white px-4 py-2"
              onPress={onGoToEvent}
            >
              <FontAwesome5 name="clock" size={20} color="black" />
              <Text className="text-sm text-black">
                Go to event time and place
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Details */}
        <View>
          <Text className="pb-2 text-2xl font-bold text-white">Details</Text>
          <Text className="text-base text-white">{event.description}</Text>
        </View>

        {/* Timeline */}
        <View>
          <Text className="pb-2 text-2xl font-bold text-white">Timeline</Text>
          <EventTimeline
            timelineElements={event.timeline}
            timeStartIsoNTZ={event.timeStartIsoNTZ}
            timeEndIsoNTZ={event.timeEndIsoNTZ}
          />
        </View>
      </View>
    </ScrollViewSheet>
  );
};

const EventDetailsController = (props: { linkId: string }) => {
  const { linkId } = props;
  const eventQuery = trpc.events.eventForExternalView.useQuery({ linkId });

  switch (eventQuery.status) {
    case "pending":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="This event is unavailable" />;
    case "success":
      return <EventDetailsView event={eventQuery.data} />;
  }
};

const EventDetailsPreviewController = (props: { linkId: string }) => {
  const { linkId } = props;
  const eventQuery = trpc.events.eventAllInfoForManagement.useQuery({
    linkId,
  });

  switch (eventQuery.status) {
    case "pending":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="This event is unavailable" />;
    case "success":
      return <EventDetailsView event={eventQuery.data.event} />;
  }
};

export const EventDetails = (props: { linkId: string; preview: boolean }) => {
  const { linkId, preview } = props;

  if (preview) {
    return <EventDetailsPreviewController linkId={linkId} />;
  }
  return <EventDetailsController linkId={linkId} />;
};
