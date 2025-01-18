import React, { useCallback } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

import { type TModelVibefireEvent } from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { trpc } from "!/api/trpc-client";

import { TextB } from "!/components/atomic/text";
import { BContN } from "!/components/atomic/view";
import {
  EventCardFlashListViewSheet,
  EventsSimpleListCardView,
} from "!/components/event/EventsList";
import {
  SheetScrollViewGradient,
  SheetScrollViewGradientVF,
} from "!/components/layouts/SheetScrollViewGradientVF";
import { useItemSeparator } from "!/components/misc/ItemSeparator";
import { VibefireLogoName } from "!/components/VibefireBottomLogo";
import { navEditEvent } from "!/nav";

export const CreateEventFromPreviousSheet = () => {
  const [managedByUser] = trpc.events.listSelfAllManage.useSuspenseQuery({});
  const createFromPreviousMut = trpc.events.createFromPrevious.useMutation();
  const router = useRouter();

  const itemSep = useItemSeparator(4);

  const createFromPrevious = useCallback(
    async (event: PartialDeep<TModelVibefireEvent>) => {
      try {
        const res = await createFromPreviousMut.mutateAsync({
          fromPreviousEventId: event.id!,
        });
        if (res.ok) {
          navEditEvent(router, res.value.event.id, {
            manner: "replace",
          });
        } else {
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
          createFromPreviousMut.reset();
        }, 3000);
      }
    },
    [createFromPreviousMut, router],
  );

  if (!managedByUser.ok) {
    throw managedByUser.error;
  }

  const events = managedByUser.value.data;

  if (events.length <= 3) {
    return (
      <SheetScrollViewGradientVF>
        <BContN>
          <TextB>Select an event to create a new event from.</TextB>
        </BContN>
        <EventsSimpleListCardView
          showStatus={true}
          events={events}
          limit={4}
          onItemPress={createFromPrevious}
          ItemSeparatorComponent={itemSep}
        />
      </SheetScrollViewGradientVF>
    );
  }

  return (
    <SheetScrollViewGradient>
      <BContN>
        <TextB>Select an event to create a new event from.</TextB>
      </BContN>
      <View>
        <EventCardFlashListViewSheet
          events={events}
          ItemSeparatorComponent={itemSep}
          showStatus={true}
          onEventPress={(event) => {
            navEditEvent(router, event.id!);
          }}
          ListFooterComponent={
            <View className="pt-4">
              <VibefireLogoName />
            </View>
          }
        />
      </View>
    </SheetScrollViewGradient>
  );
};
