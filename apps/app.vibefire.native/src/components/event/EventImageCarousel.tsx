import { ImageCarousel } from "../image/ImageCarousel";
import { EventImage } from "./EventImage";

export const EventImageCarousel = (props: {
  imgIdKeys: string[];
  width: number;
  offsetXToActive?: number;
}) => {
  const { imgIdKeys: imgIdKeys, width, offsetXToActive = 10 } = props;

  return (
    <ImageCarousel
      imgIdKeys={imgIdKeys}
      width={width}
      renderItem={({ index, item: imgIdKey }) => {
        return <EventImage imgIdKey={imgIdKey} alt={`Image ${index}`} />;
      }}
      offsetXToActive={offsetXToActive}
    />
  );
};
