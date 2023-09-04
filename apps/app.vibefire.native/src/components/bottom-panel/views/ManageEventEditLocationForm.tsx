import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { trpc } from "~/apis/trpc-client";
import {
  BackSaveNextFormButtons,
  LinearRedOrangeView,
  navManageEventEditDescription,
  navManageEventEditTimes,
  ScrollViewSheet,
} from "../modals/_shared";

export const ManageEventEditLocationForm = (props: {
  eventId: string;
  currentEventData: PartialDeep<VibefireEventT> | undefined;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

  const updateLocation = trpc.events.updateLocation.useMutation();

  const [editDetailsEventState, setEditDetailsEventState] =
    useState(currentEventData);
  const hasEdited = editDetailsEventState !== currentEventData;

  useEffect(() => {
    if (updateLocation.status === "success") {
      dataRefetch();
    }
  }, [updateLocation.status, dataRefetch]);

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
        <View className="h-[300] w-full flex-col">
          <Text className="mx-5 text-lg">
            Tap on the map to select a location:
          </Text>
          <View className="mx-4 border-2 border-slate-200">
            <LocationSelectionMap
              currentSelectedPosition={
                currentEventData?.location?.position ?? undefined
              }
              onPositionInfo={(position, addressDescription) => {
                setEditDetailsEventState((v) => ({
                  ...v,
                  location: {
                    ...v?.location,
                    position,
                    addressDescription,
                  },
                }));
              }}
            />
          </View>
        </View>

        <View className="w-full flex-col">
          <Text className="mx-5 text-lg">Address description:</Text>
          <View className="mx-4 rounded-lg bg-slate-200">
            <TextInput
              className="ml-4 py-2 text-xl"
              placeholderTextColor={"#000000FF"}
              onChangeText={(text) => {
                setEditDetailsEventState((v) => ({
                  ...v,
                  location: {
                    ...v?.location,
                    addressDescription: text,
                  },
                }));
              }}
              value={editDetailsEventState?.location?.addressDescription}
              placeholder=""
            />
          </View>
        </View>

        <View className="w-full">
          <BackSaveNextFormButtons
            hasEdited={hasEdited}
            onPressBack={() => {
              navManageEventEditDescription(eventId);
            }}
            onPressSave={() => {
              if (!hasEdited) {
                return;
              }
              updateLocation.mutate({
                eventId,
                position: editDetailsEventState?.location?.position,
                addressDescription:
                  editDetailsEventState?.location?.addressDescription,
              });
            }}
            onPressNext={() => {
              navManageEventEditTimes(eventId);
            }}
          />
        </View>
      </View>
    </ScrollViewSheet>
  );
};
