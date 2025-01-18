import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";
import { isCoordZeroZero } from "@vibefire/utils";

import { AccessShareabilityText } from "!/components/AccessShareablityText";
import { TextB, TextLL } from "!/components/atomic/text";
import { DivLineH } from "!/components/atomic/view";
import { PillTouchableOpacity } from "!/components/button/PillTouchableOpacity";

export type TEventManageHandles = {
  onMakeOpenPress: () => void;
  onMakeInviteOnlyPress: () => void;
  onPreviewPress: () => void;
  onPublishPress: () => void;
  onHidePress: () => void;
  onDeletePress: () => void;
  updateAccessLoading: boolean;
  updateVisibilityLoading: boolean;
  deleteLoading: boolean;
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
    onDeletePress,
    updateAccessLoading,
    updateVisibilityLoading,
    deleteLoading,
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
        <TextLL>Edit your event</TextLL>

        <TextB>Add details and more info to your event.</TextB>
        <TextB>
          <FontAwesome6 name="edit" size={15} color="white" /> shows values you
          can edit by tapping on them.
        </TextB>
      </View>

      <DivLineH />

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
          <PillTouchableOpacity
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
            className={`flex-1 ${isPublished ? "border-red-500" : isReady && !isFormUpdated ? "border-green-500" : "border-neutral-600"}`}
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
          </PillTouchableOpacity>
          <PillTouchableOpacity
            onPress={onPreviewPress}
            className="border-blue-500"
          >
            <Text className="text-center text-base text-white">
              <FontAwesome6 name="arrow-right" size={15} /> Preview event
            </Text>
          </PillTouchableOpacity>
        </View>
      </View>

      <DivLineH />

      <View className="flex-col space-y-2">
        <AccessShareabilityText accessRef={event.accessRef} />
        {isGroupOwned && (
          <Text className="text-base text-white">
            This is the same as the group that organises this event. To change
            it, you need to change the setting for the group.
          </Text>
        )}
        {!isGroupOwned && !isPublic && (
          <PillTouchableOpacity
            disabled={updateAccessLoading || updateVisibilityLoading}
            className="self-center"
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
          </PillTouchableOpacity>
        )}
      </View>

      <DivLineH />

      <View className="flex-col space-y-2">
        <Text className="text-base text-white">Delete this event.</Text>
        <PillTouchableOpacity
          disabled={updateAccessLoading || updateVisibilityLoading}
          onPress={onDeletePress}
          className="self-center border-[#ff0000]"
        >
          {deleteLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-base text-white">
              <FontAwesome6 name="trash" size={15} /> Delete
            </Text>
          )}
        </PillTouchableOpacity>
      </View>
    </View>
  );
};
