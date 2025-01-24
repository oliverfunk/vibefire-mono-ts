import { useState } from "react";
import { Image, type ImageProps } from "expo-image";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const StandardImage = (props: {
  cn: ImageProps["className"];
  source: ImageProps["source"];
  alt: ImageProps["alt"];
  contentFit: ImageProps["contentFit"];
}) => {
  const { cn, source, alt, contentFit = "cover" } = props;
  const [_isLoading, setIsLoading] = useState(true);

  return (
    <Image
      source={source}
      alt={alt}
      className={cn}
      cachePolicy={"memory"}
      placeholder={blurhash}
      onLoadStart={() => {
        setIsLoading(true);
      }}
      onLoadEnd={() => {
        setIsLoading(false);
      }}
      contentFit={contentFit}
      transition={500}
    />
  );
};
