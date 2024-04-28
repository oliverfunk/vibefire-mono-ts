import { ActivityIndicator, Text, View } from "react-native";
import { type FallbackProps } from "react-error-boundary";

export const ErrorDisplay = (props: FallbackProps & { textWhite: boolean }) => {
  const { textWhite } = props;
  return (
    <View className="items-center justify-center">
      <Text
        className={`text-center text-lg ${textWhite ? "text-white" : "text-black"}`}
      >
        {props.error ?? "There was an error"}
      </Text>
    </View>
  );
};

export const LoadingDisplay = (props: { loadingWhite: boolean }) => {
  const { loadingWhite } = props;
  return (
    <View className="items-center justify-center">
      <ActivityIndicator
        size="large"
        color={loadingWhite ? "white" : "black"}
      />
    </View>
  );
};
