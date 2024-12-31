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
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

import {
  type TModelVibefireAccess,
  type TModelVibefireEvent,
  type TModelVibefireMembership,
} from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import {
  appleMapsOpenEventLocationURL,
  googleMapsOpenEventLocationURL,
  uberClientRequestToEventLocationURL,
} from "!utils/urls";

const MapsModalMenu = (props: {
  location?: TModelVibefireEvent["location"];
  disabled: boolean;
}) => {
  const { location, disabled } = props;

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
              {"Open the event's location in another app"}
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
        <Text className={`${disabled ? "text-neutral-600" : "text-white"}`}>
          Maps
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const EventActionsBar = (
  props: {
    location?: PartialDeep<TModelVibefireEvent["location"]>;
    onShareEvent?: () => void;
    disabled?: boolean;
    hideShareButton?: boolean;
  } & ViewProps,
) => {
  const {
    onShareEvent,
    location,
    disabled = false,
    hideShareButton = false,
  } = props;

  const onGetToEvent = useCallback(async () => {
    if (!location) {
      return;
    }
    const uberClientID = process.env.EXPO_PUBLIC_UBER_CLIENT_ID!;
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
      <MapsModalMenu
        location={location as TModelVibefireEvent["location"]}
        disabled={disabled}
      />

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
        <Text className={`${disabled ? "text-neutral-600" : "text-white"}`}>
          Get there
        </Text>
      </TouchableOpacity>

      {!hideShareButton && (
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
          <Text className={`${disabled ? "text-neutral-600" : "text-white"}`}>
            Share
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
