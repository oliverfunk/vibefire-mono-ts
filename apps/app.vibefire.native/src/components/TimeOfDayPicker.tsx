import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { MaterialIcons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import _ from "lodash";

import { type TimeOfDayT } from "@vibefire/models";
import { selectedTimeOfDayAtom } from "@vibefire/shared-state";

export const TimeOfDayPicker = (props: { width: number; height: number }) => {
  const { width, height } = props;

  const [selectedTod, setSelectedTod] = useAtom(selectedTimeOfDayAtom);

  const [periods] = useState([
    "All Day",
    "12am - 6am",
    "6am - 12pm",
    "12pm - 6pm",
    "6pm - 12am",
  ]);

  const [todToIndexMapping] = useState({
    D: 0,
    E: 1,
    M: 2,
    A: 3,
    N: 4,
  });

  return (
    <View className="relative flex-row items-center justify-center">
      <Carousel
        width={width}
        height={height}
        defaultIndex={todToIndexMapping[selectedTod]}
        loop={false}
        overscrollEnabled={false}
        data={periods}
        panGestureHandlerProps={{
          activeOffsetX: [-5, 5],
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
      <Pressable
        className="absolute right-1"
        onPress={() => {
          // the ai wrote this
          setSelectedTod(
            _.invert(todToIndexMapping)[
              (todToIndexMapping[selectedTod] + 1) % 5
            ] as TimeOfDayT,
          );
        }}
      >
        <MaterialIcons name="navigate-next" size={20} color="black" />
      </Pressable>
      <Pressable
        className="absolute left-1"
        onPress={() => {
          setSelectedTod(
            _.invert(todToIndexMapping)[
              (todToIndexMapping[selectedTod] + 4) % 5
            ] as TimeOfDayT,
          );
        }}
      >
        <MaterialIcons name="navigate-before" size={20} color="black" />
      </Pressable>
    </View>
  );
};
