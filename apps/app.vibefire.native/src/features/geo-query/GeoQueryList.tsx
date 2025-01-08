import { View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";

import { mapDisplayableEventsAtom } from "@vibefire/shared-state";

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
import { navViewEvent } from "!/nav";

export const GeoQueryListSheet = () => {
  const [mapDisplayableEvents] = useAtom(mapDisplayableEventsAtom);
  const router = useRouter();

  const itemSep = useItemSeparator(4);

  if (mapDisplayableEvents.length <= 3) {
    return (
      <SheetScrollViewGradientVF>
        <EventsSimpleListCardView
          showStatus={false}
          events={mapDisplayableEvents}
          limit={4}
          onItemPress={(event) => {
            navViewEvent(router, event.id!);
          }}
          ItemSeparatorComponent={itemSep}
        />
      </SheetScrollViewGradientVF>
    );
  }

  return (
    <SheetScrollViewGradient>
      <EventCardFlashListViewSheet
        events={mapDisplayableEvents}
        ItemSeparatorComponent={itemSep}
        ListFooterComponent={
          <View className="pt-4">
            <VibefireLogoName />
          </View>
        }
        onEventPress={(event) => {
          navViewEvent(router, event.id!);
        }}
      />
    </SheetScrollViewGradient>
  );
};
