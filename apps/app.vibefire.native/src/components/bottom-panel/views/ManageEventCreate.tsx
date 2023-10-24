import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useBottomSheet } from "@gorhom/bottom-sheet";

import { trpc } from "~/apis/trpc-client";
import { navManageEventClose, navManageEventEditDescription } from "~/nav";
import {
  LinearRedOrangeView,
  ScrollViewSheet,
  ScrollViewSheetWithHeader,
} from "../_shared";

export const ManageEventCreate = () => {
  const { close } = useBottomSheet();
  const createEventMS = trpc.events.createEvent.useMutation();
  const [createEventState, setCreateEventState] = useState<{
    title: string | undefined;
  }>({
    title: undefined,
  });
  useEffect(() => {
    if (createEventMS.isSuccess) {
      const { id: eventId } = createEventMS.data;
      if (!eventId) {
        console.error("No event id returned from createEvent mutation");
        return;
      }
      navManageEventEditDescription(eventId);
    }
  }, [createEventMS]);
  return (
    <ScrollViewSheetWithHeader header="Your Events">
      <View className="my-5 flex-col items-center space-y-10">
        <View className="p-4">
          <Text className="text-lg">
            To get started, set an event title and press start. This will create
            a draft event which you can add to anytime! After the event is
            ready, it can be published and shared.
          </Text>
        </View>

        <View className="w-full flex-col px-4">
          <Text className="px-2 text-lg">Event title:</Text>
          <View className="rounded-lg bg-slate-200 p-2">
            <TextInput
              className="ml-4 py-2 text-4xl"
              placeholderTextColor={"#000000FF"}
              onChangeText={(text) => setCreateEventState({ title: text })}
              value={createEventState.title}
              placeholder=""
            />
          </View>
        </View>
        <View className="w-full flex-row justify-around">
          <TouchableOpacity
            className="rounded-lg border bg-white px-4 py-2"
            onPress={() => {
              navManageEventClose();
              close();
            }}
          >
            <Text className="text-xl text-black">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg bg-black px-4 py-2"
            onPress={() => {
              if (!createEventState.title) {
                return;
              }
              createEventMS.mutate({
                title: createEventState.title,
              });
            }}
          >
            <Text className="text-xl text-white">Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollViewSheetWithHeader>
  );
};
