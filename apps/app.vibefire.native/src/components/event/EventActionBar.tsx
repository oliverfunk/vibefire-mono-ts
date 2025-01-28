import React, { useCallback, useState, type PropsWithChildren } from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import { useRouter } from "expo-router";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";

import { type TModelVibefireEvent } from "@vibefire/models";
import { selectedDateDTAtom } from "@vibefire/shared-state";
import { ntzToDateTime, type PartialDeep } from "@vibefire/utils";

import { eventMapMapRefAtom } from "!/atoms";
import { TextB, TextL } from "!/c/atomic/text";
import { ContC } from "!/c/atomic/view";
import { navHomeWithCollapse } from "!/nav";
import {
  appleMapsOpenEventLocationURL,
  googleMapsOpenEventLocationURL,
  uberClientRequestToEventLocationURL,
} from "!utils/urls";

export const OpenInMapsModalMenu = (
  props: PropsWithChildren<{
    location?: TModelVibefireEvent["location"];
    times?: PartialDeep<TModelVibefireEvent["times"]>;
    disabled?: boolean;
  }>,
) => {
  const { location, times, disabled = false } = props;

  const router = useRouter();

  const [eventMapMapRef] = useAtom(eventMapMapRefAtom);
  const setSelectedDate = useSetAtom(selectedDateDTAtom);
  const [menuVisible, setMenuVisible] = useState(false);

  const openDropdown = (): void => {
    setMenuVisible(true);
  };

  const onOpenInGoogleMaps = useCallback(async () => {
    if (!location) {
      return;
    }
    const url = googleMapsOpenEventLocationURL(location);
    try {
      await Linking.openURL(url);
      setMenuVisible(false);
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [location]);

  const onOpenInAppleMaps = useCallback(async () => {
    if (!location) {
      return;
    }
    const url = appleMapsOpenEventLocationURL(location);
    try {
      await Linking.openURL(url);
      setMenuVisible(false);
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [location]);

  const onOpenInEventMap = useCallback(() => {
    if (!location || !times || !times.ntzStart) {
      return;
    }
    navHomeWithCollapse(router);
    setSelectedDate(ntzToDateTime(times.ntzStart));
    eventMapMapRef?.animateCamera({
      center: {
        latitude: location.position.lat,
        longitude: location.position.lng,
      },
    });
    setMenuVisible(false);
  }, [eventMapMapRef, location, router, setSelectedDate, times]);

  return (
    <Pressable
      onPress={() => {
        menuVisible ? setMenuVisible(false) : openDropdown();
      }}
      disabled={disabled}
    >
      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable
          className="h-full w-full items-center justify-center bg-black/50 p-4"
          onPress={() => setMenuVisible(false)}
        >
          <View className="flex-col space-y-4 overflow-hidden rounded bg-white p-4">
            <TextL className="font-bold text-black">Open in maps</TextL>
            <TextB className="text-black ">
              {"Open the event's location in another app"}
            </TextB>
            <ContC className="items-end">
              <TouchableOpacity onPress={onOpenInGoogleMaps}>
                <TextB className="font-bold text-black">Google Maps</TextB>
              </TouchableOpacity>
              {Platform.OS === "ios" && (
                <TouchableOpacity onPress={onOpenInAppleMaps}>
                  <TextB className="font-bold text-black">Apple Maps</TextB>
                </TouchableOpacity>
              )}
            </ContC>
            <TextB className="text-black ">
              {"Or go to the event's time and location on the event map"}
            </TextB>
            <ContC className="items-end">
              <TouchableOpacity onPress={onOpenInEventMap}>
                <TextB className="font-bold text-black">Event map</TextB>
              </TouchableOpacity>
            </ContC>
          </View>
        </Pressable>
      </Modal>
      {props.children}
    </Pressable>
  );
};

export const EventActionsBar = (
  props: {
    location?: PartialDeep<TModelVibefireEvent["location"]>;
    times?: PartialDeep<TModelVibefireEvent["times"]>;
    onShareEvent?: () => void;
    disabled?: boolean;
    hideShareButton?: boolean;
  } & ViewProps,
) => {
  const {
    onShareEvent,
    location,
    times,
    disabled = false,
    hideShareButton = false,
  } = props;

  const onGetToEvent = useCallback(async () => {
    if (!location) {
      return;
    }
    const uberClientID = process.env.EXPO_PUBLIC_UBER_CLIENT_ID! as string;
    const url = uberClientRequestToEventLocationURL(
      uberClientID,
      location as TModelVibefireEvent["location"],
    );

    try {
      await Linking.openURL(url);
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [location]);

  return (
    <View className="flex-row justify-around" {...props}>
      <OpenInMapsModalMenu
        location={location as TModelVibefireEvent["location"]}
        times={times}
        disabled={disabled}
      >
        <View className="flex-col items-center justify-between">
          <FontAwesome5
            name="map"
            size={20}
            color={disabled ? "grey" : "white"}
          />
          <Text className={`${disabled ? "text-neutral-600" : "text-white"}`}>
            Maps
          </Text>
        </View>
      </OpenInMapsModalMenu>

      <Pressable
        className="flex-col items-center justify-between"
        disabled={disabled}
        onPress={onGetToEvent}
      >
        <FontAwesome5
          name="car"
          size={20}
          color={disabled ? "grey" : "white"}
        />
        <Text className={`${disabled ? "text-neutral-600" : "text-white"}`}>
          Get there
        </Text>
      </Pressable>

      {!hideShareButton && (
        <Pressable
          className="flex-col items-center justify-between"
          disabled={disabled}
          onPress={onShareEvent}
        >
          <Entypo
            name="share-alternative"
            size={20}
            color={disabled ? "grey" : "white"}
          />
          <Text className={`${disabled ? "text-neutral-600" : "text-white"}`}>
            Share
          </Text>
        </Pressable>
      )}
    </View>
  );
};
