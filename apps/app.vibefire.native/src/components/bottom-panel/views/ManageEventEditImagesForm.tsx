import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import _ from "lodash";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import {
  BackSaveNextFormButtons,
  LinearRedOrangeView,
  navManageEventEditLocation,
  navManageEventEditReview,
  navManageEventEditTimes,
  ScrollViewSheet,
} from "../_shared";

export const ManageEventEditImagesForm = (props: {
  eventId: string;
  currentEventData: PartialDeep<VibefireEventT> | undefined;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const currentEventFormData = useMemo(
    () => ({
      images: currentEventData?.images ?? [],
    }),
    [currentEventData],
  );

  const [selectedFormData, setSelectedFormData] =
    useState(currentEventFormData);
  const hasEdited = !_.isEqual(selectedFormData, currentEventFormData);

  const updateImages = trpc.events.updateImages.useMutation();

  useEffect(() => {
    if (updateImages.status === "success") {
      dataRefetch();
    }
  }, [updateImages.status, dataRefetch]);

  useEffect(() => {
    setSelectedFormData(currentEventFormData);
  }, [currentEventFormData]);

  return (
    <ScrollViewSheet>
      <View className="my-5 flex h-full flex-col items-center space-y-10">
        {/* Heading */}
        <LinearRedOrangeView className="flex-row p-4">
          <View className="w-full bg-black p-4">
            <Text className="text-center text-2xl font-bold text-white">
              Edit event
            </Text>
          </View>
        </LinearRedOrangeView>
        {/* Form */}
        {formErrors.length > 0 && (
          <View className="w-full flex-col">
            <View className="mx-4 space-y-2 rounded-lg bg-slate-200 p-4">
              {formErrors.map((error) => (
                <Text key={error} className="text-lg text-red-500">
                  {error}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View className="w-full">
          <BackSaveNextFormButtons
            hasEdited={hasEdited}
            onPressBack={() => {
              navManageEventEditTimes(eventId);
            }}
            onPressSave={() => {
              if (!hasEdited) {
                return;
              }
              setFormErrors([]);
              // updateImages.mutate({
              //   eventId,
              // });
            }}
            onPressNext={() => {
              // navManageEventEditReview(eventId);
            }}
          />
        </View>
      </View>
    </ScrollViewSheet>
  );
};
