import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { type CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";

const PaginationItem = (props: {
  index: number;
  length: number;
  animValue: SharedValue<number>;
}) => {
  // if I ever come back
  const { animValue, index, length } = props;
  const width = 1;

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
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            animValue?.value,
            inputRange,
            outputRangeScale,
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length, width]);

  return (
    <View className={`overflow-hidden rounded-full bg-white p-[${width}px]`}>
      <Animated.View
        className={`rounded-full bg-black p-1`}
        style={animStyle}
      />
    </View>
  );
};

export const ImageCarousel = (props: {
  imgIdKeys: string[];
  width: number;
  renderItem: (r: CarouselRenderItemInfo<string>) => React.JSX.Element;
  offsetXToActive?: number;
}) => {
  const {
    imgIdKeys: imgIdKeys,
    width,
    renderItem,
    offsetXToActive = 10,
  } = props;

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
        data={imgIdKeys}
        panGestureHandlerProps={{
          activeOffsetX: [-offsetXToActive, offsetXToActive],
        }}
        renderItem={renderItem}
      />
      {imgIdKeys.length > 1 && (
        <View className="absolute top-0 w-full items-center justify-center pt-2">
          <View className="flex-row space-x-2 rounded-md bg-gray-800/10 p-1">
            {imgIdKeys.map((_, index) => {
              return (
                <View key={index}>
                  <PaginationItem
                    animValue={progressValue}
                    index={index}
                    length={imgIdKeys.length}
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
