import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useOnFocusUserNotAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

const Screen = () => {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();

  useOnFocusUserNotAuthedRedirect();

  return <Text>Hello</Text>;
};
export default Screen;
