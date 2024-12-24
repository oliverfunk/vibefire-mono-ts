import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { type BottomSheetScrollViewMethods } from "@gorhom/bottom-sheet";
import { Formik, type FormikErrors, type FormikProps } from "formik";

import { type TModelVibefireEvent } from "@vibefire/models";
import { ntzToDateTime, type PartialDeep } from "@vibefire/utils";

import { trpc } from "!/api/trpc-client";

import { ScrollViewSheetWithRef } from "!/c/misc/sheet-utils";
import { withSuspenseErrorBoundarySheet } from "!/c/misc/SuspenseWithError";
import { navViewEventPreview } from "!/nav";

import { EditableEventForm } from "./EditableEventForm";

export const EditEventWysiwygSheet = withSuspenseErrorBoundarySheet(
  (props: { eventId: string; isCreateNew: boolean }) => {
    const { eventId, isCreateNew } = props;

    const router = useRouter();

    const [viewManage, viewManageCtl] = trpc.events.viewManage.useSuspenseQuery(
      {
        eventId,
      },
      {
        gcTime: 1000,
      },
    );
    const updateMut = trpc.events.update.useMutation();
    const updateVisibilityMut = trpc.events.updateVisibility.useMutation();
    const updateAccessMut = trpc.events.updateAccess.useMutation();

    const formRef = useRef<BottomSheetScrollViewMethods>(null);
    const formikRef =
      useRef<FormikProps<PartialDeep<TModelVibefireEvent>>>(null);

    if (!viewManage.ok) {
      throw viewManage.error;
    }

    const { event, membership } = viewManage.value;

    useEffect(() => {
      formikRef.current?.resetForm({
        values: event,
      });
    }, [event]);

    return (
      <Formik
        innerRef={formikRef}
        initialValues={event}
        validateOnChange={true}
        validate={(values) => {
          const errors: FormikErrors<TModelVibefireEvent> = {};

          const startDT = values?.times?.ntzStart
            ? ntzToDateTime(values.times.ntzStart)
            : undefined;
          const endDT = values?.times?.ntzEnd
            ? ntzToDateTime(values.times.ntzEnd)
            : undefined;

          if (startDT && endDT && startDT > endDT) {
            if (!errors.times) {
              errors.times = {};
            }
            errors.times.ntzEnd = "End time must be after start time";
          }
          return errors;
        }}
        onSubmit={async (values) => {
          try {
            const res = await updateMut.mutateAsync({
              eventId,
              update: {
                name: values?.name,
                details: values?.details,
                images: values?.images,
                location: values?.location,
                times: values?.times,
              },
            });
            if (res.ok) {
              await viewManageCtl.refetch();
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
              text1: "We could not update your event, try again",
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
          const isUpdated = formik.dirty;
          const isActive = isUpdated && !isSubmitting;
          const hasErrors = Object.keys(formik.errors).length > 0;
          const isActiveNoErrors = isUpdated && !hasErrors;
          const noErrorsNotSubmitting = !hasErrors && !isSubmitting;
          return (
            <>
              <ScrollViewSheetWithRef ref={formRef}>
                <EditableEventForm
                  formik={formik}
                  membership={membership ?? undefined}
                  isFormUpdated={isUpdated}
                  updateAccessLoading={
                    updateAccessMut.isPending ||
                    viewManageCtl.isFetching ||
                    viewManageCtl.isPending
                  }
                  updateVisibilityLoading={
                    updateVisibilityMut.isPending ||
                    viewManageCtl.isFetching ||
                    viewManageCtl.isPending
                  }
                  onHidePress={async () => {
                    if (!eventId) {
                      return;
                    }
                    await updateVisibilityMut.mutateAsync({
                      eventId,
                      update: "hide",
                    });
                    await viewManageCtl.refetch();
                  }}
                  onPublishPress={async () => {
                    if (!eventId) {
                      return;
                    }
                    if (noErrorsNotSubmitting) {
                      await updateVisibilityMut.mutateAsync({
                        eventId,
                        update: "publish",
                      });
                      await viewManageCtl.refetch();
                    }
                  }}
                  onMakeInviteOnlyPress={async () => {
                    if (!eventId) {
                      return;
                    }
                    await updateAccessMut.mutateAsync({
                      eventId,
                      update: "invite",
                    });
                    await viewManageCtl.refetch();
                  }}
                  onMakeOpenPress={() => {
                    if (!eventId) {
                      return;
                    }
                    updateAccessMut.mutate(
                      {
                        eventId,
                        update: "open",
                      },
                      {
                        onSuccess: () => {
                          void viewManageCtl.refetch();
                        },
                      },
                    );
                  }}
                  onPreviewPress={() => {
                    if (!eventId) {
                      return;
                    }
                    navViewEventPreview(router, eventId);
                  }}
                />

                {/* For the form btns */}
                <View className="h-16" />
              </ScrollViewSheetWithRef>

              {/* form btns */}
              <View className="absolute bottom-0 h-14 w-full flex-row items-end justify-evenly bg-black/90">
                <View className="flex-1" />
                <TouchableOpacity
                  disabled={!isActive}
                  className={`rounded-full border-2 ${isActive ? "border-orange-500" : "border-neutral-600"} p-2 px-4`}
                  onPress={() => formik.resetForm()}
                >
                  <Text
                    className={`${isActive ? "text-white" : "text-neutral-600"} text-lg`}
                  >
                    <FontAwesome5 name="redo" size={15} /> Reset
                  </Text>
                </TouchableOpacity>
                <View className="flex-1" />
                <TouchableOpacity
                  disabled={!isActiveNoErrors}
                  className={`rounded-full border-2 ${isActiveNoErrors ? "border-green-500" : "border-neutral-600"} p-2 px-4`}
                  onPress={() => formik.handleSubmit()}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      className={`${isActiveNoErrors ? "text-white" : "text-neutral-600"} text-lg`}
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
