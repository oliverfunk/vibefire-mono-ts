import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import { useAtomValue } from "jotai";

import { type VibefireEventT, type VibefireUserT } from "@vibefire/models";
import {
  organisationProfileImagePath,
  uberRequestToEventURL,
} from "@vibefire/utils";

import { EventImage, StandardImage } from "~/components/event/EventImage";
import { EventImageCarousel } from "~/components/event/EventImageCarousel";
import { EventTimeline } from "~/components/event/EventTimeline";
import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { trpc } from "~/apis/trpc-client";
import { userAtom } from "~/atoms";
import { useShareEventLink } from "~/hooks/useShareEventLink";
import { navManageEvent, navViewOrg } from "~/nav";
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

const ThreeDotsMenu = (props: { event: VibefireEventT }) => {
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

  useEffect(() => {
    if (hideEventMut.isSuccess) {
      // todo refresh mapquery
      close();
    }
  }, [close, hideEventMut.isSuccess]);
  useEffect(() => {
    if (blockOrganiserMut.isSuccess) {
      // todo refresh mapquery
      close();
    }
  }, [blockOrganiserMut.isSuccess, close]);

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
                  onPress={() => {
                    setMenuVisible(false);
                    hideEventMut.mutate({ eventId: event.id, report: false });
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
                  onPress={() => {
                    setMenuVisible(false);
                    hideEventMut.mutate({ eventId: event.id, report: true });
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
                  onPress={() => {
                    setMenuVisible(false);
                    blockOrganiserMut.mutate({
                      organiserId: event.organiserId,
                    });
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
      <ThreeDotsMenu event={event} />
    </View>
  );
};

const EventDetailsView = (props: { event: VibefireEventT }) => {
  const { event } = props;

  const width = Dimensions.get("window").width;

  const user = useAtomValue(userAtom);

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

  const onMapPress = useCallback(() => {
    // todo
  }, []);

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

  const onFollowEvent = useCallback(() => {
    // todo
  }, []);

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
          <TouchableOpacity
            className="flex-col items-center justify-between"
            onPress={onMapPress}
          >
            <FontAwesome5 name="map" size={20} color="white" />
            <Text className="text-sm text-white">Maps</Text>
          </TouchableOpacity>

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
            onPress={onFollowEvent}
          >
            {!!eventFollowed ? (
              <FontAwesome name="star" size={20} color="yellow" />
            ) : (
              <FontAwesome5 name="star" size={20} color="white" />
            )}
            <Text className="text-sm text-white">Interested</Text>
          </TouchableOpacity>
        </View>

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
            className="aspect-[4/4] pb-2"
            onPress={() => {
              console.log("pressed map");
            }}
          >
            <LocationSelectionMap
              initialPosition={event.location.position}
              fixed={true}
            />
          </Pressable>
          <View className="flex-row items-center space-x-2 px-2">
            <FontAwesome5 name="map-marker-alt" size={20} color="white" />
            <Text className="text-sm text-white">
              {event.location.addressDescription}
            </Text>
          </View>
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
