import { FC, memo, PropsWithChildren } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeAreaViewNoTopComponent: FC<PropsWithChildren> = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className={`flex-1 items-center justify-center bg-black`}
    >
      {children}
    </View>
  );
};
const NoTopContainer = memo(SafeAreaViewNoTopComponent);
export { NoTopContainer };
