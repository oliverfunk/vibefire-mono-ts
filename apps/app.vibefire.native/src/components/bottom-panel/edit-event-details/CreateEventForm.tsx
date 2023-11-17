import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useBottomSheet } from "@gorhom/bottom-sheet";

import { trpc } from "~/apis/trpc-client";
import { navEditEvent, navManageEventClose } from "~/nav";
import { FormTitleTextInput, ScrollViewSheetWithHeader } from "../_shared";

export const CreateEventForm = () => {
  const { close } = useBottomSheet();

  const [createEventState, setCreateEventState] = useState<{
    title: string | undefined;
  }>({
    title: undefined,
  });

  const createEventMS = trpc.events.createEvent.useMutation();

  return (
    <ScrollViewSheetWithHeader header="Create Event">
      <View className="w-full flex-col space-y-4 px-4 py-4">
        <Text className="text-lg">
          To get started, set an event title and press start. This will create a
          draft event which you can edit to anytime! After your event is ready,
          it can be published and shared.
        </Text>

        <View>
          <FormTitleTextInput
            title="Event title:"
            fontSize={24}
            onChangeText={(text) => setCreateEventState({ title: text })}
            value={createEventState.title}
          />
        </View>

        <View className="flex-row justify-around">
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
            onPress={async () => {
              if (!createEventState.title) {
                return;
              }
              const { id } = await createEventMS.mutateAsync({
                title: createEventState.title,
              });
              navEditEvent(id);
            }}
          >
            <Text className="text-xl text-white">Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollViewSheetWithHeader>
  );
};
