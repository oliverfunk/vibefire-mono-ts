import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

import { trpc } from "!/api/trpc-client";

import { TextB, TextL, TextLL } from "!/components/atomic/text";
import { BContC, DivLineH } from "!/components/atomic/view";
import { PillTouchableOpacity } from "!/components/button/PillTouchableOpacity";
import { SheetScrollViewGradientVF } from "!/components/layouts/SheetScrollViewGradientVF";
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
    <SheetScrollViewGradientVF>
      <BContC>
        <View className="w-full space-y-4">
          <TextLL className="self-center font-bold">Create an event</TextLL>
          <TextB className="w-full">
            Set the event title to get started creating your event.
            {"\n"}This will create a draft which you can edit and come back to
            anytime.
          </TextB>
          <View className="w-full flex-row space-x-2">
            <FormTextInput
              placeholder="Event title"
              onChangeText={(text) => setCreateEventState({ title: text })}
              value={createEventState.title}
            />
            <PillTouchableOpacity
              className="border-green-500 bg-green-500 px-4"
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
            </PillTouchableOpacity>
          </View>

          <DivLineH />

          <TextB>
            To create a new event using a previous one, tap the button below.
          </TextB>
          <PillTouchableOpacity
            onPress={() => {
              navCreateEventFromPrevious(router);
            }}
          >
            <TextB>+ From previous</TextB>
          </PillTouchableOpacity>
        </View>
      </BContC>
    </SheetScrollViewGradientVF>
  );
};
