import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

import { trpc } from "!/api/trpc-client";

import { SheetBasicColourfulVF } from "!/components/layouts/SheetBasicColourfulVF";
import { FormTextInput } from "!/c/misc/sheet-utils";
import { navCreateEventFromPrevious, navEditEvent } from "!/nav";

export const CreateEventSheet = () => {
  const [createEventState, setCreateEventState] = useState<{
    title: string | undefined;
  }>({
    title: undefined,
  });

  const [isInErrorState, setIsInErrorState] = useState(false);

  const createEventMut = trpc.events.createForSelf.useMutation();

  const router = useRouter();

  return (
    <SheetBasicColourfulVF>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-col items-center space-y-4 rounded-lg bg-black p-4">
          <Text className="text-xl font-bold text-white">Create an event</Text>
          <Text className="text-md text-white">
            Set the event title to get started creating your event.
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
                try {
                  const res = await createEventMut.mutateAsync({
                    accessType: "open",
                    name: createEventState.title,
                  });
                  if (res.ok) {
                    navEditEvent(router, res.value.event.id, {
                      manner: "replace",
                    });
                  } else {
                    setIsInErrorState(true);
                    Toast.show({
                      type: "error",
                      text1: res.error.message,
                      position: "bottom",
                      bottomOffset: 50,
                      visibilityTime: 4000,
                    });
                  }
                } finally {
                  setTimeout(() => {
                    createEventMut.reset();
                    setIsInErrorState(false);
                  }, 3000);
                }
              }}
            >
              {isInErrorState || createEventMut.status === "error" ? (
                <FontAwesome5
                  name="exclamation-triangle"
                  size={20}
                  color="red"
                />
              ) : createEventMut.status === "pending" ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <FontAwesome5 name="arrow-right" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* dividing line */}
          <View className="h-[1] w-full bg-white" />

          <Text className="text-md text-white">
            To create a new event using a previous one, tap the button below.
          </Text>
          <TouchableOpacity
            className="rounded-lg bg-white px-4 py-2"
            onPress={() => {
              navCreateEventFromPrevious(router);
            }}
          >
            <Text className="text-center text-black">+ From previous</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SheetBasicColourfulVF>
  );
};
