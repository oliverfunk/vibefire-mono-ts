import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTime } from "luxon";

export const DateTimeSelectionAndDisplayIos = (props: {
  currentDate: Date;
  onChange: (date?: Date) => void;
}) => {
  const { currentDate, onChange } = props;

  return (
    <View className="ml-[-7] flex-row">
      <DateTimePicker
        value={currentDate}
        mode={"date"}
        timeZoneName={"utc"}
        is24Hour={true}
        onChange={(_event, date) => onChange(date)}
        minuteInterval={15}
        maximumDate={new Date(2030, 1, 1)}
        minimumDate={new Date(2020, 1, 1)}
      />
      <DateTimePicker
        value={currentDate}
        mode={"time"}
        timeZoneName={"utc"}
        minuteInterval={15}
        is24Hour={true}
        onChange={(_event, date) => onChange(date)}
      />
    </View>
  );
};

export const DateTimeSelectionAndDisplayAnd = (props: {
  currentDate: Date;
  onChange: (date?: Date) => void;
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
        }}
      >
        <Text className="text-lg text-black">
          {showDatePicker && (
            <DateTimePicker
              value={currentDate}
              mode={"date"}
              timeZoneName={"utc"}
              is24Hour={true}
              onChange={(_event, date) => {
                setShowDatePicker(false);
                onChange(date);
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
        }}
      >
        <Text className="text-lg text-black">
          {showTimePicker && (
            <DateTimePicker
              value={currentDate}
              mode={"time"}
              display="spinner"
              timeZoneName={"utc"}
              minuteInterval={15}
              is24Hour={true}
              onChange={(_event, date) => {
                setShowTimePicker(false);
                onChange(date);
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
