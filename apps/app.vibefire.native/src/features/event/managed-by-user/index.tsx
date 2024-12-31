import React from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

import { trpc } from "!/api/trpc-client";

import { TextB } from "!/components/atomic/text";
import { BContN } from "!/components/atomic/view";
import { EventCardFlashListViewSheet } from "!/components/event/EventsList";
import { SheetScrollViewGradientVF } from "!/components/layouts/SheetScrollViewGradientVF";
import { useItemSeparator } from "!/components/misc/ItemSeparator";
import { navEditEvent } from "!/nav";

export const ManagedByUserSheet = () => {
  const [managedByUser] = trpc.events.listSelfAllManage.useSuspenseQuery({});

  const router = useRouter();

  const itemSep = useItemSeparator(4);

  if (!managedByUser.ok) {
    throw managedByUser.error;
  }

  const events = managedByUser.value.data;

  return (
    <SheetScrollViewGradientVF>
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
        />
      </View>
    </SheetScrollViewGradientVF>
  );
};
