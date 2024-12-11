import React, { useCallback, useMemo, useRef, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useAtom } from "jotai";

import { type TModelVibefireEvent } from "@vibefire/models";

import { trpc } from "!/api/trpc-client";

import { userInfoAtom } from "!/atoms";
import { StandardImage } from "!/c/image/StandardImage";
import { navHome, navManageEvent } from "!/nav";
import { organisationProfileImagePath } from "!utils/image-path";

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

const ThreeDotsModalMenu = (props: {
  event: TModelVibefireEvent;
  disabled: boolean;
}) => {
  const { event, disabled } = props;

  const router = useRouter();

  const [userInfo] = useAtom(userInfoAtom);

  const [menuVisible, setMenuVisible] = useState(false);
  const DropdownButton = useRef<View>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownRight, setDropdownRight] = useState(0);

  const openDropdown = (): void => {
    DropdownButton.current!.measure((_fx, _fy, w, h, px, py) => {
      setDropdownTop(py + h);
      setDropdownRight(w);
    });
    setMenuVisible(true);
  };

  const eventOrganisedByUser = useMemo(() => {
    return userInfo?.ownershipRef.id === event.ownerRef.id;
  }, [userInfo?.ownershipRef.id, event.ownerRef.id]);

  const hideEventMut = trpc.user.hideEvent.useMutation();
  const blockOrganiserMut = trpc.user.blockOrganiser.useMutation();

  return (
    <Pressable
      ref={DropdownButton}
      disabled={disabled}
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
                  navManageEvent(router, event.id);
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
                    navHome(router);
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
                    navHome(router);
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
                      eventid: event.id,
                    });
                    navHome(router);
                  }}
                />
              </>
            )}
          </View>
        </Pressable>
      </Modal>
      <MaterialCommunityIcons
        name="dots-vertical"
        size={30}
        color={disabled ? "grey" : "white"}
      />
    </Pressable>
  );
};

export const EventOrganiserBarView = (props: {
  event: TModelVibefireEvent;
  onPress?: () => void;
  disabled?: boolean;
}) => {
  const { event, onPress, disabled = false } = props;

  const onOrganiserPress = useCallback(() => {
    if (disabled) return;
    onPress?.();
  }, [disabled, onPress]);

  return (
    <View className="flex-row items-center justify-center space-x-4 bg-black px-4 py-4">
      <Pressable onPress={onOrganiserPress}>
        <View className="h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-white bg-black">
          <Text className="text-lg text-white">
            {event.ownerRef.ownerName.at(0)!.toUpperCase()}
          </Text>
        </View>
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
          {event.ownerRef.ownerName}
        </Text>
      </Pressable>
      <ThreeDotsModalMenu event={event} disabled={disabled} />
    </View>
  );
};
