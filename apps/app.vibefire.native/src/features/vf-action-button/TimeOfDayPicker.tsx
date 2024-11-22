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
    "12 am - 6 am",
    "6 am - 12 pm",
    "12 pm - 6 pm",
    "6 pm - 12 am",
  ]);

  const [todToIndexMapping] = useState({
    D: 0,
    E: 1,
    M: 2,
    A: 3,
    N: 4,
  });

  return (
    <View>
      <Carousel
        // height={height}
        width={width}
        defaultIndex={todToIndexMapping[selectedTod]}
        loop={true}
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
            <View key={index} className="h-full items-center justify-center">
              <Text className="text-base text-white">{period}</Text>
            </View>
          );
        }}
      />

      <Pressable
        className="absolute right-0 h-full justify-center"
        onPress={() => {
          // the ai wrote this
          setSelectedTod(
            _.invert(todToIndexMapping)[
              (todToIndexMapping[selectedTod] + 1) % 5
            ] as TimeOfDayT,
          );
        }}
      >
        <MaterialIcons name="navigate-next" size={20} color="white" />
      </Pressable>

      <Pressable
        className="absolute left-0 h-full justify-center "
        onPress={() => {
          setSelectedTod(
            _.invert(todToIndexMapping)[
              (todToIndexMapping[selectedTod] + 4) % 5
            ] as TimeOfDayT,
          );
        }}
      >
        <MaterialIcons name="navigate-before" size={20} color="white" />
      </Pressable>
    </View>
  );
};
