/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { View } from "react-native";
import { ImageBackground } from "expo-image";

export type VibefireIconImageVarient =
  | "logo-vf"
  | "logo-vf-white"
  | "logo-vf-black"
  | "map-marker-neutral"
  | "map-marker-neutral-alt";

const VibefireIconImageVariantConfig = (variant: VibefireIconImageVarient) => {
  switch (variant) {
    case "logo-vf":
      return {
        width: 566,
        height: 463,
        imp: require("#/app/logo/logo-vf.svg"),
      };
    case "logo-vf-white":
      return {
        width: 566,
        height: 463,
        imp: require("#/app/logo/logo-vf-white.svg"),
      };
    case "logo-vf-black":
      return {
        width: 566,
        height: 463,
        imp: require("#/app/logo/logo-vf-black.svg"),
      };
    case "map-marker-neutral":
      return {
        width: 500,
        height: 750,
        imp: require("#/app/map-marker/map-marker-neutral.svg"),
      };
    case "map-marker-neutral-alt":
      return {
        width: 500,
        height: 750,
        imp: require("#/app/map-marker/map-marker-neutral-alt.svg"),
      };
  }
  throw new Error(`Invalid variant: ${variant}`);
};

export const VibefireIconImage = (props: {
  variant: VibefireIconImageVarient;
  scaleFactor?: number;
  onLoad?: () => void;
}) => {
  const { variant, scaleFactor = 1, onLoad } = props;
  const { width, height, imp } = VibefireIconImageVariantConfig(variant);
  return (
    <ImageBackground
      contentFit="contain"
      contentPosition={"center"}
      alt=""
      style={{ width: width * scaleFactor, height: height * scaleFactor }}
      source={imp}
      transition={0}
      onLoad={onLoad}
    />
  );
};
