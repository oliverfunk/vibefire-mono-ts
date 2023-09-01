import { forwardRef, useEffect, useMemo, useState, type Ref } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useFocusEffect } from "@react-navigation/native";

import { trpc } from "~/apis/trpc-client";
import { LinearRedPinkView, LoadingSheet } from "./_shared";

type ManageEventViewLoading = {
  state: "loading";
};
type ManageEventViewError = {
  state: "error";
};
type ManageEventViewCreate = {
  state: "create";
};
type ManageEventViewEdit = {
  state: "edit";
  eventId: string;
};
type ManageEventViewManage = {
  state: "manage";
  eventId: string;
};
type ManageEventViewState =
  | ManageEventViewLoading
  | ManageEventViewError
  | ManageEventViewCreate
  | ManageEventViewEdit
  | ManageEventViewManage;

const _ManageEventCreate = () => {
  const { close } = useBottomSheet();
  const createEventMS = trpc.events.createEvent.useMutation();
  const [createEventState, setCreateEventState] = useState<{
    title: string | undefined;
  }>({
    title: undefined,
  });
  useEffect(() => {
    if (createEventMS.isSuccess) {
      const eventId = createEventMS.data;
      console.log("got eventId");
      if (!eventId) {
        return;
      }
      console.log("eventId", eventId);
      // router.setParams({ manageEvent: `${eventId},edit` });
    }
  }, [createEventMS]);
  return (
    <BottomSheetScrollView
      automaticallyAdjustKeyboardInsets={true}
      focusHook={useFocusEffect}
    >
      <View className="my-5 flex h-full flex-col items-center space-y-10">
        {/* Heading */}
        <View className="mt-5 flex-row">
          <Text className="text-center text-2xl font-bold">Create event</Text>
        </View>

        <LinearRedPinkView className="flex-row p-4">
          <View className="w-full bg-black p-4">
            <Text className="text-lg text-white">
              To get started, set an event title and press start. This will
              create a draft event which you can add to anytime!
            </Text>
          </View>
        </LinearRedPinkView>

        <View className="w-full flex-col">
          <Text className="mx-5 text-lg">Event title:</Text>
          <View className="mx-4 rounded-lg bg-slate-200">
            <TextInput
              className="ml-4 py-2 text-4xl"
              // style={{ fontSize: 80 }}
              placeholderTextColor={"#000000FF"}
              onChangeText={(text) => setCreateEventState({ title: text })}
              value={createEventState.title}
              placeholder=""
              // autoFocus={true}
            />
          </View>
        </View>
        <View className="w-full flex-row justify-around">
          <TouchableOpacity
            className="rounded-lg border bg-white px-4 py-2"
            onPress={() => {
              router.setParams({ manageEvent: undefined });
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
    </BottomSheetScrollView>
  );
};

const _ViewControl = (props: { manageSelect?: string }) => {
  const { manageSelect } = props;

  const [viewState, setViewState] = useState<ManageEventViewState>({
    state: "loading",
  });
  const eventId =
    viewState.state === "manage" || viewState.state == "edit"
      ? viewState.eventId
      : undefined;

  const eventForManagement = trpc.events.eventForManagement.useQuery(
    { eventId: eventId ?? "" },
    {
      enabled: !!eventId,
    },
  );
  // const eventManagement = trpc.events.eventForManagement.useQuery(
  //   { eventId: eventId ?? "" },
  //   {
  //     enabled: !!eventId,
  //   },
  // );
  // const eventId = isCreate ? undefined : eventIdOrCreate;

  useEffect(() => {
    if (!manageSelect) {
      return;
    }
    const selectParts = manageSelect.split(",", 2);
    const eventIdOrCreate = selectParts[0];

    const isCreate = eventIdOrCreate === "create";
    const isEdit = selectParts.at(1) === "edit";

    if (isCreate) {
      setViewState({ state: "create" });
    } else if (isEdit) {
      setViewState({ state: "edit", eventId: eventIdOrCreate });
    } else {
      setViewState({ state: "manage", eventId: eventIdOrCreate });
    }
  }, [manageSelect]);

  switch (viewState.state) {
    case "loading":
      return <LoadingSheet />;
    case "create":
      return <_ManageEventCreate />;
  }
};

const _PreControl = (
  props: { manageSelect?: string },
  ref: Ref<BottomSheetModalMethods>,
) => {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["80%"], []);

  return (
    <BottomSheetModal
      ref={ref}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={snapPoints}
      onDismiss={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router.setParams({ manageEvent: undefined });
      }}
    >
      <_ViewControl manageSelect={props.manageSelect} />
    </BottomSheetModal>
  );
};

export const ManageEvent = forwardRef(_PreControl);
