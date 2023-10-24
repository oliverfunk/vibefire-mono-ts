import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import _ from "lodash";

import { type VibefireEventT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { navManageEventEditLocation } from "~/nav";
import {
  LinearRedOrangeView,
  ReviewSaveNextFormButtons,
  ScrollViewSheet,
  ScrollViewSheetWithHeader,
} from "../_shared";

export const ManageEventEditDescriptionsForm = (props: {
  eventId: string;
  currentEventData: Partial<VibefireEventT> | undefined;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

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
    <ScrollViewSheetWithHeader header="Edit">
      <View className="flex-col space-y-10 py-5">
        {/*  */}
        <View className="flex-col">
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

        <View className="flex-col">
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

        <View>
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
    </ScrollViewSheetWithHeader>
  );
};
