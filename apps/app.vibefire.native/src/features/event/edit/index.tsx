import React, { forwardRef, useMemo, useRef, type ReactNode } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { type BottomSheetScrollViewMethods } from "@gorhom/bottom-sheet";
import Clipboard from "@react-native-clipboard/clipboard";
import { Formik, type FormikProps } from "formik";

import { CoordT, type TModelVibefireEvent } from "@vibefire/models";

import { trpc } from "!/api/trpc-client";

import { EventActionsBar } from "!/components/event/EventActionBar";
import { EventOrganiserBarView } from "!/components/event/EventOrganiserBar";
import { ImageCarousel } from "!/components/image/ImageCarousel";
import { UploadableVibefireImage } from "!/components/image/UploadableVibefireImage";
import { LocationSelectionMap } from "!/components/map/LocationSelectionMap";
import {
  LinearRedOrangeView,
  ScrollViewSheetWithRef,
} from "!/c/misc/sheet-utils";
import { withSuspenseErrorBoundarySheet } from "!/c/misc/SuspenseWithError";
import { navManageEvent, navViewEventPreview } from "!/nav";

import { AddEventDetailWidgetButton } from "./AddEventDetailWidgetButton";
import { EditableEventDetailWidget } from "./EditableEventDetailWidget";
import { EditableIconWrapper } from "./EditableIconWrapper";

const EditInfoDisplay = (props: {
  onPreviewPress: () => void;
  onManagePress: () => void;
}) => {
  const { onPreviewPress, onManagePress } = props;
  return (
    <LinearRedOrangeView className="p-1">
      <View className="flex-col space-y-4 rounded-lg bg-neutral-900 p-3">
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
    </LinearRedOrangeView>
  );
};

const EditableEventForm = (props: {
  formik: FormikProps<TModelVibefireEvent>;
  onPreviewEventPress: () => void;
  onManageEventPress: () => void;
}) => {
  const { formik, onPreviewEventPress, onManageEventPress } = props;
  const { values: event, handleBlur, handleChange, setFieldValue } = formik;

  const width = Dimensions.get("window").width;

  const bannerImgKeys = useMemo(() => {
    const keys = event.images.bannerImgKeys || [""];
    return keys.length < 5 ? [...keys, ""] : keys;
  }, [event.images.bannerImgKeys]);

  const details = useMemo(() => {
    return event.event.details;
  }, [event.event.details]);

  return (
    <>
      {/* Header */}
      <View className="relative">
        {/* Background image */}
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

      {/* bars */}
      <EventOrganiserBarView event={event} disabled={true} />
      <EventActionsBar event={event} disabled={true} />
      {/* Add info bars */}

      <EditInfoDisplay
        onManagePress={onManageEventPress}
        onPreviewPress={onPreviewEventPress}
      />

      {/* Main */}
      <View className="flex-col space-y-4 p-2">
        {details.map((detail, index) => (
          <View key={index}>
            <EditableEventDetailWidget
              index={index}
              formik={formik}
              detail={detail}
              detailPath={`event.details[${index}]`}
            />
          </View>
        ))}
        <View className="p-2">
          <AddEventDetailWidgetButton
            onAdd={async (detail) => {
              await formik.setFieldValue("event.details", [...details, detail]);
            }}
          />
        </View>
      </View>

      {/* Map */}
      <View>
        <Text className="p-2 text-2xl font-bold text-white">Location</Text>
        <View className="p-2">
          <EditableIconWrapper>
            <TextInput
              className="p-2 text-white"
              multiline={false}
              placeholderTextColor={"#909090FF"}
              placeholder="Location name"
              onChangeText={handleChange("location.addressDescription")}
              onBlur={handleBlur("location.addressDescription")}
              value={event.location.addressDescription}
            />
          </EditableIconWrapper>
        </View>

        <View className="aspect-[4/4] border-2 border-slate-200">
          <LocationSelectionMap
            initialPosition={event.location?.position ?? undefined}
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

        <Text className="p-2 text-center text-white">
          (Tap the map to select a location)
        </Text>
      </View>
    </>
  );
};

export const EditEventWysiwygSheet = withSuspenseErrorBoundarySheet(
  (props: { eventId: string }) => {
    const { eventId } = props;

    const router = useRouter();

    const [viewManage, viewManageCntlr] =
      trpc.events.viewManage.useSuspenseQuery(
        {
          eventId,
        },
        {
          gcTime: 1000,
        },
      );
    const updateMut = trpc.events.update.useMutation();

    const formRef = useRef<BottomSheetScrollViewMethods>(null);

    if (!viewManage.ok) {
      throw viewManage.error;
    }

    console.log("viewManage", JSON.stringify(viewManage.value, null, 2));

    return (
      <Formik
        initialValues={viewManage.value}
        onSubmit={async (values) => {
          // console.log(JSON.stringify(values, null, 2));
          // return; // todo remove
          try {
            const res = await updateMut.mutateAsync({
              eventId,
              update: {
                name: values.name,
                event: values.event,
                images: values.images,
                location: values.location,
                times: values.times,
              },
            });
            if (!res.ok) {
              Toast.show({
                type: "error",
                text1: res.error.message,
                position: "bottom",
                bottomOffset: 50,
                visibilityTime: 4000,
              });
            }
          } catch (error: unknown) {
            Toast.show({
              type: "error",
              text1: "We could not update your event, something went wrong",
              position: "bottom",
              bottomOffset: 50,
              visibilityTime: 4000,
            });
          } finally {
            setTimeout(() => {
              updateMut.reset();
            }, 3000);
            await viewManageCntlr.refetch();
          }
        }}
      >
        {(formik) => (
          <>
            <ScrollViewSheetWithRef ref={formRef}>
              <EditableEventForm
                formik={formik}
                onManageEventPress={() => {
                  navManageEvent(router, formik.values.id);
                }}
                onPreviewEventPress={() => {
                  navViewEventPreview(router, formik.values.id);
                }}
              />

              {/* For the form btns */}
              <View className="h-20" />
            </ScrollViewSheetWithRef>

            <View className="absolute bottom-0 h-20 w-full flex-row items-center justify-evenly bg-black/90">
              <TouchableOpacity
                disabled={!formik.dirty || formik.isSubmitting}
                className={`rounded-full border-2 ${formik.dirty ? "border-orange-500" : "border-gray-700"} p-2 px-4`}
                onPress={() => formik.resetForm()}
              >
                {formik.isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    className={`${formik.dirty ? "text-white" : "text-gray-600"} text-lg`}
                  >
                    <FontAwesome5 name="redo" size={15} /> Reset
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!formik.dirty || formik.isSubmitting}
                className={`rounded-full border-2 ${formik.dirty ? "border-green-500" : "border-gray-700"} p-2 px-4`}
                onPress={() => formik.handleSubmit()}
              >
                {formik.isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    className={`${formik.dirty ? "text-white" : "text-gray-600"} text-lg`}
                  >
                    <FontAwesome6 name="file-arrow-up" size={20} /> Update
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    );
  },
);
