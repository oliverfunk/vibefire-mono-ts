import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

export const TimePeriodPicker = (props: { width: number; height: number }) => {
  const { width, height } = props;

  const periods = useMemo(() => {
    return ["1", "2", "3", "4", "5"];
  }, []);

  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);

  console.log("selectedPeriod", selectedPeriod);

  return (
    <Carousel
      width={width}
      height={height}
      defaultIndex={0}
      loop={false}
      overscrollEnabled={false}
      data={periods}
      panGestureHandlerProps={{
        activeOffsetX: [-10, 10],
      }}
      onSnapToItem={(index) => {
        setSelectedPeriod(periods[index]);
      }}
      renderItem={({ index, item: period }) => {
        return (
          <View key={index} className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold">{period}</Text>
          </View>
        );
      }}
    />
  );
};
