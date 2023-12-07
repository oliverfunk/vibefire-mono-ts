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
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { type VibefireEventT, type VibefireUserT } from "@vibefire/models";
import { selectedDateDTAtom } from "@vibefire/shared-state";
import {
  appleMapsOpenEventLocationURL,
  googleMapsOpenEventLocationURL,
  isoNTZToUTCDateTime,
  organisationProfileImagePath,
  uberRequestToEventURL,
} from "@vibefire/utils";

import { EventImage, StandardImage } from "~/components/event/EventImage";
import { EventImageCarousel } from "~/components/event/EventImageCarousel";
import { EventTimeline } from "~/components/event/EventTimeline";
import { trpc } from "~/apis/trpc-client";
import {
  eventMapMapRefAtom,
  mainBottomSheetPresentToggleAtom,
  userAtom,
  userSessionRetryAtom,
} from "~/atoms";
import { useShareEventLink } from "~/hooks/useShareEventLink";
import { navClearAll, navManageEvent, navViewOrg } from "~/nav";
import { LocationDisplayMap } from "../LocationDisplayMap";
import { ErrorSheet, LoadingSheet, ScrollViewSheet } from "./_shared";

const ThreeDotsMenuOption = (props: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) => {
  const { label, icon, onPress } = props;
  return (
    <TouchableOpacity
      className="flex-row items-center justify-stretch space-x-2 p-2"
      onPress={onPress}
    >
      <Text className="text-base">{label}</Text>
      <View className="flex-auto" />
      {icon}
    </TouchableOpacity>
  );
};

