import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";
import { isCoordZeroZero } from "@vibefire/utils";

import { AccessShareabilityText } from "!/components/AccessShareablityText";

export type TEventManageHandles = {
  onMakeOpenPress: () => void;
  onMakeInviteOnlyPress: () => void;
  onPreviewPress: () => void;
  onPublishPress: () => void;
  onHidePress: () => void;
  updateAccessLoading: boolean;
  updateVisibilityLoading: boolean;
  isFormUpdated: boolean;
};

export const EditInfoDisplay = (
  props: {
    event: TModelVibefireEvent;
  } & TEventManageHandles,
) => {
  const {
    event,
    onMakeOpenPress,
    onMakeInviteOnlyPress,
    onPreviewPress,
    onPublishPress,
    onHidePress,
    updateAccessLoading,
    updateVisibilityLoading,
    isFormUpdated,
  } = props;

  // owner
  const isGroupOwned = event.ownerRef.ownerType === "group";

  // access
  const isPublic = event.accessRef.type == "public";
  const isOpen = event.accessRef.type == "open";

  // needs checks
  const hasBanner = event.images.bannerImgKeys.length > 0;
  const hasStart = !!event.times.ntzStart;
  const hasLocation =
    !!event.location.position && !isCoordZeroZero(event.location.position);
  const hasLocationDesc = !!event.location.addressDescription;
  const isReady = hasBanner && hasStart && hasLocation && hasLocationDesc;

  // published
  const isPublished = event.state === 1;

  return (
    <View className="flex-col space-y-4 bg-black p-4">
      <View className="flex-col space-y-2">
        <Text className="text-2xl font-bold text-white">Edit your event</Text>
        <Text className="text-base text-white">
          Add details and more info to your event.{"\n"}
          <FontAwesome6 name="edit" size={15} color="white" /> shows values you
          can edit by tapping on them.
        </Text>
      </View>

      <View className="h-[1] w-full bg-white" />

      <View className="flex-col space-y-2">
        <AccessShareabilityText accessRef={event.accessRef} />
        {isGroupOwned && (
          <Text className="text-base text-white">
            This is the same as the group that organises this event. To change
            it, you need to change the setting for the group.
          </Text>
        )}
        {!isGroupOwned && !isPublic && (
          <TouchableOpacity
            disabled={updateAccessLoading || updateVisibilityLoading}
            className="self-center rounded-full border-2 border-white p-2 px-4"
            onPress={() => {
              if (isOpen) {
                onMakeInviteOnlyPress();
              } else {
                onMakeOpenPress();
              }
            }}
          >
            {updateAccessLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-base text-white">
                <FontAwesome6 name="gear" size={15} /> Make{" "}
                {isOpen ? "invite only" : "open"}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <View className="h-[1] w-full bg-white" />

      <View className="flex-col space-y-2">
        {/* Readiness/published text */}
        <View className="flex-col">
          {/* Readiness text */}
          <Text className="text-base text-white">
            {isPublished
              ? "Your event is published 🔥"
              : isReady
                ? isFormUpdated
                  ? "Update your event before you publish it."
                  : "Your event is hidden, publish it to put it on the map!"
                : "Your event still needs:"}
          </Text>
          {!isReady && (
            <>
              {!hasBanner && (
                <Text className="text-base text-white"> - A banner image</Text>
              )}
              {!hasStart && (
                <Text className="text-base text-white"> - A starting time</Text>
              )}
              {!hasLocation && (
                <Text className="text-base text-white"> - A location</Text>
              )}
              {!hasLocationDesc && (
                <Text className="text-base text-white">
                  {" "}
                  - A location description
                </Text>
              )}
            </>
          )}
        </View>
        {/* Publish, preview buttons */}
        <View className="flex-row justify-evenly space-x-4">
          <TouchableOpacity
            disabled={
              !isReady ||
              isFormUpdated ||
              updateAccessLoading ||
              updateVisibilityLoading
            }
            onPress={() => {
              if (isPublished) {
                onHidePress();
              } else {
                onPublishPress();
              }
            }}
            className={`flex-1 rounded-full border-2 ${isPublished ? "border-red-500" : isReady && !isFormUpdated ? "border-green-500" : "border-neutral-600"} p-2 px-4`}
          >
            {updateVisibilityLoading ? (
              <ActivityIndicator color="white" />
            ) : isPublished ? (
              <Text className={`text-center text-base text-white`}>
                <FontAwesome6 name="eye-slash" size={15} /> Hide
              </Text>
            ) : (
              <Text
                className={`text-center text-base ${isReady && !isFormUpdated ? "text-white" : "text-neutral-600"}`}
              >
                <FontAwesome6 name="eye" size={15} /> Publish
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPreviewPress}
            className="flex-1 rounded-full border-2 border-blue-500 p-2 px-4"
          >
            <Text className="text-center text-base text-white">
              <FontAwesome5 name="arrow-right" size={15} /> Preview event
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
