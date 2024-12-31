import { View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";

import { mapDisplayableEventsAtom } from "@vibefire/shared-state";

import { EventCardFlashListViewSheet } from "!/components/event/EventsList";
import { SheetScrollViewGradientVF } from "!/components/layouts/SheetScrollViewGradientVF";
import { useItemSeparator } from "!/components/misc/ItemSeparator";
import { navViewEvent } from "!/nav";

export const GeoQueryListSheet = () => {
  const [mapDisplayableEvents] = useAtom(mapDisplayableEventsAtom);
  const router = useRouter();

  const itemSep = useItemSeparator(4);

  return (
    <SheetScrollViewGradientVF>
      <View>
        <EventCardFlashListViewSheet
          events={mapDisplayableEvents}
          ItemSeparatorComponent={itemSep}
          onEventPress={(event) => {
            navViewEvent(router, event.id!);
          }}
        />
      </View>
    </SheetScrollViewGradientVF>
  );
};
