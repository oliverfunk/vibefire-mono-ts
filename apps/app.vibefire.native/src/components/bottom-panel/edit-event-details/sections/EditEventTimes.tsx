import { useCallback, useLayoutEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import _ from "lodash";
import { DateTime } from "luxon";

import { nowAsUTC } from "@vibefire/utils";

import { PlatformSelect } from "~/components/PlatformSelect";
import {
  DateTimeSelectionAndDisplayAnd,
  DateTimeSelectionAndDisplayIos,
} from "~/components/TimeSelection";
import { FormTitleInput } from "../../_shared";
import { type FormSectionProps } from "./types";

export const EditEventTimes = (props: FormSectionProps) => {
  const {
    currentEventData,
    editedEventData,
    setEditedEventData,
    setMayProceed,
    setFormValidations,
  } = props;
  useLayoutEffect(() => {
    setMayProceed(!!editedEventData.timeStartIsoNTZ);

    // validations
    const validations = () => {
      if (editedEventData.timeStartIsoNTZ && editedEventData.timeEndIsoNTZ) {
        const startDT = DateTime.fromISO(editedEventData.timeStartIsoNTZ);
        const endDT = DateTime.fromISO(editedEventData.timeEndIsoNTZ);

        if (startDT.startOf("minute") >= endDT.startOf("minute")) {
          return ["The starting time must be set before the ending"];
        }
      }
      return [];
    };
    setFormValidations(validations());
  }, [editedEventData, setFormValidations, setMayProceed]);

  const onTimeStartSelect = useCallback(
    (selectedDate?: Date) => {
      if (selectedDate) {
        setEditedEventData(
          _.merge({}, editedEventData, {
            timeStartIsoNTZ: selectedDate.toISOString(),
          } as typeof editedEventData),
        );
      }
    },
    [editedEventData, setEditedEventData],
  );
  const onTimeEndSelect = useCallback(
    (selectedDate?: Date) => {
      if (selectedDate) {
        setEditedEventData(
          _.merge({}, editedEventData, {
            timeEndIsoNTZ: selectedDate.toISOString(),
          } as typeof editedEventData),
        );
      }
    },
    [editedEventData, setEditedEventData],
  );

  return (
    <View className="w-full flex-col space-y-4 p-4">
      <View className="rounded-lg border bg-white p-2">
        <Text className="text-center text-lg">
          Time zone: {editedEventData?.timeZone ?? "Select a location first"}
        </Text>
      </View>

      <View>
        <FormTitleInput
          title="Starting time"
          inputRequired={!editedEventData.timeStartIsoNTZ}
        >
          <View className="flex-row">
            <PlatformSelect
              android={
                <DateTimeSelectionAndDisplayAnd
                  currentDate={
                    new Date(
                      editedEventData.timeStartIsoNTZ ?? nowAsUTC().toISO()!,
                    )
                  }
                  onChange={onTimeStartSelect}
                />
              }
              ios={
                <DateTimeSelectionAndDisplayIos
                  currentDate={
                    new Date(
                      editedEventData.timeStartIsoNTZ ?? nowAsUTC().toISO()!,
                    )
                  }
                  onChange={onTimeStartSelect}
                />
              }
            />
          </View>
        </FormTitleInput>
      </View>

      <View>
        <FormTitleInput title="Ending time">
          {editedEventData.timeEndIsoNTZ ? (
            <View className="flex-row">
              <PlatformSelect
                android={
                  <DateTimeSelectionAndDisplayAnd
                    currentDate={new Date(editedEventData.timeEndIsoNTZ)}
                    onChange={onTimeEndSelect}
                  />
                }
                ios={
                  <DateTimeSelectionAndDisplayIos
                    currentDate={new Date(editedEventData.timeEndIsoNTZ)}
                    onChange={onTimeEndSelect}
                  />
                }
              />
              <View className="grow" />
              <TouchableOpacity
                className="mr-2 h-5 w-5 items-center justify-center rounded-full bg-gray-800"
                onPress={() => {
                  setEditedEventData({
                    ...editedEventData,
                    timeEndIsoNTZ:
                      currentEventData.timeEndIsoNTZ === undefined
                        ? undefined
                        : null,
                  });
                }}
              >
                <FontAwesome name="close" size={15} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="rounded-lg bg-slate-200 p-2"
              onPress={() => {
                setEditedEventData(
                  _.merge({}, editedEventData, {
                    timeEndIsoNTZ: nowAsUTC().toISO()!,
                  } as typeof editedEventData),
                );
              }}
            >
              <Text className="text-center text-lg text-black">
                + Add ending time
              </Text>
            </TouchableOpacity>
          )}
        </FormTitleInput>
      </View>
    </View>
  );
};
