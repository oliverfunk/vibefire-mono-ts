import React, { useCallback, useState } from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";

import { useShareEventLink } from "!/hooks/useShareEventLink";

import {
  appleMapsOpenEventLocationURL,
  googleMapsOpenEventLocationURL,
  uberClientRequestToEventLocationURL,
} from "!utils/urls";

const MapsModalMenu = (props: {
  event: TModelVibefireEvent;
  disabled: boolean;
}) => {
  const { event, disabled } = props;

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
      disabled={disabled}
    >
      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable
          className="h-full w-full items-center justify-center bg-black/50 p-4"
          onPress={() => setMenuVisible(false)}
        >
          <View className="flex-col space-y-4 overflow-hidden rounded bg-white p-4">
            <Text className="text-xl font-bold">Open in maps</Text>
            <Text className="text-base">
              {"Open the event's location in another maps app"}
            </Text>
            <View className="flex-col items-end space-y-2">
              <TouchableOpacity onPress={onOpenInGoogleMaps}>
                <Text className="text-base font-bold text-gray-500">
                  Google Maps
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onOpenInAppleMaps}>
                <Text className="text-base font-bold text-gray-500">
                  Apple Maps
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      <View className="flex-col items-center justify-between">
        <FontAwesome5
          name="map"
          size={20}
          color={disabled ? "grey" : "white"}
        />
        <Text className="text-sm text-white">Maps</Text>
      </View>
    </TouchableOpacity>
  );
};

export const EventActionsBar = (props: {
  event: TModelVibefireEvent;
  disabled?: boolean;
}) => {
  const { event, disabled = true } = props;

  const onShareEvent = useShareEventLink(event);

  const onGetToEvent = useCallback(async () => {
    const uberClientID = process.env.EXPO_PUBLIC_UBER_CLIENT_ID!;
    const url = uberClientRequestToEventLocationURL(uberClientID, event);

    try {
      await Linking.openURL(url);
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [event]);

  return (
    <View className="flex-row justify-around bg-black p-1">
      <MapsModalMenu event={event} disabled={disabled} />

      <TouchableOpacity
        className="flex-col items-center justify-between"
        disabled={disabled}
        onPress={onGetToEvent}
      >
        <FontAwesome5
          name="car"
          size={20}
          color={disabled ? "grey" : "white"}
        />
        <Text className="text-sm text-white">Get there</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-col items-center justify-between"
        disabled={disabled}
        onPress={onShareEvent}
      >
        <Entypo
          name="share-alternative"
          size={20}
          color={disabled ? "grey" : "white"}
        />
        <Text className="text-sm text-white">Share</Text>
      </TouchableOpacity>
    </View>
  );
};
