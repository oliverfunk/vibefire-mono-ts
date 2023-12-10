import { useMemo, useState } from "react";
import { Image, type ImageProps } from "expo-image";

import { imgUrl } from "~/apis/base-urls";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const StandardImage = ({
  cn,
  source,
  alt,
}: {
  cn: ImageProps["className"];
  source: ImageProps["source"];
  alt: ImageProps["alt"];
}) => {
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

export const EventImage = ({
  eventId,
  imgIdKey,
  alt,
  rounded = false,
}: {
  eventId: string;
  imgIdKey?: string;
  alt: ImageProps["alt"];
  rounded?: boolean;
}) => {
  const imgSourceUrl = useMemo(() => {
    if (!imgIdKey) {
      return "";
    }
    if (imgIdKey.startsWith("http")) {
      return imgIdKey;
    }
    return imgUrl(imgIdKey + "/public");
  }, [eventId, imgIdKey]);

  return (
    <StandardImage
      cn={`aspect-[4/4] w-full ${rounded ? "rounded-xl" : ""}`}
      source={imgSourceUrl}
      alt={alt}
    />
  );
};
