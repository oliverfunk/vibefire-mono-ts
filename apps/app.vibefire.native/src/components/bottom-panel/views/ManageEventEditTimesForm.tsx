/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import _ from "lodash";
import { DateTime } from "luxon";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";
import { nowAsUTC } from "@vibefire/utils";

import { PlatformSelect } from "~/components/PlatformSelect";
import {
  TimeSelectionAndDisplayAnd,
  TimeSelectionAndDisplayIos,
} from "~/components/TimeSelection";
import { trpc } from "~/apis/trpc-client";
import { navManageEventEditImages } from "~/nav";
import {
  ErrorSheet,
  LinearRedOrangeView,
  ReviewSaveNextFormButtons,
  ScrollViewSheet,
} from "../_shared";

export const ManageEventEditTimesForm = (props: {
  eventId: string;
  currentEventData: PartialDeep<VibefireEventT> | undefined;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

  if (!currentEventData?.timeZone) {
    return (
      <ErrorSheet message="A location must be set before setting the times" />
    );
  }

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const currentEventFormData = useMemo(
    () => ({
      timeStartIsoNTZ: currentEventData?.timeStartIsoNTZ ?? nowAsUTC().toISO()!,
      timeEndIsoNTZ: currentEventData?.timeEndIsoNTZ ?? null,
    }),
    [currentEventData],
  );

  const [selectedFormData, setSelectedFormData] =
    useState(currentEventFormData);
  const hasEdited = !_.isEqual(selectedFormData, currentEventFormData);

  const updateTimes = trpc.events.updateTimes.useMutation();

  useEffect(() => {
    if (updateTimes.status === "success") {
      dataRefetch();
    }
  }, [updateTimes.status, dataRefetch]);

  useEffect(() => {
    setSelectedFormData(currentEventFormData);
  }, [currentEventFormData]);

  const onTimeStartSelect = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) {
        setSelectedFormData((v) => ({
          ...v,
          timeStartIsoNTZ: selectedDate.toISOString(),
        }));
      }
    },
    [],
  );
  const onTimeEndSelect = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) {
        setSelectedFormData((v) => ({
          ...v,
          timeEndIsoNTZ: selectedDate.toISOString(),
        }));
      }
    },
    [],
  );

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
        <View className="w-full flex-col ">
          <View className="mx-4 flex-row items-center justify-center rounded-lg border py-2">
            <Text className="text-lg">
              Time zone: {currentEventData?.timeZone ?? "Not set"}
            </Text>
          </View>
        </View>

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

        <View className="w-full flex-col">
          <Text className="mx-5 text-lg">Starting time:</Text>
          <View className="mx-4 flex-row items-center py-2">
            <PlatformSelect
              android={
                <TimeSelectionAndDisplayAnd
                  currentDate={new Date(selectedFormData.timeStartIsoNTZ)}
                  onChange={onTimeStartSelect}
                />
              }
              ios={
                <TimeSelectionAndDisplayIos
                  currentDate={new Date(selectedFormData.timeStartIsoNTZ)}
                  onChange={onTimeStartSelect}
                />
              }
            />
          </View>
        </View>

        <View className="w-full flex-col">
          <Text className="mx-5 text-lg">Ending time:</Text>
          {selectedFormData?.timeEndIsoNTZ ? (
            <View className="mx-4 flex-row items-center py-2">
              <PlatformSelect
                android={
                  <TimeSelectionAndDisplayAnd
                    currentDate={new Date(selectedFormData.timeEndIsoNTZ)}
                    onChange={onTimeEndSelect}
                  />
                }
                ios={
                  <TimeSelectionAndDisplayIos
                    currentDate={new Date(selectedFormData.timeEndIsoNTZ)}
                    onChange={onTimeEndSelect}
                  />
                }
              />
              <View className="grow" />
              <TouchableOpacity
                className="mr-2 h-5 w-5 items-center justify-center rounded-full bg-gray-800"
                onPress={() => {
                  setSelectedFormData({
                    ...selectedFormData,
                    timeEndIsoNTZ: null,
                  });
                }}
              >
                <FontAwesome name="close" size={15} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mx-4 rounded-lg bg-slate-200">
              <TouchableOpacity
                onPress={() => {
                  setSelectedFormData({
                    ...selectedFormData,
                    timeEndIsoNTZ: nowAsUTC().toISO()!,
                  });
                }}
              >
                <Text className="py-2 text-center text-lg text-black">
                  Add ending time
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="w-full">
          <ReviewSaveNextFormButtons
            eventId={eventId}
            savedEnabled={hasEdited}
            onPressSave={() => {
              if (!hasEdited) {
                return;
              }
              if (
                selectedFormData?.timeStartIsoNTZ &&
                selectedFormData?.timeEndIsoNTZ
              ) {
                const startDT = DateTime.fromISO(
                  selectedFormData.timeStartIsoNTZ,
                );
                const endDT = DateTime.fromISO(selectedFormData.timeEndIsoNTZ);

                if (startDT.startOf("minute") >= endDT.startOf("minute")) {
                  setFormErrors([
                    "The starting time must be set before the ending",
                  ]);
                  return;
                }
              }
              setFormErrors([]);
              console.log("updateTimes.mutate");
              console.log(JSON.stringify(selectedFormData, null, 2));
              updateTimes.mutate({
                eventId,
                timeStartIsoNTZ: selectedFormData?.timeStartIsoNTZ,
                timeEndIsoNTZ: selectedFormData?.timeEndIsoNTZ,
              });
            }}
            onPressNext={() => {
              navManageEventEditImages(eventId);
            }}
          />
        </View>
      </View>
    </ScrollViewSheet>
  );
};
