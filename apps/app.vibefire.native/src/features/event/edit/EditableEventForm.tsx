import React, { useMemo } from "react";
import {
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

const EditInfoDisplay = (props: {
  onPreviewPress: () => void;
  onManagePress: () => void;
}) => {
  const { onPreviewPress, onManagePress } = props;
  return (
    <View className="flex-col space-y-4 rounded-lg bg-black p-4">
      <Text className="text-2xl font-bold text-white">Edit your event</Text>
      <Text className="text-base text-white">
        Add details, widgets and info to your event.{"\n"}Tap on values with{" "}
        <FontAwesome6 name="edit" size={12} color="white" /> to edit them.
      </Text>

      <View className="flex-row justify-evenly space-x-2">
        <TouchableOpacity
          onPress={onManagePress}
          className="rounded-full border-2 border-red-500 p-2 px-4"
        >
          <Text className="text-center text-lg text-white">
            <FontAwesome6 name="gear" size={15} /> Manage event
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPreviewPress}
          className="rounded-full border-2 border-blue-500 p-2 px-4"
        >
          <Text className="text-center text-lg text-white">
            <FontAwesome5 name="eye" size={15} /> Preview event
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const EditableEventForm = (props: {
  formik: FormikProps<TModelVibefireEvent>;
  onPreviewEventPress: () => void;
  onManageEventPress: () => void;
}) => {
  const { formik, onPreviewEventPress, onManageEventPress } = props;
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

      <EditInfoDisplay
        onManagePress={onManageEventPress}
        onPreviewPress={onPreviewEventPress}
      />

      {/* infos */}
      <LinearRedOrangeView className="flex-col p-0.5">
        <View className="flex-col space-y-4 rounded-md bg-neutral-900 p-3.5">
          <View>
            <EditableIconWrapper>
              <SelectEventTimesButton
                event={event}
                onSetStart={async (d) => {
                  await setFieldValue("times.tsStart", d.toISOString());
                }}
                onSetEnd={async (d) => {
                  await setFieldValue(
                    "times.tsEnd",
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
                placeholder="(Set an location description)"
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
