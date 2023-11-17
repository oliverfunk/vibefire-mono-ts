import { useEffect, useLayoutEffect } from "react";
import { View } from "react-native";
import _ from "lodash";

import { FormTitleTextInput } from "../../_shared";
import { type FormSectionProps } from "./types";

export const EditEventDescription = (props: FormSectionProps) => {
  const {
    editedEventData: eventData,
    setEditedEventData: setEventData,
    setMayProceed,
  } = props;

  useLayoutEffect(() => {
    setMayProceed(!!eventData.title && !!eventData.description);
  }, [eventData, setMayProceed]);

  return (
    <View className="w-full flex-col space-y-4 p-4">
      <View>
        <FormTitleTextInput
          title="Event title"
          inputRequired={!eventData.title}
          fontSize={24}
          onChangeText={(text) => setEventData({ ...eventData, title: text })}
          value={eventData.title}
        />
      </View>

      <View>
        <FormTitleTextInput
          title="Event description"
          inputRequired={!eventData.description}
          multiline={true}
          onChangeText={(text) =>
            setEventData({ ...eventData, description: text })
          }
          value={eventData.description}
        />
      </View>
    </View>
  );
};
