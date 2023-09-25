import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useBottomSheet } from "@gorhom/bottom-sheet";
import _ from "lodash";

import { type VibefireEventT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import {
  LinearRedOrangeView,
  navManageEvent,
  navManageEventClose,
  navManageEventEditLocation,
  ReviewSaveNextFormButtons,
  ScrollViewSheet,
} from "../_shared";

export const ManageEventEditDescriptionsForm = (props: {
  eventId: string;
  currentEventData: Partial<VibefireEventT> | undefined;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

  const { close } = useBottomSheet();

  const [editDetailsEventState, setEditDetailsEventState] =
    useState(currentEventData);
  const hasEdited = !_.isEqual(editDetailsEventState, currentEventData);

  const updateDescriptionsMut = trpc.events.updateDescriptions.useMutation();

  useEffect(() => {
    if (updateDescriptionsMut.status === "success") {
      dataRefetch();
    }
  }, [updateDescriptionsMut.status, dataRefetch]);

  useEffect(() => {
    setEditDetailsEventState(currentEventData);
  }, [currentEventData]);

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
        <View className="w-full flex-col">
          <Text className="mx-5 text-lg">Event title:</Text>
          <View className="mx-4 rounded-lg bg-slate-200">
            <TextInput
              className="ml-4 py-2"
              style={{ fontSize: 36 }}
              placeholderTextColor={"#000000FF"}
              onChangeText={(text) =>
                setEditDetailsEventState((v) => ({
                  ...v,
                  title: text,
                }))
              }
              value={editDetailsEventState?.title}
              placeholder=""
            />
          </View>
        </View>

        <View className="w-full flex-col">
          <Text className="mx-5 text-lg">Event description:</Text>
          <View className="mx-4 rounded-lg bg-slate-200">
            <TextInput
              className="ml-4 py-2"
              style={{ fontSize: 20 }}
              placeholderTextColor={"#000000FF"}
              multiline={true}
              onChangeText={(text) =>
                setEditDetailsEventState((v) => ({
                  ...v,
                  description: text,
                }))
              }
              value={editDetailsEventState?.description}
              placeholder=""
              // autoFocus={true}
            />
          </View>
        </View>

        <View className="w-full">
          <ReviewSaveNextFormButtons
            eventId={eventId}
            savedEnabled={hasEdited}
            onPressSave={() => {
              if (!hasEdited) {
                return;
              }
              updateDescriptionsMut.mutate({
                eventId,
                title: editDetailsEventState?.title,
                description: editDetailsEventState?.description,
              });
            }}
            onPressNext={() => {
              navManageEventEditLocation(eventId);
            }}
          />
        </View>
      </View>
    </ScrollViewSheet>
  );
};
