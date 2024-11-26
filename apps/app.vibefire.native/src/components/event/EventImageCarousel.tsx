import { ImageCarousel } from "!/c/image/ImageCarousel";
import { VibefireImage } from "!/c/image/VibefireImage";

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
        return <VibefireImage imgIdKey={imgIdKey} alt={`Image ${index}`} />;
      }}
      offsetXToActive={offsetXToActive}
    />
  );
};
