import { forwardRef, useMemo, type Ref } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

// import { DateTime } from "luxon";

// import { SEARCH_HANDLE_HEIGHT, SearchHandle } from "../SearchHandle";

const _EventDetails = (
  props: { eventId?: string },
  ref: Ref<BottomSheetModalMethods>,
) => {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["80%"], []);

  // const renderBackdrop = useCallback(
  //   (props: BottomSheetDefaultBackdropProps) => (
  //     <BottomSheetBackdrop
  //       {...props}
  //       disappearsOnIndex={0}
  //       appearsOnIndex={1}
  //       pressBehavior={"collapse"}
  //     />
  //   ),
  //   [],
  // );

  return (
    <BottomSheetModal
      ref={ref}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={snapPoints}
      onDismiss={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router.setParams({ eventId: undefined });
      }}
    >
      <BottomSheetView>
        <Text className="text-center">Awesome 🔥</Text>
        <View className="my-1 bg-black py-3">
          <Pressable onPress={() => {}}>
            <Text className="text-white">Click</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
export const EventDetails = forwardRef(_EventDetails);
