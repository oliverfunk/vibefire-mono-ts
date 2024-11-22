import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { FontAwesome6 } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";

import { type TModelVibefireEvent } from "@vibefire/models";

const MapLocationView = (props: { event: TModelVibefireEvent }) => {
  const { event } = props;

  return (
    <View>
      <Text className="pb-2 text-2xl font-bold text-white">Location</Text>
      <Pressable
        className="flex-row items-center space-x-2 px-2 pb-2"
        onPress={() => {
          Clipboard.setString(event.location.addressDescription);
          Toast.show({
            type: "success",
            text1: "Address copied",
            position: "bottom",
            bottomOffset: 50,
            visibilityTime: 1000,
          });
        }}
      >
        <FontAwesome6 name="map-pin" size={20} color="white" />
        <Text className="text-sm text-white">
          {event.location.addressDescription}
        </Text>
      </Pressable>

      <Text className="pb-2 text-center text-sm text-white">
        (Tap to view on the map)
      </Text>
    </View>
  );
};