const MapsModalMenu = (props: { event: VibefireEventT }) => {
  const { event } = props;

  const [menuVisible, setMenuVisible] = useState(false);

  const openDropdown = (): void => {
    setMenuVisible(true);
  };

  const onOpenInGoogleMaps = useCallback(async () => {
    const url = googleMapsOpenEventLocationURL(event);
    try {
      await Linking.openURL(url);
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [event]);

  const onOpenInAppleMaps = useCallback(async () => {
    const url = appleMapsOpenEventLocationURL(event);
    try {
      await Linking.openURL(url);
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [event]);

  return (
    <TouchableOpacity
      onPress={async () => {
        if (Platform.OS === "android") {
          await onOpenInGoogleMaps();
          return;
        }
        menuVisible ? setMenuVisible(false) : openDropdown();
      }}
    >
      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable
          className="h-full w-full items-center justify-center"
          onPress={() => setMenuVisible(false)}
        >
          <View className="flex-col space-y-4 overflow-hidden rounded bg-white p-4">
            <Text className="text-xl font-bold">Open in maps</Text>
            <Text className="text-base">
              {"Open the event's location in another maps app"}
            </Text>
            <View className="flex-col items-end space-y-2">
              <TouchableOpacity onPress={onOpenInGoogleMaps}>
                <Text className="text-base font-bold">Google Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onOpenInAppleMaps}>
                <Text className="text-base font-bold">Apple Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      <View className="flex-col items-center justify-between">
        <FontAwesome5 name="map" size={20} color="white" />
        <Text className="text-sm text-white">Maps</Text>
      </View>
    </TouchableOpacity>
  );
};

const ThreeDotsModalMenu = (props: { event: VibefireEventT }) => {
  const { event } = props;

  const user = useAtomValue(userAtom);

  const [menuVisible, setMenuVisible] = useState(false);
  const DropdownButton = useRef<View>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownRight, setDropdownRight] = useState(0);

  const { close } = useBottomSheet();

  const openDropdown = (): void => {
    DropdownButton.current!.measure((_fx, _fy, w, h, px, py) => {
      setDropdownTop(py + h);
      setDropdownRight(w);
    });
    setMenuVisible(true);
  };

  const eventOrganisedByUser = useMemo(() => {
    if (user.state === "authenticated") {
      return (user.userInfo as VibefireUserT).aid === event.organiserId;
    }
    return false;
  }, [user, event.organiserId]);

  const hideEventMut = trpc.user.hideEvent.useMutation();
  const blockOrganiserMut = trpc.user.blockOrganiser.useMutation();

  return (
    <Pressable
      ref={DropdownButton}
      onPress={() => {
        menuVisible ? setMenuVisible(false) : openDropdown();
      }}
    >
      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable
          className="h-full w-full"
          onPress={() => setMenuVisible(false)}
        >
          <View
            className="absolute overflow-hidden rounded-md bg-white"
            style={{ top: dropdownTop, right: dropdownRight }}
          >
            {eventOrganisedByUser ? (
              <ThreeDotsMenuOption
                label="Manage"
                icon={
                  <MaterialIcons
                    name="app-registration"
                    color={"black"}
                    size={24}
                  />
                }
                onPress={() => {
                  setMenuVisible(false);
                  close();
                  navManageEvent(event.id);
                }}
              />
            ) : (
              <>
                <ThreeDotsMenuOption
                  label="Hide Event"
                  icon={
                    <MaterialCommunityIcons
                      name="eye-off"
                      color={"red"}
                      size={24}
                    />
                  }
                  onPress={async () => {
                    setMenuVisible(false);
                    await hideEventMut.mutateAsync({
                      eventId: event.id,
                      report: false,
                    });
                    close();
                  }}
                />
                <View className="h-px bg-gray-200" />
                <ThreeDotsMenuOption
                  label="Hide & Report Event"
                  icon={
                    <MaterialCommunityIcons
                      name="eye-off"
                      color={"red"}
                      size={24}
                    />
                  }
                  onPress={async () => {
                    setMenuVisible(false);
                    await hideEventMut.mutateAsync({
                      eventId: event.id,
                      report: true,
                    });
                    close();
                  }}
                />
                <View className="h-px bg-gray-200" />
                <ThreeDotsMenuOption
                  label="Block Organiser"
                  icon={
                    <MaterialCommunityIcons
                      name="block-helper"
                      color={"red"}
                      size={24}
                    />
                  }
                  onPress={async () => {
                    setMenuVisible(false);
                    await blockOrganiserMut.mutateAsync({
                      organiserId: event.organiserId,
                    });
                    close();
                  }}
                />
              </>
            )}
          </View>
        </Pressable>
      </Modal>
      <MaterialCommunityIcons name="dots-vertical" size={30} color="white" />
    </Pressable>
  );
};

const EventOrganiserBarView = (props: { event: VibefireEventT }) => {
  const { event } = props;

  const onOrganiserPress = useCallback(() => {
    navViewOrg(event.organiserId);
  }, [event.organiserId]);

  return (
    <View className="flex-row items-center justify-center space-x-4 bg-black py-2 pl-2">
      <Pressable onPress={onOrganiserPress}>
        {event.organiserType === "organisation" ? (
          <StandardImage
            cn="h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-white bg-black"
            source={organisationProfileImagePath(event.organiserId)}
            alt="Event Organizer Profile Picture"
          />
        ) : (
          <View className="h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-white bg-[#FF2400]">
            <Text className="text-lg text-white">
              {event.organiserName.at(0)!.toUpperCase()}
              {"."}
            </Text>
          </View>
        )}
      </Pressable>
      <Pressable
        className="flex-1 flex-col justify-center"
        onPress={onOrganiserPress}
      >
        <Text className="text-xs text-white">Organised by</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-lg font-bold text-white"
        >
          {event.organiserName}
        </Text>
      </Pressable>
      <ThreeDotsModalMenu event={event} />
    </View>
  );
};

const EventDetailsView = (props: { event: VibefireEventT }) => {
  const { event } = props;

  const width = Dimensions.get("window").width;

  const [eventMapMapRef] = useAtom(eventMapMapRefAtom);
  const [selectedDateDT, setSelectedDateDT] = useAtom(selectedDateDTAtom);

  const user = useAtomValue(userAtom);
  const setUserSessionRetry = useSetAtom(userSessionRetryAtom);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const eventFollowed = useMemo(() => {
    if (user.state === "authenticated") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return user.userInfo.followedEvents.includes(event.id);
    }
    return false;
  }, [user, event.id]);

  const imgs = useMemo(
    () => [event.images.banner].concat(event.images.additional ?? []),
    [event.images],
  );

  const onShareEvent = useShareEventLink(event);

  const onGetToEvent = useCallback(async () => {
    const uberClientID = process.env.EXPO_PUBLIC_UBER_CLIENT_ID!;
    const url = uberRequestToEventURL(uberClientID, event);

    try {
      await Linking.openURL(url);
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [event]);

  const starEventMut = trpc.user.starEvent.useMutation();
  const onStarEvent = useCallback(async () => {
    if (user.state !== "authenticated") {
      Toast.show({
        type: "warn",
        text1: "Sign in to star events",
        position: "bottom",
        bottomOffset: 50,
        visibilityTime: 3000,
      });
      return;
    }
    await starEventMut.mutateAsync({
      eventId: event.id,
      starIt: !eventFollowed,
    });
    setUserSessionRetry((prev) => !prev);
  }, [event.id, eventFollowed, setUserSessionRetry, starEventMut, user.state]);

  const setPresentMainToggle = useSetAtom(mainBottomSheetPresentToggleAtom);

  const onMoveToEvent = useCallback(() => {
    setSelectedDateDT(isoNTZToUTCDateTime(event.timeStartIsoNTZ));
    eventMapMapRef?.animateCamera({
      center: {
        latitude: event.location.position.lat,
        longitude: event.location.position.lng,
      },
    });
    navClearAll();
    setPresentMainToggle((prev) => ({
      initial: false,
      present: false,
      toggle: !prev.toggle,
    }));
  }, [event, eventMapMapRef, setPresentMainToggle, setSelectedDateDT]);

  return (
    <ScrollViewSheet>
      {/* Header */}
      <View className="relative">
        {/* Background image */}
        {imgs.length === 1 ? (
          <EventImage
            eventId={event.id}
            imgIdKey={imgs[0]}
            alt="Event Banner"
          />
        ) : (
          <EventImageCarousel
            eventId={event.id}
            imgIdKeys={imgs}
            width={width}
          />
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
        <View className="mt-2 h-10 flex-row justify-around">
          <MapsModalMenu event={event} />
          <TouchableOpacity
            className="flex-col items-center justify-between"
            onPress={onGetToEvent}
          >
            <FontAwesome5 name="car" size={20} color="white" />
            <Text className="text-sm text-white">Get there</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-col items-center justify-between"
            onPress={onShareEvent}
          >
            <Entypo name="share-alternative" size={20} color="white" />
            <Text className="text-sm text-white">Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-col items-center justify-between"
            onPress={onStarEvent}
          >
            {!!eventFollowed ? (
              <FontAwesome name="star" size={20} color="gold" />
            ) : (
              <FontAwesome5 name="star" size={20} color="white" />
            )}
            <Text className="text-sm text-white">Star</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-center text-sm text-white">
            (Star the event to save it to the top of your events list)
          </Text>
        </View>

        {!selectedDateDT.hasSame(
          isoNTZToUTCDateTime(event.timeStartIsoNTZ),
          "day",
        ) && (
          <View className="items-center pt-2">
            <TouchableOpacity
              className="flex-col items-center justify-between rounded-lg bg-white px-4 py-2"
              onPress={onMoveToEvent}
            >
              <FontAwesome5 name="clock" size={20} color="black" />
              <Text className="text-sm text-black">Open event time on map</Text>
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

        {/* Map */}
        <View>
          <Text className="pb-2 text-2xl font-bold text-white">Location</Text>
          <Pressable
            className="flex-row items-center space-x-2 px-2 pb-2"
            onPress={async () => {
              await Clipboard.setStringAsync(event.location.addressDescription);
              Toast.show({
                type: "success",
                text1: "Address copied!",
                position: "bottom",
                bottomOffset: 50,
                visibilityTime: 1000,
              });
            }}
          >
            <FontAwesome5 name="map-marker-alt" size={20} color="white" />
            <Text className="text-sm text-white">
              {event.location.addressDescription}
            </Text>
          </Pressable>
          <Pressable
            className="aspect-[4/4] overflow-hidden rounded-lg"
            onPress={onMoveToEvent}
          >
            <LocationDisplayMap markerPosition={event.location.position} />
          </Pressable>
          <Text className="pb-2 text-center text-sm text-white">
            (Tap to view on the map)
          </Text>
        </View>
      </View>
    </ScrollViewSheet>
  );
};

const EventDetailsController = (props: { eventId: string }) => {
  const { eventId } = props;
  const eventQuery = trpc.events.eventForExternalView.useQuery({ eventId });

  switch (eventQuery.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="This event is unavailable" />;
    case "success":
      return <EventDetailsView event={eventQuery.data} />;
  }
};

const EventDetailsPreviewController = (props: { eventId: string }) => {
  const { eventId } = props;
  const eventQuery = trpc.events.eventAllInfoForManagement.useQuery({
    eventId,
  });

  console.log("EventDetailsPreviewController");

  switch (eventQuery.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="This event is unavailable" />;
    case "success":
      return <EventDetailsView event={eventQuery.data.event} />;
  }
};

export const EventDetails = (props: { eventQuery: string }) => {
  const { eventQuery } = props;

  const [eventId, preview] = useMemo(() => {
    const [eventId, preview] = eventQuery.split(",");
    return [eventId, preview === "preview"];
  }, [eventQuery]);

  return preview ? (
    <EventDetailsPreviewController eventId={eventId} />
  ) : (
    <EventDetailsController eventId={eventId} />
  );
};
