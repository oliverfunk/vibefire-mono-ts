import { useMemo } from "react";
import { type ImageProps } from "expo-image";

import { imgUrl } from "!/api/base-urls";

import { StandardImage } from "!/c/image/StandardImage";

export const VibefireImage = (props: {
  imgIdKey?: string;
  alt?: ImageProps["alt"];
  rounded?: boolean;
}) => {
  const { imgIdKey, alt, rounded } = props;

  const imgSourceUrl = useMemo(() => {
    if (!imgIdKey) {
      return "";
    }
    if (imgIdKey.startsWith("http")) {
      return imgIdKey;
    }
    return imgUrl(imgIdKey + "/public");
  }, [imgIdKey]);

  return (
    <StandardImage
      cn={`aspect-[4/4] w-full ${rounded ? "rounded-2xl" : ""}`}
      contentFit="cover"
      source={imgSourceUrl}
      alt={alt}
    />
  );
};
