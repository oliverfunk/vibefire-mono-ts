import { useEffect } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRootNavigationState } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  useBottomSheet,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";

import { mapDisplayableEventsInfoAtom } from "@vibefire/shared-state";

import { bottomSheetCollapsedAtom } from "!/atoms";
import { navHomeWithMinimise } from "!/nav";

export const HANDLE_HEIGHT = 40;

export const HandleWithNavigation = (props: BottomSheetHandleProps) => {
  const { collapse, expand } = useBottomSheet();

  const [bottomSheetCollapsed] = useAtom(bottomSheetCollapsedAtom);
  const [mapEventsInfo] = useAtom(mapDisplayableEventsInfoAtom);

  const nav = useNavigation();
  useRootNavigationState();

  useEffect(() => {
    if (bottomSheetCollapsed) {
      navHomeWithMinimise();
    }
  }, [bottomSheetCollapsed]);

  return (
    <View
      className={`h-[${HANDLE_HEIGHT}] flex-row items-center justify-center overflow-hidden rounded-t-xl bg-neutral-900 px-3`}
    >
      <View className="flex-1 pt-2">
        {nav.canGoBack() && (
          <TouchableOpacity
            className="flex-row items-center space-x-1"
            onPress={() => {
              nav.goBack();
            }}
          >
            <FontAwesome name="chevron-left" size={10} color="white" />
            <Text className="text-white">Back</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-1 items-center justify-center pt-2">
        {bottomSheetCollapsed ? (
          <Pressable
            onPress={() => expand()}
            className="flex-row items-center justify-center space-x-1"
          >
            <FontAwesome
              className="justify-start"
              name="chevron-up"
              size={10}
              color="white"
            />
            <Text className="text-sm text-white">Pull</Text>
            <View className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
              <Text className="text-center text-sm text-white">
                {mapEventsInfo.numberOfEvents}
              </Text>
            </View>
          </Pressable>
        ) : (
          <TouchableOpacity
            onPress={() => collapse()}
            className="flex-row items-center justify-center space-x-1"
          >
            <FontAwesome name="chevron-down" size={10} color="white" />
            <Text className="text-sm text-white">Close</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-1" />
    </View>
  );
};
