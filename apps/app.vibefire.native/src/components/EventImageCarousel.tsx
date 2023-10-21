import { View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { type CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";

import { EventImage } from "./EventImage";

const PaginationItem: React.FC<{
  index: number;
  length: number;
  animValue: Animated.SharedValue<number>;
}> = (props) => {
  const { animValue, index, length } = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRangeTranslate = [-width, 0, width];
    let outputRangeScale = [0, 1.1, 0];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRangeTranslate = [-width, 0, width];
      outputRangeScale = [0, 1.1, 0];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRangeTranslate,
            Extrapolate.CLAMP,
          ),
        },
        {
          scale: interpolate(
            animValue?.value,
            inputRange,
            outputRangeScale,
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length, width]);

  return (
    <View
      className={`h-[${width}px] w-[${width}px] overflow-hidden rounded-full bg-white`}
    >
      <Animated.View
        className="bg-black"
        style={[
          {
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

export const EventImageCarousel: React.FC<{
  vfImgKeys: string[];
  width: number;
  renderItem?: ({
    index,
    item,
  }: CarouselRenderItemInfo<string>) => React.JSX.Element;
}> = (props) => {
  const { vfImgKeys, width, renderItem } = props;

  const progressValue = useSharedValue<number>(0);

  return (
    <View className="relative">
      <Carousel
        width={width}
        height={width}
        defaultIndex={0}
        loop={false}
        overscrollEnabled={false}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        data={vfImgKeys}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        renderItem={
          renderItem
            ? renderItem
            : ({ index, item }) => {
                return <EventImage vfImgKey={item} alt={`Image ${index}`} />;
              }
        }
      />
      {!!progressValue && (
        <View className="absolute top-0 w-full items-center justify-center pt-2">
          <View className="flex-row space-x-2 rounded-md bg-gray-800/10 p-1">
            {vfImgKeys.map((_, index) => {
              return (
                <View key={index}>
                  <PaginationItem
                    animValue={progressValue}
                    index={index}
                    length={vfImgKeys.length}
                  />
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};
