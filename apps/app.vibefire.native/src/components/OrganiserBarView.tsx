import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import {
  type TModelVibefireMembership,
  type TModelVibefireOwnership,
} from "@vibefire/models";

import { TextB, TextL } from "./atomic/text";

const ThreeDotsMenuOption = (props: {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) => {
  const { label, icon, onPress } = props;
  return (
    <TouchableOpacity
      className="flex-row items-center justify-stretch space-x-2 p-2"
      onPress={onPress}
    >
      {icon}
      <Text className="flex-auto text-base">{label}</Text>
      {/* <View className="" /> */}
    </TouchableOpacity>
  );
};

type ThreeDotsModalMenuProps = {
  membership?: TModelVibefireMembership;
  threeDotsDisabled?: boolean;
  onEditPress?: () => void;
  onHidePress?: () => void;
  onBlockAndReportOrganiserPress?: () => void;
};

const ThreeDotsModalMenu = (props: ThreeDotsModalMenuProps) => {
  const {
    membership,
    threeDotsDisabled = false,
    onEditPress,
    onHidePress,
    onBlockAndReportOrganiserPress,
  } = props;

  const DropdownButtonRef = useRef<View>(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownRight, setDropdownRight] = useState(0);

  const openDropdown = (): void => {
    DropdownButtonRef.current!.measure((_fx, _fy, w, h, px, py) => {
      setDropdownTop(py + h);
      setDropdownRight(w);
    });
    setMenuVisible(true);
  };

  const managedByUser =
    membership?.roleType === "manager" || membership?.roleType === "owner";

  return (
    <Pressable
      ref={DropdownButtonRef}
      disabled={threeDotsDisabled}
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
            {managedByUser ? (
              <ThreeDotsMenuOption
                label="Edit"
                icon={
                  <MaterialIcons
                    name="app-registration"
                    color="black"
                    size={24}
                  />
                }
                onPress={() => {
                  setMenuVisible(false);
                  onEditPress?.();
                }}
              />
            ) : (
              <>
                <ThreeDotsMenuOption
                  label="Hide"
                  icon={
                    <MaterialCommunityIcons
                      name="eye-off"
                      color="red"
                      size={24}
                    />
                  }
                  onPress={() => {
                    setMenuVisible(false);
                    onHidePress?.();
                  }}
                />
                <View className="h-px bg-gray-200" />
                <ThreeDotsMenuOption
                  label="Block & report organiser"
                  icon={
                    <MaterialCommunityIcons
                      name="block-helper"
                      color="red"
                      size={24}
                    />
                  }
                  onPress={() => {
                    setMenuVisible(false);
                    onBlockAndReportOrganiserPress?.();
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
        color={threeDotsDisabled ? "grey" : "white"}
      />
    </Pressable>
  );
};

type LeaveJoinButtonProps = {
  membership?: TModelVibefireMembership;
  onJoinPress?: () => void;
  onLeavePress?: () => void;
  leaveJoinDisabled?: boolean;
  leaveJoinLoading?: boolean;
};
const LeaveJoinButton = (props: LeaveJoinButtonProps) => {
  const {
    membership,
    onJoinPress,
    onLeavePress,
    leaveJoinDisabled = false,
    leaveJoinLoading = false,
  } = props;

  const isMember = !!membership;
  const isDisabled =
    leaveJoinDisabled || (isMember && membership?.roleType === "owner");

  return (
    <Pressable
      className={`rounded-full border ${isDisabled ? "border-neutral-600" : isMember ? "border-white" : "border-red-500"} p-2 px-4`}
      onPress={isMember ? onLeavePress : onJoinPress}
      disabled={isDisabled}
    >
      {leaveJoinLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text
          className={`text-sm font-bold  ${isDisabled ? "text-neutral-600" : "text-white"}`}
        >
          {isMember ? "Leave" : "Join"}
        </Text>
      )}
    </Pressable>
  );
};

export const OrganiserBarView = (
  props: {
    ownerRef: TModelVibefireOwnership;
    showLeaveJoin?: boolean;
    showThreeDots?: boolean;
    onOrganiserPress?: () => void;
  } & ThreeDotsModalMenuProps &
    LeaveJoinButtonProps &
    ViewProps,
) => {
  const {
    ownerRef,
    showLeaveJoin = true,
    showThreeDots = true,
    onOrganiserPress,
  } = props;

  return (
    <View className="flex-row items-center space-x-2" {...props}>
      <Pressable onPress={onOrganiserPress}>
        <View className="h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-white bg-black">
          <Text className="text-lg text-white">
            {ownerRef.ownerName.at(0)!.toUpperCase()}
          </Text>
        </View>
      </Pressable>

      <Pressable
        className="flex-1 flex-col justify-center"
        onPress={onOrganiserPress}
      >
        <Text className="text-xs text-white">Organised by</Text>
        <TextL numberOfLines={1} ellipsizeMode="tail" className="font-bold">
          {ownerRef.ownerName}
        </TextL>
      </Pressable>

      {showLeaveJoin && (
        <View>
          <LeaveJoinButton {...props} />
        </View>
      )}

      {showThreeDots && <ThreeDotsModalMenu {...props} />}
    </View>
  );
};
