import { Image, type ImageProps } from "expo-image";

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
}) => (
  <Image
    className={cn}
    source={source}
    alt={alt}
    cachePolicy={"none"}
    placeholder={blurhash}
    contentFit="cover"
    transition={1000}
  />
);

export const EventImage = ({
  source,
  alt,
  rounded = false,
}: {
  source: ImageProps["source"];
  alt: ImageProps["alt"];
  rounded?: boolean;
}) => (
  <StandardImage
    cn={`aspect-[4/4] w-full ${rounded ? "rounded-xl" : ""}`}
    source={source}
    alt={alt}
  />
);
