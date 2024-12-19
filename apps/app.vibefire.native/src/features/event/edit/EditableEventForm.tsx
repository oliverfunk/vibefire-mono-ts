import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { type FormikProps } from "formik";

import { type TModelVibefireEvent } from "@vibefire/models";
import { isCoordZeroZero } from "@vibefire/utils";

import { EventActionsBar } from "!/components/event/EventActionBar";
import { EventInfoAddressBarEditable } from "!/components/event/EventInfoBars";
import { EventOrganiserBarView } from "!/components/event/EventOrganiserBar";
import { ImageCarousel } from "!/components/image/ImageCarousel";
import { UploadableVibefireImage } from "!/components/image/UploadableVibefireImage";
import { LocationSelectionMap } from "!/components/map/LocationSelectionMap";
import { LinearRedOrangeView } from "!/c/misc/sheet-utils";

import { AddEventDetailWidgetButton } from "./_common/AddEventDetailWidgetButton";
import { EditableEventDetailWidget } from "./_common/EditableEventDetailWidget";
import { EditableIconWrapper } from "./_common/EditableIconWrapper";
import { SelectEventTimesButton } from "./_common/SelectEventTimesButton";

type TEventManageHandles = {
  onMakeOpenPress: () => void;
  onMakeInviteOnlyPress: () => void;
  onPreviewPress: () => void;
  onPublishPress: () => void;
  onHidePress: () => void;
  updateAccessLoading: boolean;
  updateVisibilityLoading: boolean;
  isFormUpdated: boolean;
};

const EditInfoDisplay = (
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
    <View className="flex-col space-y-4 rounded-lg bg-black p-4">
      <Text className="text-2xl font-bold text-white">Edit your event</Text>
      <Text className="text-base text-white">
        Add details and more info to your event.{"\n"}
        <FontAwesome6 name="edit" size={15} color="white" /> shows values you
        can edit by tapping on them.
      </Text>

      <View className="h-[1] w-full bg-white" />

      <View className="flex-col space-y-2">
        <Text className="text-base text-white">
          This event is{" "}
          <Text className="text-green-400">
            {isPublic ? "public" : "private"}
          </Text>
          {!isPublic && " and "}
          {!isPublic && (
            <Text className="text-green-400">
              {isOpen ? "open" : "invite only"}
            </Text>
          )}
          {".\n"}
          {isPublic
            ? "Anyone can share, and invite others to join."
            : isOpen
              ? "Anyone that has joined can share, and invite others to join."
              : "Only managers can share, and invite others to join."}
        </Text>
        {isGroupOwned && (
          <Text className="text-base text-white">
            This is the same as the group that organises this event. To change
            it you need to change the setting for the group.
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

export const EditableEventForm = (
  props: {
    formik: FormikProps<TModelVibefireEvent>;
  } & TEventManageHandles,
) => {
  const { formik } = props;
  const { values: event, handleBlur, handleChange, setFieldValue } = formik;

  const { width } = useWindowDimensions();

  const bannerImgKeys = useMemo(() => {
    const keys = event.images.bannerImgKeys || [""];
    return keys.length < 5 ? [...keys, ""] : keys;
  }, [event.images.bannerImgKeys]);

  const details = useMemo(() => {
    return event.details;
  }, [event.details]);

  return (
    <>
      {/* header */}
      <View className="relative">
        <ImageCarousel
          width={width}
          imgIdKeys={bannerImgKeys}
          renderItem={({ index, item }) => {
            return (
              <UploadableVibefireImage
                eventId={event.id}
                imgIdKey={item}
                alt={`Banner image ${index}`}
                onClosePress={async () => {
                  const newKeys = [...bannerImgKeys];
                  newKeys.splice(index, 1);
                  await setFieldValue("images.bannerImgKeys", newKeys);
                }}
                onImageUploaded={async (imgKeyId: string) => {
                  const newKeys = [...bannerImgKeys];
                  newKeys[index] = imgKeyId;
                  await setFieldValue("images.bannerImgKeys", newKeys);
                }}
              />
            );
          }}
        />

        <LinearGradient
          className="absolute bottom-0 w-full px-4 pt-2"
          colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 0.8)"]}
          locations={[0, 1]}
        >
          <EditableIconWrapper center>
            <TextInput
              className="py-2 text-center text-2xl text-white"
              multiline={false}
              placeholderTextColor={"#909090FF"}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={event["name"]}
            />
          </EditableIconWrapper>
        </LinearGradient>
      </View>

      {/* black bars */}
      <EventOrganiserBarView event={event} disabled={true} />
      <EventActionsBar event={event} disabled={true} />

      <EditInfoDisplay event={event} {...props} />

      {/* infos */}
      <LinearRedOrangeView className="flex-col p-0.5">
        <View className="flex-col space-y-4 rounded-md bg-neutral-900 p-3.5">
          <View>
            <EditableIconWrapper>
              <SelectEventTimesButton
                event={event}
                onSetStart={async (d) => {
                  await setFieldValue("times.ntzStart", d.toISOString());
                }}
                onSetEnd={async (d) => {
                  await setFieldValue(
                    "times.ntzEnd",
                    d ? d.toISOString() : null,
                  );
                }}
              />
            </EditableIconWrapper>
          </View>
          <View>
            <EditableIconWrapper>
              <EventInfoAddressBarEditable
                className="text-white"
                multiline={true}
                numberOfLines={2}
                placeholderTextColor={"#909090FF"}
                placeholder="(Set a location description)"
                onChangeText={handleChange("location.addressDescription")}
                onBlur={handleBlur("location.addressDescription")}
                value={event.location.addressDescription}
              />
            </EditableIconWrapper>
          </View>
        </View>
      </LinearRedOrangeView>

      {/* map */}
      <View>
        <Text className="p-2 text-center text-white">
          (Tap the map to set a location)
        </Text>
        <View className="aspect-[4/4]">
          <LocationSelectionMap
            initialPosition={event.location?.position}
            onPositionSelected={async (position) => {
              await setFieldValue("location.position", position);
            }}
            onAddressDescription={async (addressDescription) => {
              await setFieldValue(
                "location.addressDescription",
                addressDescription,
              );
            }}
          />
        </View>
      </View>

      {/*
      todo: abstarct call backs up to parent
      check for empty strings in desc's
      */}

      {/* details */}
      <View className="flex-col space-y-4 p-4">
        {details.map((detail, index) => (
          <View key={index}>
            <EditableEventDetailWidget
              formik={formik}
              n={index}
              nDetails={details.length}
              detail={detail}
              detailsPath={`details`}
            />
          </View>
        ))}
        <View>
          <AddEventDetailWidgetButton
            onAdd={async (detail) => {
              await formik.setFieldValue("details", [...details, detail]);
            }}
          />
        </View>
      </View>
    </>
  );
};
