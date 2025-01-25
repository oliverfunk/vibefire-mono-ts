import { memo, type PropsWithChildren } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeAreaViewNoTopComponent = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: 0,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
      }}
    >
      {children}
    </View>
  );
};
export const NoTopContainer = memo(SafeAreaViewNoTopComponent);
