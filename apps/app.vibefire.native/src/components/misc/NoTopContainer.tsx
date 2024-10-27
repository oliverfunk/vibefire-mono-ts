import { memo, type PropsWithChildren } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeAreaViewNoTopComponent = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className={`flex-1 items-center justify-center bg-neutral-900`}
    >
      {children}
    </View>
  );
};
const NoTopContainer = memo(SafeAreaViewNoTopComponent);
export { NoTopContainer };
