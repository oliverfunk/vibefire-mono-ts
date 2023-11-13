import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { type VibefireEventT } from "@vibefire/models";
import {
  organisationProfileImagePath,
  uberRequestToEventURL,
  vibefireEventShareURL,
} from "@vibefire/utils";

import { EventImage, StandardImage } from "~/components/event/EventImage";
import { EventImageCarousel } from "~/components/event/EventImageCarousel";
import { EventTimeline } from "~/components/event/EventTimeline";
import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { trpc } from "~/apis/trpc-client";
import { navViewEventClose, navViewOrg } from "~/nav";
import {
  ErrorSheet,
  LoadingSheet,
  ScrollViewSheet,
  useSheetBackdrop,
} from "./_shared";

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

  const [visible, setVisible] = useState(false);
  const DropdownButton = useRef<View>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownRight, setDropdownRight] = useState(0);

  const openDropdown = (): void => {
    DropdownButton.current!.measure((_fx, _fy, w, h, px, py) => {
      console.log(JSON.stringify([_fx, _fy, w, h, px, py], null, 2));
      setDropdownTop(py + h);
      setDropdownRight(w);
    });
    setVisible(true);
  };

  const hideEvent = trpc.user.hideEvent.useMutation();
  const blockOrganiser = trpc.user.blockOrganiser.useMutation();

  const onShareEvent = useCallback(async () => {
    setVisible(false);

    try {
      await Share.share({
        message: `Vibefire | Checkout out this event!\n${vibefireEventShareURL(
          event,
        )}`,
      });
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [event]);

  const onGetToEvent = useCallback(async () => {
    setVisible(false);

    const uberClientID = process.env.EXPO_PUBLIC_UBER_CLIENT_ID!;
    const url = uberRequestToEventURL(uberClientID, event);

    try {
      await Linking.openURL(url);
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [event]);

  useEffect(() => {
    if (hideEvent.status === "success") {
      // todo refresh mapquery
      navViewEventClose();
    }
  }, [hideEvent.status]);
  useEffect(() => {
    if (blockOrganiser.status === "success") {
      // todo refresh mapquery
      navViewEventClose();
    }
  }, [blockOrganiser.status]);

  return (
    <Pressable
      ref={DropdownButton}
      onPress={() => {
        visible ? setVisible(false) : openDropdown();
      }}
    >
      <Modal visible={visible} transparent animationType="fade">
        <Pressable className="h-full w-full" onPress={() => setVisible(false)}>
          <View
            className="absolute overflow-hidden rounded-md bg-white"
            style={{ top: dropdownTop, right: dropdownRight }}
          >
            <ThreeDotsMenuOption
              label="Share Event"
              icon={<Entypo name="share" size={24} color="black" />}
              onPress={onShareEvent}
            />
            <View className="h-px bg-gray-200" />
            <ThreeDotsMenuOption
              label="Get to Event"
              icon={<FontAwesome5 name="car" size={24} color="black" />}
              onPress={onGetToEvent}
            />
            <View className="h-px bg-gray-200" />
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
                setVisible(false);
                hideEvent.mutate({ eventId: event.id, report: false });
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
                setVisible(false);
                hideEvent.mutate({ eventId: event.id, report: true });
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
                setVisible(false);
                blockOrganiser.mutate({ organiserId: event.organiserId });
              }}
            />
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
      {/* Main */}
      <View className="flex-col">
        <EventOrganiserBarView event={event} />

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

        {/* <View className="flex-row justify-evenly bg-black pb-2 pt-4">
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
        </View> */}
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
      return <EventDetailsView event={eventQuery.data} />;
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
      return <EventDetailsView event={eventQuery.data} />;
  }
};

const _EventDetails = (
  props: { eventQuery: string },
  ref: Ref<BottomSheetModalMethods>,
) => {
  const { eventQuery } = props;

  const insets = useSafeAreaInsets();
  const backdrop = useSheetBackdrop();

  const [eventId, preview] = useMemo(() => {
    const [eventId, preview] = eventQuery.split(",");
    return [eventId, preview === "preview"];
  }, [eventQuery]);

  return (
    <BottomSheetModal
      ref={ref}
      backgroundStyle={{
        backgroundColor: "black",
      }}
      backdropComponent={backdrop}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={["80%"]}
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
