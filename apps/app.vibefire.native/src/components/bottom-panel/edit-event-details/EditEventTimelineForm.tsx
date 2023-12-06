import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import _ from "lodash";
import { type PartialDeep } from "type-fest";

import {
  type VibefireEventT,
  type VibefireEventTimelineElementT,
} from "@vibefire/models";
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
import { trpc } from "~/apis/trpc-client";
import { navManageEvent } from "~/nav";
import { FormTextInput, ScrollViewSheetWithHeader } from "../_shared";

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
  timeStartIsoNTZ: string;
  onAdd: (timeIsoNTZ: string, message: string) => void;
}) => {
  const { timeStartIsoNTZ, onAdd } = props;

  const [message, setMessage] = useState("");
  const [selectedTimeIsoNTZ, setSelectedTimeIsoNTZ] =
    useState<string>(timeStartIsoNTZ);

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
                currentDate={isoNTZToUTCDateTime(selectedTimeIsoNTZ).toJSDate()}
                onChange={(selectedDate?: Date) => {
                  if (selectedDate) {
                    setSelectedTimeIsoNTZ(selectedDate.toISOString());
                  }
                }}
              />
            }
            ios={
              <DateTimeSelectionAndDisplayIos
                currentDate={isoNTZToUTCDateTime(selectedTimeIsoNTZ).toJSDate()}
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
          onPress={() => {
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

export const EditEventTimeline = (props: {
  eventId: string;
  currentEventData: PartialDeep<VibefireEventT>;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

  const currentEventFormData = useMemo(
    () => ({
      timeStartIsoNTZ: currentEventData.timeStartIsoNTZ!,
      timeEndIsoNTZ: currentEventData.timeEndIsoNTZ,
      timeline: currentEventData.timeline!,
    }),
    [currentEventData],
  );

  const [selectedEventTimeline, setSelectedEventTimeline] = useState<
    VibefireEventTimelineElementT[]
  >(currentEventFormData.timeline);

  const hasEdited = useMemo(() => {
    return !_.isEqual(selectedEventTimeline, currentEventFormData.timeline);
  }, [selectedEventTimeline, currentEventFormData.timeline]);

  const updateEvent = trpc.events.updateEvent.useMutation();

  useEffect(() => {
    if (updateEvent.isSuccess) {
      dataRefetch();
    }
  }, [updateEvent.isSuccess, dataRefetch]);

  useEffect(() => {
    setSelectedEventTimeline(currentEventFormData.timeline);
  }, [currentEventFormData.timeline]);

  const timelineElements = useMemo(() => {
    const tlWithTime = selectedEventTimeline.map((tl) => ({
      ...tl,
      timeStr: isoNTZToUTCDateTime(tl.timeIsoNTZ).toFormat(
        MONTH_DATE_TIME_LB_FORMAT,
      ),
      ts: isoNTZToUTCDateTime(tl.timeIsoNTZ).toUnixInteger(),
    }));
    return _.sortBy(tlWithTime, ["ts"]);
  }, [selectedEventTimeline]);

  return (
    <ScrollViewSheetWithHeader header="Edit Timeline">
      {/* Main col */}
      <View className="pb-4">
        <View className="flex-col bg-black p-4 ">
          <Text className="text-lg text-white">
            Edit the timeline by adding or removing timeline elements below
          </Text>
        </View>

        <View className="flex-col">
          <View className="bg-black p-4">
            <EventTimeline
              timelineElements={timelineElements}
              timeStartIsoNTZ={currentEventFormData.timeStartIsoNTZ}
              timeEndIsoNTZ={currentEventFormData.timeEndIsoNTZ}
            />
          </View>
        </View>

        <View className="border-b" />

        <View className="flex-col space-y-5">
          {timelineElements.map((tl, i) => (
            <View key={i}>
              <_TimelineElementView
                timeIsoNTZ={tl.timeStr}
                message={tl.message}
                onMessageEdit={(message) => {
                  setSelectedEventTimeline((prev) => {
                    return prev.map((preTle) => {
                      if (preTle.id === tl.id) {
                        return { ...preTle, message };
                      }
                      return preTle;
                    });
                  });
                }}
                onRemove={() => {
                  setSelectedEventTimeline((prev) => {
                    return _.remove(prev, (preTle) => preTle.id !== tl.id);
                  });
                }}
              />
              <View className="mt-5 border-b" />
            </View>
          ))}
        </View>

        <View>
          <_TimelineElementAdd
            timeStartIsoNTZ={currentEventFormData.timeStartIsoNTZ}
            onAdd={(timeIsoNTZ, message) => {
              setSelectedEventTimeline((prev) => {
                return [
                  ...prev,
                  {
                    id: nowAsUTC().toUnixInteger().toString(),
                    timeIsoNTZ,
                    message,
                    isNotification: false,
                    hasNotified: false,
                  },
                ];
              });
            }}
          />
        </View>

        <View className="border-b" />

        <View className="flex-row justify-around">
          <TouchableOpacity
            className="rounded-lg border bg-white px-4 py-2"
            onPress={() => {
              navManageEvent(eventId);
            }}
          >
            <Text className="text-xl text-black">Manage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-lg px-4 py-2 ${
              hasEdited ? "bg-red-500" : "bg-gray-300"
            }`}
            disabled={!hasEdited}
            onPress={() => {
              updateEvent.mutate({
                eventId,
                timeline: selectedEventTimeline,
              });
            }}
          >
            <Text className="text-xl text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollViewSheetWithHeader>
  );
};
