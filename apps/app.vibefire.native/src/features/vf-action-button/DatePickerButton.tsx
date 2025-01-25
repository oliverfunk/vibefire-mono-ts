import React, { useState } from "react";
import { TouchableOpacity, type TouchableOpacityProps } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { DateTime } from "luxon";

import { selectedDateDTAtom } from "@vibefire/shared-state";

import { TextB } from "!/components/atomic/text";

export const DatePickerButton = (props: TouchableOpacityProps) => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateDTAtom);

  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <TouchableOpacity
      {...props}
      className="flex-row items-center justify-center space-x-1"
      onPress={() => {
        setShowDatePicker(true);
      }}
    >
      <DateTimePickerModal
        isVisible={showDatePicker}
        date={selectedDate.toJSDate()}
        mode="date"
        locale="utc"
        onConfirm={(date) => {
          setShowDatePicker(false);
          if (date) setSelectedDate(DateTime.fromJSDate(date));
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
        onError={(_) => {
          setShowDatePicker(false);
        }}
        maximumDate={new Date(2030, 1, 1)}
        minimumDate={new Date(2020, 1, 1)}
      />
      <MaterialIcons name="event" size={18} color="white" />
      <TextB>{selectedDate.toFormat("d")}</TextB>
    </TouchableOpacity>
  );
};
