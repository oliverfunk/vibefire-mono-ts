import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";
import { isCoordZeroZero } from "@vibefire/utils";

import { AccessShareabilityText } from "!/components/AccessShareablityText";
import { TextB, TextL, TextLL } from "!/components/atomic/text";
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
    <View className="flex-col space-y-4 p-4">
      <TextLL className="text-center">Edit your event</TextLL>

      <AccessShareabilityText accessRef={event.accessRef} />

      {isGroupOwned && (
        <TextB>
          This is the same as the group that organises this event. To change it,
          you need to change the setting for the group.
        </TextB>
      )}
      <View className="flex-row justify-center space-x-4">
        {!isGroupOwned && !isPublic && (
          <PillTouchableOpacity
            disabled={updateAccessLoading || updateVisibilityLoading}
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
        <PillTouchableOpacity
          disabled={updateAccessLoading || updateVisibilityLoading}
          onPress={onDeletePress}
          className="border-[#ff0000]"
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

      <DivLineH />

      {/* Readiness/published text */}
      <View className="flex-col space-y-2">
        {/* Readiness text */}
        <TextB className="font-bold">
          {isPublished
            ? "Your event is published 🔥"
            : isReady
              ? isFormUpdated
                ? "Update your event before you publish it."
                : "Your event is hidden, publish it to put it on the map!"
              : "To publish your event, provide the following:"}
        </TextB>
        {!isReady && (
          <>
            {!hasBanner && <TextB> - An image</TextB>}
            {!hasStart && <TextB> - A starting time</TextB>}
            {!(hasLocation || hasLocationDesc) && (
              <TextB> - A location and address description</TextB>
            )}
            <TextB className="self-center pt-4 font-bold">
              <FontAwesome6 name="arrow-down" size={15} /> (scroll down)
            </TextB>
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
        {isPublished && (
          <PillTouchableOpacity
            onPress={onPreviewPress}
            className="flex-1 border-blue-500"
          >
            <Text className="text-center text-base text-white">
              <FontAwesome6 name="arrow-right" size={15} /> View
            </Text>
          </PillTouchableOpacity>
        )}
      </View>
    </View>
  );
};
