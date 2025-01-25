import { View } from "react-native";
import { type ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

import { VibefireIconImage } from "./misc/VibefireIconImage";

export const VibefireLogoName = (props: ViewProps) => {
  return (
    <View
      className="flex-row items-center self-center rounded-full bg-black p-2 px-6 pt-3"
      {...props}
    >
      <VibefireIconImage variant="logo-vf-white" scaleFactor={0.06} />
    </View>
  );
};
