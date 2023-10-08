import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import _ from "lodash";
import { type PartialDeep } from "type-fest";

import { type CoordT, type VibefireEventT } from "@vibefire/models";

import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { trpc } from "~/apis/trpc-client";
import { navManageEventEditTimes } from "~/nav";
import {
  LinearRedOrangeView,
  ReviewSaveNextFormButtons,
  ScrollViewSheet,
} from "../_shared";

export const ManageEventEditLocationForm = (props: {
  eventId: string;
  currentEventData: PartialDeep<VibefireEventT> | undefined;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

  const [editDetailsEventState, setEditDetailsEventState] =
    useState(currentEventData);
  const hasEdited = !_.isEqual(editDetailsEventState, currentEventData);

  const updateLocationMut = trpc.events.updateLocation.useMutation();

  useEffect(() => {
    if (updateLocationMut.status === "success") {
      dataRefetch();
    }
  }, [updateLocationMut.status, dataRefetch]);

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
              Edit
            </Text>
          </View>
        </LinearRedOrangeView>
        {/* Form */}
        <View className=" w-full flex-col">
          <Text className="mx-5 text-lg">Tap to select a location:</Text>
          <View className="mx-4 aspect-[4/4] border-2 border-slate-200">
            <LocationSelectionMap
              currentSelectedPosition={
                (currentEventData?.location?.position as CoordT) ?? undefined
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
              className="ml-4 py-2"
              style={{ fontSize: 20 }}
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
          <ReviewSaveNextFormButtons
            eventId={eventId}
            savedEnabled={hasEdited}
            onPressSave={() => {
              if (!hasEdited) {
                return;
              }
              updateLocationMut.mutate({
                eventId,
                position: editDetailsEventState?.location?.position as CoordT,
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
