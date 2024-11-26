import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { type BottomSheetScrollViewMethods } from "@gorhom/bottom-sheet";
import { Formik, type FormikProps } from "formik";
import { DateTime } from "luxon";

import { CoordT, type TModelVibefireEvent } from "@vibefire/models";

import { trpc } from "!/api/trpc-client";

import { EventActionsBar } from "!/components/event/EventActionBar";
import {
  EventInfoAddressBar,
  EventInfoAddressBarEditable,
  EventInfoTimesBar,
} from "!/components/event/EventInfoBars";
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
import { MONTH_DATE_TIME_FORMAT } from "!utils/time-conversion";

import { AddEventDetailWidgetButton } from "./AddEventDetailWidgetButton";
import { EditableEventDetailWidget } from "./EditableEventDetailWidget";
import { EditableIconWrapper } from "./EditableIconWrapper";

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

const SelectEventTimeAndDateButton = (props: {
  children: ReactNode;
  event: TModelVibefireEvent;
  onSetStart: (d: Date) => void;
  onSetEnd: (d: Date | null) => void;
}) => {
  const { children, event, onSetStart, onSetEnd } = props;

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = useCallback(() => {
    const options = [
      "Set start time",
      "Set end time",
      "Clear end time",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            setShowStartPicker(true);
            break;
          case 1:
            setShowEndPicker(true);
            break;
          case 2:
            onSetEnd(null);
            break;

          case cancelButtonIndex:
            break;
        }
      },
    );
  }, [onSetEnd, showActionSheetWithOptions]);

  return (
    <TouchableOpacity onPress={onPress}>
      <DateTimePickerModal
        isVisible={showStartPicker}
        date={new Date()}
        mode="datetime"
        locale="utc"
        onConfirm={(date) => {
          setShowStartPicker(false);
          if (date) onSetStart(date);
        }}
        onCancel={() => {
          setShowStartPicker(false);
        }}
        onError={(_) => {
          setShowStartPicker(false);
        }}
        maximumDate={new Date(2030, 1, 1)}
        minimumDate={new Date(2020, 1, 1)}
      />
      <DateTimePickerModal
        isVisible={showEndPicker}
        date={new Date()}
        mode="datetime"
        locale="utc"
        onConfirm={(date) => {
          setShowEndPicker(false);
          if (date) onSetEnd(date);
        }}
        onCancel={() => {
          setShowEndPicker(false);
        }}
        onError={(_) => {
          setShowEndPicker(false);
        }}
        maximumDate={new Date(2030, 1, 1)}
        minimumDate={new Date(2020, 1, 1)}
      />
      {children}
    </TouchableOpacity>
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
            <SelectEventTimeAndDateButton
              event={event}
              onSetStart={async (d) => {
                await setFieldValue("times.tsStart", d.toISOString());
              }}
              onSetEnd={async (d) => {
                await setFieldValue("times.tsEnd", d ? d.toISOString() : null);
              }}
            >
              <EditableIconWrapper>
                <EventInfoTimesBar event={event} noEndTimeText="set end time" />
              </EditableIconWrapper>
            </SelectEventTimeAndDateButton>
          </View>
          <View>
            <EditableIconWrapper>
              <EventInfoAddressBarEditable
                event={event}
                className="text-white"
                multiline={true}
                numberOfLines={2}
                placeholderTextColor={"#909090FF"}
                placeholder="Location name"
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
          (Tap the map to select a location)
        </Text>
        <View className="aspect-[4/4]">
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
    const formikRef = useRef<FormikProps<TModelVibefireEvent>>(null);

    if (!viewManage.ok) {
      throw viewManage.error;
    }

    console.log("viewManage", JSON.stringify(viewManage.value, null, 2));

    return (
      <Formik
        innerRef={formikRef}
        initialValues={viewManage.value}
        onSubmit={async (values) => {
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
            if (res.ok) {
              formikRef.current?.resetForm({
                values: res.value,
              });
            } else {
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

            <View className="absolute bottom-0 h-14 w-full flex-row items-end justify-evenly bg-black/90">
              <View className="flex-1" />
              <TouchableOpacity
                disabled={!formik.dirty || formik.isSubmitting}
                className={`rounded-full border-2 ${formik.dirty && !formik.isSubmitting ? "border-orange-500" : "border-gray-700"} p-2 px-4`}
                onPress={() => formik.resetForm()}
              >
                <Text
                  className={`${formik.dirty && !formik.isSubmitting ? "text-white" : "text-gray-600"} text-lg`}
                >
                  <FontAwesome5 name="redo" size={15} /> Reset
                </Text>
              </TouchableOpacity>
              <View className="flex-1" />
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
              <View className="flex-1" />
            </View>
          </>
        )}
      </Formik>
    );
  },
);
