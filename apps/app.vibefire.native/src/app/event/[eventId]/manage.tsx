import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useFocusUserAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

const Screen = () => {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();

  useFocusUserAuthedRedirect();

  return <Text>Hello</Text>;
};
export default Screen;
