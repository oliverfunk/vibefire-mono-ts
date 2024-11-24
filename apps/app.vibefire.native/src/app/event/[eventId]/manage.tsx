import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const Screen = () => {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();

  console.log("hello manage");

  return <Text>Hello</Text>;
};
export default Screen;
