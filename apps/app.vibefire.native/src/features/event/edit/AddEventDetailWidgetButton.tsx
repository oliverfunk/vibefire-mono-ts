import { useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome6 } from "@expo/vector-icons";

import { newEventDetailDescModel, type EventDetail } from "@vibefire/models";

export const AddEventDetailWidgetButton = (props: {
  onAdd: (detail: EventDetail) => void;
}) => {
  const { onAdd } = props;

  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = useCallback(() => {
    const options = ["Description", "Cancel"];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        title: "Add widget",
        options,
        cancelButtonIndex,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            // Save
            onAdd(
              newEventDetailDescModel({
                value: "",
              }),
            );
            break;

          case cancelButtonIndex:
            // Canceled
            console.log("Can");
            break;
        }
      },
    );
  }, [onAdd, showActionSheetWithOptions]);

  return (
    <TouchableOpacity
      className="rounded-full border-2 border-white p-2 px-4"
      onPress={onPress}
    >
      <Text className="text-lg text-white">
        <FontAwesome6 name="plus" color="white" size={15} /> Add widget
      </Text>
    </TouchableOpacity>
  );
};
