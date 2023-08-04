import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const TodPicker = () => {
  return (
    <ScrollView
      horizontal={true}
      decelerationRate={0}
      snapToInterval={200}
      snapToAlignment={"center"}
    >
      <Text className="bg-yellow-400 align-middle">12am - 5am</Text>
      <Text className="bg-blue-400 align-middle">12am - 5am</Text>
      <Text className="bg-red-400 align-middle">12am - 5am</Text>
    </ScrollView>
  );
};
export { TodPicker };
