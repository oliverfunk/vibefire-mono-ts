import { forwardRef, useMemo, useRef, type ReactNode } from "react";
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
import { FontAwesome6 } from "@expo/vector-icons";
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

import { AddEventDetailWidgetButton } from "./AddEventDetailWidgetButton";
import { EditableEventDetailWidget } from "./EditableEventDetailWidget";

const EditableIconWrapper = (props: { children: ReactNode }) => {
  return (
    <View className="flex-row items-center justify-center">
      <FontAwesome6 name="edit" size={15} color="white" />
      {props.children}
    </View>
  );
};

const EditableEventForm = (
  props: {
    formik: FormikProps<TModelVibefireEvent>;
  },
  ref: React.Ref<BottomSheetScrollViewMethods>,
) => {
  const { formik } = props;
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
    // Header
    <>
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
          className="absolute bottom-0 w-full pt-2"
          colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 0.8)"]}
          locations={[0, 1]}
        >
          <EditableIconWrapper>
            <TextInput
              className="p-2 text-2xl text-white"
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

      <LinearRedOrangeView className="flex-col space-y-2 p-2">
        <View className="rounded-lg bg-neutral-900 p-4">
          <Text className="text-lg text-white">
            <FontAwesome6 name="edit" size={15} color="white" /> shows editable
            text, tap to change its value.
          </Text>
        </View>
      </LinearRedOrangeView>

      {/* Main */}
      <View className="flex-col space-y-2 p-2">
        {details.map((detail, index) => (
          <View key={index} className="rounded-lg bg-neutral-900 p-3">
            <EditableEventDetailWidget
              index={index}
              formik={formik}
              detail={detail}
              detailPath={`event.details[${index}]`}
            />
          </View>
        ))}
        <View className="items-center justify-center p-4">
          <AddEventDetailWidgetButton
            onAdd={async (detail) => {
              await formik.setFieldValue("event.details", [...details, detail]);
              // wait for the form to update
              setTimeout(() => {
                // todo: fixme dono why this is needed
                if (ref && "current" in ref && ref.current) {
                  ref.current.scrollToEnd();
                }
              }, 100);
            }}
          />
        </View>
      </View>

      {/* Map */}
      <View>
        <Text className="p-2 text-2xl font-bold text-white">Location</Text>
        <View className="flex-row items-center p-2">
          <FontAwesome6 name="map-pin" size={20} color="white" />
          <View className="pl-2" />
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
      </View>
    </>
  );
};

const EditableEventFormWithRef = forwardRef(EditableEventForm);

export const EditEventWysiwyg = withSuspenseErrorBoundarySheet(
  (props: { eventId: string }) => {
    const { eventId } = props;

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
              <EditableEventFormWithRef ref={formRef} formik={formik} />
            </ScrollViewSheetWithRef>

            <TouchableOpacity
              disabled={!formik.dirty || formik.isSubmitting}
              className={`absolute bottom-4 right-4 rounded-full ${formik.dirty ? "border-2 border-white bg-blue-500" : "bg-blue-950"} p-2 px-4`}
              onPress={() => formik.handleSubmit()}
            >
              {formik.isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text
                  className={`${formik.dirty ? "text-white" : "text-gray-600"} text-lg`}
                >
                  Update
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    );
  },
);
