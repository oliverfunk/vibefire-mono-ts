import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";
import { isCoordZeroZero } from "@vibefire/utils";

import { AccessShareabilityText } from "!/components/AccessShareablityText";
import { TextB, TextL, TextLL } from "!/components/atomic/text";
import { BContC, ContR, DivLineH } from "!/components/atomic/view";
import { PillTouchableOpacity } from "!/components/button/PillTouchableOpacity";
import { LinearRedOrangeContainer } from "!/components/layouts/SheetScrollViewGradientVF";

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
    <LinearRedOrangeContainer>
      <BContC className="items-start">
        <TextLL className="w-full text-center">Edit your event</TextLL>

        <DivLineH />

        <AccessShareabilityText accessRef={event.accessRef} />

        {isGroupOwned && (
          <TextB>
            This is the same as the group that organises this event. To change
            it, you need to change the setting for the group.
          </TextB>
        )}
        <ContR className="w-full">
          {!isGroupOwned && !isPublic && (
            <PillTouchableOpacity
              className="flex-1"
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
                <TextB className="text-center">
                  <FontAwesome6 name="gear" size={15} /> Make{" "}
                  <Text className="text-green-400">
                    {isOpen ? "invite only" : "open"}
                  </Text>
                </TextB>
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
              <TextB className="text-center">
                <FontAwesome6 name="trash" size={15} /> Delete
              </TextB>
            )}
          </PillTouchableOpacity>
        </ContR>
      </BContC>

      <BContC className="items-start">
        {/* Readiness/published text */}
        <View className="w-full flex-col">
          {/* Readiness text */}
          <TextB className="font-bold">
            {isPublished
              ? "Your event is published 🔥"
              : isReady
                ? isFormUpdated
                  ? "Update your event before you publish it."
                  : "Your event is hidden, publish it to put it on the map!"
                : "Your event still needs the following:"}
          </TextB>
          <View className="h-2" />
          {!isReady && (
            <>
              {!hasBanner && <TextB> - An image</TextB>}
              {!hasStart && <TextB> - A starting time</TextB>}
              {!(hasLocation || hasLocationDesc) && (
                <TextB> - A location and address description</TextB>
              )}
              <View className="h-2" />
              <TextB className="text-center font-bold">
                <FontAwesome6 name="arrow-down" size={15} /> (scroll down)
              </TextB>
              <View className="h-4" />
              <TextB>
                {
                  "Come back here and tap this button when you're ready to publish!"
                }
              </TextB>
            </>
          )}
        </View>
        {/* Publish, hide, view buttons */}
        <ContR className="justify-evenly">
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
              <TextB className="text-center">
                <FontAwesome6 name="eye-slash" size={15} /> Hide
              </TextB>
            ) : (
              <TextB
                className="text-center"
                disabled={!isReady || isFormUpdated}
              >
                <FontAwesome6 name="eye" size={15} /> Publish
              </TextB>
            )}
          </PillTouchableOpacity>
          {isPublished && (
            <PillTouchableOpacity
              onPress={onPreviewPress}
              className="flex-1 border-blue-500"
            >
              <TextB className="text-center">
                <FontAwesome6 name="arrow-right" size={15} /> View
              </TextB>
            </PillTouchableOpacity>
          )}
        </ContR>
      </BContC>
    </LinearRedOrangeContainer>
  );
};
