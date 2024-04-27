import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useBottomSheet } from "@gorhom/bottom-sheet";

import { VibefireIconImage } from "!/components/utils/VibefireIconImage";
import { trpc } from "!/api/trpc-client";
import { navCreateEvent, navEditEvent } from "!/nav";

import {
  FormTitleTextInput,
  ScrollViewSheet,
  SectionHeader,
} from "../../../utils/sheet-utils";

export const CreateEventForm = () => {
  const { close } = useBottomSheet();

  const [createEventState, setCreateEventState] = useState<{
    title: string | undefined;
  }>({
    title: undefined,
  });

  const createEventMut = trpc.events.createEvent.useMutation();

  return (
    <ScrollViewSheet>
      <SectionHeader
        text="To create an event, set the title and press start. This will create a
            draft which you can edit anytime. After your event is ready,
            publish and share it!"
      />

      <View className="w-full flex-col space-y-4 px-4 py-4">
        <View>
          <FormTitleTextInput
            title="Event title"
            fontSize={24}
            onChangeText={(text) => setCreateEventState({ title: text })}
            value={createEventState.title}
          />
        </View>

        <View className="flex-row justify-around">
          <TouchableOpacity
            className="rounded-lg border bg-white px-4 py-2"
            onPress={() => {
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
              const { linkId } = await createEventMut.mutateAsync({
                title: createEventState.title,
              });
              close();
              navEditEvent(linkId);
            }}
          >
            <Text className="text-xl text-white">Start</Text>
          </TouchableOpacity>
        </View>

        <View className="h-[1] bg-black" />

        <TouchableOpacity
          className="rounded-lg bg-black px-4 py-2"
          onPress={() => {
            navCreateEvent({ fromPrevious: true });
          }}
        >
          <Text className="text-center text-xl text-white">
            + From previous
          </Text>
        </TouchableOpacity>
      </View>
      <VibefireIconImage />
    </ScrollViewSheet>
  );
};
