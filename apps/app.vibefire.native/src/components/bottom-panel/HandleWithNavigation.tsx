import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useRootNavigationState, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  useBottomSheet,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";

import { mapDisplayableEventsInfoAtom } from "@vibefire/shared-state";

import { bottomSheetCollapsedAtom } from "!/atoms";

export const HANDLE_HEIGHT = 40;

export const HandleWithNavigation = (props: BottomSheetHandleProps) => {
  const { collapse, expand } = useBottomSheet();

  const [bottomSheetCollapsed] = useAtom(bottomSheetCollapsedAtom);
  const [mapEventsInfo] = useAtom(mapDisplayableEventsInfoAtom);
  const [firstRun, setFirstRun] = useState(false);

  const router = useRouter();
  // refreshes this component when the navigation state changes
  const { routes } = useRootNavigationState();

  // console.log("routes", JSON.stringify(routes, null, 2));

  useEffect(() => {
    if (!firstRun) {
      setFirstRun(true);
      return;
    }
    if (bottomSheetCollapsed) {
      if (router.canGoBack()) {
        router.dismissAll();
      } else {
        //! todo: this might cause issues when deeplinking
        router.replace("/");
      }
    }
    // specifically ignore firstRun
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomSheetCollapsed, router]);

  return (
    // The pt-1 is to adjust for the the padding applied to the bp content
    // otherwise it looks too squashed to the top
    <View
      className="flex-row items-center justify-center rounded-t-xl bg-neutral-900 px-3 pt-1"
      style={{ height: HANDLE_HEIGHT }}
    >
      <View className="flex-1">
        {router.canGoBack() && (
          <TouchableOpacity
            className="flex-row items-center space-x-1"
            onPress={() => {
              router.back();
            }}
          >
            <FontAwesome name="chevron-left" size={10} color="white" />
            <Text className="text-md text-white">Back</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-1 items-center justify-center">
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
            <Text className="text-md text-white">Pull</Text>
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
            <Text className="text-md text-white">Close</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-1" />
    </View>
  );
};
