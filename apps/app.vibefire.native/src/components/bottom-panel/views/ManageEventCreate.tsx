import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useBottomSheet } from "@gorhom/bottom-sheet";

import { trpc } from "~/apis/trpc-client";
import {
  LinearRedOrangeView,
  navManageEventClose,
  navManageEventEditDescription,
  ScrollViewSheet,
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
    <ScrollViewSheet>
      <View className="my-5 flex h-full flex-col items-center space-y-10">
        {/* Heading */}
        <View className="mt-5 flex-row">
          <Text className="text-center text-2xl font-bold">Create event</Text>
        </View>

        <LinearRedOrangeView className="flex-row p-4">
          <View className="w-full bg-black p-4">
            <Text className="text-lg text-white">
              To get started, set an event title and press start. This will
              create a draft event which you can add to anytime! After the event
              is ready, it can be published and shared.
            </Text>
          </View>
        </LinearRedOrangeView>

        <View className="w-full flex-col">
          <Text className="mx-5 text-lg">Event title:</Text>
          <View className="mx-4 rounded-lg bg-slate-200">
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
    </ScrollViewSheet>
  );
};
