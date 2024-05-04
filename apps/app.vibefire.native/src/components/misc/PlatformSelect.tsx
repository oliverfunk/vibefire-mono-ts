import { Platform } from "react-native";

export const PlatformSelect = (props: {
  android?: JSX.Element;
  ios?: JSX.Element;
}) => {
  const { android, ios } = props;
  switch (Platform.OS) {
    case "android":
      return android;
    case "ios":
      return ios;
    default:
      throw new Error(`Platform not supported: ${Platform.OS}`);
  }
};
