/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import _, { set } from "lodash";
import { DateTime } from "luxon";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";
import { nowAsUTC } from "@vibefire/utils";

import { trpc } from "~/apis/trpc-client";
import {
  BackSaveNextFormButtons,
  ErrorSheet,
  LinearRedOrangeView,
  navManageEventEditLocation,
  ScrollViewSheet,
} from "../_shared";

const PlatformSelect = (props: {
  android?: JSX.Element;
  ios?: JSX.Element;
}) => {
  const { android, ios } = props;
  switch (Platform.OS) {
    case "android":
      return android;
    case "ios":
      return ios;
    default:
      throw new Error(`Platform not supported: ${Platform.OS}`);
  }
};

const _TimeSelectionAndDisplayIos = (props: {
  currentDate: Date;
  onChange?: (event: DateTimePickerEvent, date?: Date) => void;
}) => {
  const { currentDate, onChange } = props;

  return (
    <>
      <DateTimePicker
        value={currentDate}
        mode={"date"}
        timeZoneOffsetInMinutes={0}
        is24Hour={true}
        onChange={onChange}
        minuteInterval={15}
        maximumDate={new Date(2030, 1, 1)}
        minimumDate={new Date(2020, 1, 1)}
      />
      <DateTimePicker
        value={currentDate}
        mode={"time"}
        timeZoneOffsetInMinutes={0}
        minuteInterval={15}
        is24Hour={true}
        onChange={onChange}
      />
    </>
  );
};

const _TimeSelectionAndDisplayAnd = (props: {
  currentDate: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
}) => {
  const { currentDate, onChange } = props;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const dt = useMemo(
    () => DateTime.fromJSDate(currentDate, { zone: "utc" }),
    [currentDate],
  );

  return (
    <>
      <TouchableOpacity
        className="rounded-lg bg-gray-200 px-4 py-1"
        onPress={() => {
          setShowDatePicker(true);
          // DateTimePickerAndroid.open({
          //   value: currentDate,
          //   mode: "date",
          //   is24Hour: true,
          //   onChange: onChange,
          //   minuteInterval: 15,
          //   maximumDate: new Date(2030, 1, 1),
          //   minimumDate: new Date(2020, 1, 1),
          // });
        }}
      >
        <Text className="text-lg text-black">
          {showDatePicker && (
            <DateTimePicker
              value={currentDate}
              mode={"date"}
              timeZoneOffsetInMinutes={0}
              is24Hour={true}
              onChange={(event, date) => {
                setShowDatePicker(false);
                onChange(event, date);
              }}
              onError={(_) => {
                setShowDatePicker(false);
              }}
              minuteInterval={15}
              maximumDate={new Date(2030, 1, 1)}
              minimumDate={new Date(2020, 1, 1)}
            />
          )}
          {dt.toLocaleString(DateTime.DATE_MED)}
        </Text>
      </TouchableOpacity>
      <View className="w-3" />
      <TouchableOpacity
        className="rounded-lg bg-gray-200 px-4 py-1"
        onPress={() => {
          setShowTimePicker(true);
          // DateTimePickerAndroid.open({
          //   value: currentDate,
          //   mode: "time",
          //   display: "spinner",
          //   onChange: onChange,
          //   minuteInterval: 15,
          //   maximumDate: new Date(2030, 1, 1),
          //   minimumDate: new Date(2020, 1, 1),
          // });
        }}
      >
        <Text className="text-lg text-black">
          {showTimePicker && (
            <DateTimePicker
              value={currentDate}
              mode={"time"}
              display="spinner"
              timeZoneOffsetInMinutes={0}
              minuteInterval={15}
              is24Hour={true}
              onChange={(event, date) => {
                setShowTimePicker(false);
                onChange(event, date);
              }}
              onError={(_) => {
                setShowTimePicker(false);
              }}
            />
          )}
          {dt.toLocaleString(DateTime.TIME_SIMPLE)}
        </Text>
      </TouchableOpacity>
    </>
  );
};

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
      timeEndIsoNTZ: currentEventData?.timeEndIsoNTZ,
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
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) {
        console.log("timeStartIsoNTZ:");
        console.log(JSON.stringify(selectedDate.toISOString(), null, 2));
        setSelectedFormData((v) => ({
          ...v,
          timeStartIsoNTZ: selectedDate.toISOString(),
        }));
      }
    },
    [],
  );
  const onTimeEndSelect = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
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
              Edit event
            </Text>
          </View>
        </LinearRedOrangeView>
        {/* Form */}
        <View className="w-full flex-col ">
          <View className="mx-4 flex-row items-center justify-center rounded-lg border py-2">
            <Text className="text-lg">
              Time zone: {currentEventData?.timeZone}
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
                <_TimeSelectionAndDisplayAnd
                  currentDate={new Date(selectedFormData.timeStartIsoNTZ)}
                  onChange={onTimeStartSelect}
                />
              }
              ios={
                <_TimeSelectionAndDisplayIos
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
                  <_TimeSelectionAndDisplayAnd
                    currentDate={new Date(selectedFormData.timeEndIsoNTZ)}
                    onChange={onTimeEndSelect}
                  />
                }
                ios={
                  <_TimeSelectionAndDisplayIos
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
                    timeEndIsoNTZ: undefined,
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
          <BackSaveNextFormButtons
            hasEdited={hasEdited}
            onPressBack={() => {
              navManageEventEditLocation(eventId);
            }}
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
              updateTimes.mutate({
                eventId,
                timeStartIsoNTZ: selectedFormData?.timeStartIsoNTZ,
                timeEndIsoNTZ: selectedFormData?.timeEndIsoNTZ,
              });
            }}
            onPressNext={() => {}}
          />
        </View>
      </View>
    </ScrollViewSheet>
  );
};
