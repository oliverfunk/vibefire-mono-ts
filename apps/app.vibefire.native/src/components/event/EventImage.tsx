import { useMemo, useState } from "react";
import { Image, type ImageProps } from "expo-image";

import { imgUrl } from "!/api/base-urls";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const StandardImage = (props: {
  source: ImageProps["source"];
  cn?: ImageProps["className"];
  alt?: ImageProps["alt"];
}) => {
  const { source, cn, alt } = props;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <Image
      className={cn}
      source={source}
      alt={alt}
      cachePolicy={"memory"}
      placeholder={blurhash}
      onLoadStart={() => {
        setIsLoading(true);
      }}
      onLoadEnd={() => {
        setIsLoading(false);
      }}
      contentFit="cover"
      transition={500}
    />
  );
};

export const EventImage = (props: {
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
      cn={`aspect-[4/4] w-full ${rounded ? "rounded-xl" : ""}`}
      source={imgSourceUrl}
      alt={alt}
    />
  );
};
