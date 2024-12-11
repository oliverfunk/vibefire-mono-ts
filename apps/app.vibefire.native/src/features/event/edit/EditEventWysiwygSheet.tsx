import React, { useRef } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { type BottomSheetScrollViewMethods } from "@gorhom/bottom-sheet";
import { Formik, type FormikErrors, type FormikProps } from "formik";

import { type TModelVibefireEvent } from "@vibefire/models";
import { isoNTZToUTCDateTime } from "@vibefire/utils";

import { trpc } from "!/api/trpc-client";

import { ScrollViewSheetWithRef } from "!/c/misc/sheet-utils";
import { withSuspenseErrorBoundarySheet } from "!/c/misc/SuspenseWithError";
import { navManageEvent, navViewEventPreview } from "!/nav";

import { EditableEventForm } from "./EditableEventForm";

export const EditEventWysiwygSheet = withSuspenseErrorBoundarySheet(
  (props: { eventId: string }) => {
    const { eventId } = props;

    const router = useRouter();

    const [viewManage, _viewManageCtl] =
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

    return (
      <Formik
        innerRef={formikRef}
        initialValues={viewManage.value}
        validate={(values) => {
          const errors: FormikErrors<TModelVibefireEvent> = {};

          const startDT = values.times.tsStart
            ? isoNTZToUTCDateTime(values.times.tsStart)
            : undefined;
          const endDT = values.times.tsEnd
            ? isoNTZToUTCDateTime(values.times.tsEnd)
            : undefined;

          if (startDT && endDT && startDT > endDT) {
            if (!errors.times) {
              errors.times = {};
            }
            errors.times.tsEnd = "End time must be after start time";
          }
          return errors;
        }}
        validateOnChange={true}
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
        {(formik) => {
          const eventId = formik.values.id;
          const isSubmitting = formik.isSubmitting;
          const isActive = formik.dirty && !isSubmitting;
          const hasErrors = Object.keys(formik.errors).length > 0;
          const hasValuesWithNoErrors = formik.dirty && !hasErrors;
          return (
            <>
              <ScrollViewSheetWithRef ref={formRef}>
                <EditableEventForm
                  formik={formik}
                  onManageEventPress={() => {
                    navManageEvent(router, eventId);
                  }}
                  onPreviewEventPress={() => {
                    navViewEventPreview(router, eventId);
                  }}
                />

                {/* For the form btns */}
                <View className="h-16" />
              </ScrollViewSheetWithRef>

              <View className="absolute bottom-0 h-14 w-full flex-row items-end justify-evenly bg-black/90">
                <View className="flex-1" />
                <TouchableOpacity
                  disabled={!isActive}
                  className={`rounded-full border-2 ${isActive ? "border-orange-500" : "border-gray-700"} p-2 px-4`}
                  onPress={() => formik.resetForm()}
                >
                  <Text
                    className={`${isActive ? "text-white" : "text-gray-600"} text-lg`}
                  >
                    <FontAwesome5 name="redo" size={15} /> Reset
                  </Text>
                </TouchableOpacity>
                <View className="flex-1" />
                <TouchableOpacity
                  disabled={!isActive || hasErrors}
                  className={`rounded-full border-2 ${hasValuesWithNoErrors ? "border-green-500" : "border-gray-700"} p-2 px-4`}
                  onPress={() => formik.handleSubmit()}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      className={`${hasValuesWithNoErrors ? "text-white" : "text-gray-600"} text-lg`}
                    >
                      <FontAwesome6 name="file-arrow-up" size={20} /> Update
                    </Text>
                  )}
                </TouchableOpacity>
                <View className="flex-1" />
              </View>
            </>
          );
        }}
      </Formik>
    );
  },
);
