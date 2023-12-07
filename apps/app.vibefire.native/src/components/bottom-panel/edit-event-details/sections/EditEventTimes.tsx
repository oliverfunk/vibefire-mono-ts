import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import _ from "lodash";
import { DateTime } from "luxon";

import {
  isoNTZToUTCDateTime,
  MONTH_DATE_TIME_LB_FORMAT,
  nowAsUTC,
} from "@vibefire/utils";

import { EventTimeline } from "~/components/event/EventTimeline";
import { PlatformSelect } from "~/components/PlatformSelect";
import {
  DateTimeSelectionAndDisplayAnd,
  DateTimeSelectionAndDisplayIos,
} from "~/components/TimeSelection";
import { FormTextInput, FormTitleInput } from "../../_shared";
import { type FormSectionProps } from "./types";

const _TimelineElementView = (props: {
  timeIsoNTZ: string;
  message: string;
  onRemove: () => void;
  onMessageEdit: (message: string) => void;
}) => {
  const { timeIsoNTZ, message, onRemove, onMessageEdit } = props;
  return (
    <View className="flex-row items-center space-x-2">
      <View className="flex-[2] rounded-sm bg-slate-200 p-2">
        <Text className="text-center text-lg">{timeIsoNTZ}</Text>
      </View>
      <View className="flex-[8]">
        <FormTextInput
          value={message}
          onChangeText={onMessageEdit}
          multiline={true}
        />
      </View>
      <View className="flex-[1]">
        <TouchableOpacity
          className="h-5 w-5 items-center justify-center rounded-full bg-gray-800"
          onPress={onRemove}
        >
          <FontAwesome name="close" size={15} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const _TimelineElementAdd = (props: {
  timeStartIsoNTZ?: string;
  onAdd: (timeIsoNTZ: string, message: string) => void;
}) => {
  const { timeStartIsoNTZ, onAdd } = props;

  const [message, setMessage] = useState("");
  const [selectedTimeIsoNTZ, setSelectedTimeIsoNTZ] = useState<
    string | undefined
  >(timeStartIsoNTZ);

  const hasEdited = useMemo(() => {
    if (message === "" || message.length < 2) {
      return false;
    }
    return true;
  }, [message]);

  return (
    <View className="flex-col ">
      <View className="flex-col">
        <Text className="text-lg">Select a time</Text>
        <View className="flex-row items-center py-2">
          <PlatformSelect
            android={
              <DateTimeSelectionAndDisplayAnd
                currentDate={
                  selectedTimeIsoNTZ
                    ? isoNTZToUTCDateTime(selectedTimeIsoNTZ).toJSDate()
                    : nowAsUTC().startOf("hour").toJSDate()
                }
                onChange={(selectedDate?: Date) => {
                  if (selectedDate) {
                    setSelectedTimeIsoNTZ(selectedDate.toISOString());
                  }
                }}
              />
            }
            ios={
              <DateTimeSelectionAndDisplayIos
                currentDate={
                  selectedTimeIsoNTZ
                    ? isoNTZToUTCDateTime(selectedTimeIsoNTZ).toJSDate()
                    : nowAsUTC().startOf("hour").toJSDate()
                }
                onChange={(selectedDate?: Date) => {
                  if (selectedDate) {
                    setSelectedTimeIsoNTZ(selectedDate.toISOString());
                  }
                }}
              />
            }
          />
        </View>
      </View>

      <View className="flex-col">
        <Text className="text-lg">Message</Text>
        <View>
          <FormTextInput
            value={message}
            onChangeText={(text) => {
              setMessage(text);
            }}
            multiline={true}
          />
        </View>
      </View>

      <View className="pt-4">
        <TouchableOpacity
          className={`rounded-lg ${hasEdited ? "bg-black" : "bg-slate-200"}`}
          disabled={!hasEdited}
          onPress={() => {
            if (!selectedTimeIsoNTZ) {
              return;
            }
            onAdd(selectedTimeIsoNTZ, message);
            setMessage("");
            setSelectedTimeIsoNTZ(timeStartIsoNTZ);
          }}
        >
          <Text
            className={`py-2 text-center text-lg ${
              hasEdited ? "text-white" : "text-gray-500"
            }`}
          >
            + Add
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

  const timelineElements = useMemo(() => {
    return (
      editedEventData.timeline?.map((tl) => ({
        ...tl,
        timeStr: isoNTZToUTCDateTime(tl.timeIsoNTZ).toFormat(
          MONTH_DATE_TIME_LB_FORMAT,
        ),
        ts: isoNTZToUTCDateTime(tl.timeIsoNTZ).toUnixInteger(),
      })) ?? []
    );
  }, [editedEventData.timeline]);

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
          {editedEventData.timeStartIsoNTZ ? (
            <View className="flex-row">
              <PlatformSelect
                android={
                  <DateTimeSelectionAndDisplayAnd
                    currentDate={new Date(editedEventData.timeStartIsoNTZ)}
                    onChange={onTimeStartSelect}
                  />
                }
                ios={
                  <DateTimeSelectionAndDisplayIos
                    currentDate={new Date(editedEventData.timeStartIsoNTZ)}
                    onChange={onTimeStartSelect}
                  />
                }
              />
            </View>
          ) : (
            <TouchableOpacity
              className="rounded-lg bg-slate-200 p-2"
              onPress={() => {
                setEditedEventData(
                  _.merge({}, editedEventData, {
                    timeStartIsoNTZ: nowAsUTC().startOf("hour").toISO()!,
                  } as typeof editedEventData),
                );
              }}
            >
              <Text className="text-center text-lg text-black">
                + Add starting time
              </Text>
            </TouchableOpacity>
          )}
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
                    timeEndIsoNTZ: nowAsUTC().startOf("hour").toISO()!,
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

      <View className="h-[1px] bg-black" />

      <Text className="pb-2 text-2xl font-bold text-black">Timeline</Text>

      <Text className="pb-2 text-lg text-black">
        You can add more times to your event here
      </Text>

      <View className="bg-black p-4">
        <EventTimeline
          timelineElements={timelineElements}
          timeStartIsoNTZ={editedEventData.timeStartIsoNTZ}
          timeEndIsoNTZ={editedEventData.timeEndIsoNTZ}
        />
      </View>

      <View className="flex-col space-y-5">
        {timelineElements.map((tl, i) => (
          <View key={i}>
            <_TimelineElementView
              timeIsoNTZ={tl.timeStr}
              message={tl.message}
              onMessageEdit={(message) => {
                const tl = editedEventData.timeline;
                if (tl) {
                  const newTl = _.cloneDeep(tl);
                  const tlIndex = _.findIndex(newTl, (tl) => tl.id === tl.id);
                  newTl[tlIndex].message = message;
                  setEditedEventData({
                    ...editedEventData,
                    timeline: newTl,
                  });
                }
              }}
              onRemove={() => {
                const tl = editedEventData.timeline;
                if (tl) {
                  const newTl = _.cloneDeep(tl);
                  const tlIndex = _.findIndex(newTl, (tl) => tl.id === tl.id);
                  newTl.splice(tlIndex, 1);
                  setEditedEventData({
                    ...editedEventData,
                    timeline: newTl,
                  });
                }
              }}
            />
          </View>
        ))}
      </View>

      <View>
        <_TimelineElementAdd
          timeStartIsoNTZ={editedEventData.timeStartIsoNTZ}
          onAdd={(timeIsoNTZ, message) => {
            const tl = editedEventData.timeline;
            if (tl) {
              const newTl = _.cloneDeep(tl);
              newTl.push({
                id: nowAsUTC().toUnixInteger().toString(),
                timeIsoNTZ,
                message,
                isNotification: false,
                hasNotified: false,
              });
              setEditedEventData({
                ...editedEventData,
                timeline: newTl,
              });
            }
          }}
        />
      </View>
    </View>
  );
};
