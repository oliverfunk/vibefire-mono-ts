import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { trpc } from "!/api/trpc-client";

import { SheetBasicColourfulVF } from "!/components/layouts/SheetBasicColourfulVF";
import { FormTextInput, FormTitleTextInput } from "!/c/misc/sheet-utils";
import { navCreateEventFromPrevious, navEditEvent } from "!/nav";

export const CreateEventForm = () => {
  const [createEventState, setCreateEventState] = useState<{
    title: string | undefined;
  }>({
    title: undefined,
  });

  const createEventMut = trpc.events.createForSelf.useMutation();

  return (
    <SheetBasicColourfulVF>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-col items-center space-y-4 rounded-lg bg-neutral-900 p-4">
          <Text className="text-xl font-bold text-white">Create an event</Text>
          <Text className="text-md text-white">
            To start creating your event, set the title and tap{" "}
            <Text className="font-bold text-white">{"Let's go!"}</Text>
            {"\n\n"}This will create a draft which you can edit and come back to
            anytime.
          </Text>
          <View className="w-full flex-row space-x-2">
            <FormTextInput
              placeholder="Event title"
              onChangeText={(text) => setCreateEventState({ title: text })}
              value={createEventState.title}
            />
            <TouchableOpacity
              className="rounded-lg border bg-green-500 px-4 py-2"
              onPress={async () => {
                if (!createEventState.title) {
                  return;
                }
                const res = await createEventMut.mutateAsync({
                  eventType: "event-private",
                  name: createEventState.title,
                });
                console.log(JSON.stringify(res, null, 2));
                if (res.ok) {
                  navEditEvent(res.value.id);
                } else {
                  Toast.show({
                    type: "error",
                    text1: "There was an issue creating your event",
                    position: "bottom",
                    bottomOffset: 50,
                    visibilityTime: 4000,
                  });
                }
              }}
            >
              <Text className="text-md font-bold text-white">Lets go!</Text>
            </TouchableOpacity>
          </View>

          <View className="h-[1] w-full bg-white" />

          <Text className="text-md text-white">
            To create a new event using a previous one, tap the button below.
          </Text>

          <TouchableOpacity
            className="rounded-lg bg-white px-4 py-2"
            onPress={() => {
              navCreateEventFromPrevious();
            }}
          >
            <Text className="text-center text-black">+ From previous</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SheetBasicColourfulVF>
  );
};
