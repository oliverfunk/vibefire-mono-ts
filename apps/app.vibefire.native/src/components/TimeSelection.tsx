import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { DateTime } from "luxon";

export const TimeSelectionAndDisplayIos = (props: {
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

export const TimeSelectionAndDisplayAnd = (props: {
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
