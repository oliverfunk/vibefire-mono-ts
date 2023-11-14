import { useMemo } from "react";
import { Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useAtom } from "jotai";
import _ from "lodash";

import { type TimeOfDayT } from "@vibefire/models";
import { selectedTimeOfDayAtom } from "@vibefire/shared-state";

export const TimeOfDayPicker = (props: { width: number; height: number }) => {
  const { width, height } = props;

  const [selectedTod, setSelectedTod] = useAtom(selectedTimeOfDayAtom);

  const periods = useMemo(() => {
    return ["All Day", "12am - 6am", "6am - 12pm", "12pm - 6pm", "6pm - 12am"];
  }, []);

  const todToIndexMapping = useMemo(() => {
    return {
      D: 0,
      E: 1,
      M: 2,
      A: 3,
      N: 4,
    };
  }, []);

  return (
    <Carousel
      width={width}
      height={height}
      defaultIndex={todToIndexMapping[selectedTod]}
      loop={false}
      overscrollEnabled={false}
      data={periods}
      panGestureHandlerProps={{
        activeOffsetX: [-10, 10],
      }}
      onSnapToItem={(index) => {
        setSelectedTod(_.invert(todToIndexMapping)[index] as TimeOfDayT);
      }}
      renderItem={({ index, item: period }) => {
        return (
          <View key={index} className="flex-1 items-center justify-center">
            <Text className="text-xl font-bold">{period}</Text>
          </View>
        );
      }}
    />
  );
};
