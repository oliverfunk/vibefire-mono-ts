import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

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

export const ManagedByUserSheet = () => {
  const [managedByUser] = trpc.events.listSelfAllManage.useSuspenseQuery({
    pageLimit: 0,
  });

  const router = useRouter();

  const itemSep = useItemSeparator(4);

  if (!managedByUser.ok) {
    throw managedByUser.error;
  }

  const events = managedByUser.value.data;

  if (events.length <= 3) {
    return (
      <SheetScrollViewGradientVF>
        <BContN>
          <TextB>These are the events you manage.</TextB>
        </BContN>
        <EventsSimpleListCardView
          showStatus={true}
          events={events}
          limit={4}
          onItemPress={(event) => {
            navEditEvent(router, event.id!);
          }}
          ItemSeparatorComponent={itemSep}
        />
      </SheetScrollViewGradientVF>
    );
  }

  return (
    <SheetScrollViewGradient>
      <BContN>
        <TextB>These are the events you manage.</TextB>
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
