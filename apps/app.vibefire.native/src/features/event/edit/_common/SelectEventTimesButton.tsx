import React, { useCallback, useState, type ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { DateTime } from "luxon";

import { type TModelVibefireEvent } from "@vibefire/models";
import { isoNTZToUTCDateTime, nowAsUTCNoMins } from "@vibefire/utils";

import { EventInfoTimesBar } from "!/components/event/EventInfoBars";

export const SelectEventTimesButton = (props: {
  event: TModelVibefireEvent;
  onSetStart: (d: Date) => void;
  onSetEnd: (d: Date | null) => void;
}) => {
  const { event, onSetStart, onSetEnd } = props;

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = useCallback(() => {
    const options = [
      "Set start time",
      "Set end time",
      "Clear end time",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            setShowStartPicker(true);
            break;
          case 1:
            setShowEndPicker(true);
            break;
          case 2:
            onSetEnd(null);
            break;

          case cancelButtonIndex:
            break;
        }
      },
    );
  }, [onSetEnd, showActionSheetWithOptions]);

  return (
    <TouchableOpacity onPress={onPress}>
      <DateTimePickerModal
        isVisible={showStartPicker}
        date={
          event.times.tsStart
            ? isoNTZToUTCDateTime(event.times.tsStart).toJSDate()
            : nowAsUTCNoMins().toJSDate()
        }
        mode="datetime"
        locale="utc"
        timeZoneName="UTC"
        minuteInterval={15}
        onConfirm={(date) => {
          setShowStartPicker(false);
          if (date) onSetStart(date);
        }}
        onCancel={() => {
          setShowStartPicker(false);
        }}
        onError={(_) => {
          setShowStartPicker(false);
        }}
        maximumDate={new Date(2030, 1, 1)}
        minimumDate={new Date(2020, 1, 1)}
      />
      <DateTimePickerModal
        isVisible={showEndPicker}
        date={
          event.times.tsEnd
            ? isoNTZToUTCDateTime(event.times.tsEnd).toJSDate()
            : nowAsUTCNoMins().toJSDate()
        }
        mode="datetime"
        locale="utc"
        timeZoneName="UTC"
        minuteInterval={15}
        onConfirm={(date) => {
          setShowEndPicker(false);
          if (date) onSetEnd(date);
        }}
        onCancel={() => {
          setShowEndPicker(false);
        }}
        onError={(_) => {
          setShowEndPicker(false);
        }}
        maximumDate={new Date(2030, 1, 1)}
        minimumDate={new Date(2020, 1, 1)}
      />
      <EventInfoTimesBar
        event={event}
        noStartTimeText="(Set a start time)"
        noEndTimeText="(Set an end time)"
      />
    </TouchableOpacity>
  );
};
