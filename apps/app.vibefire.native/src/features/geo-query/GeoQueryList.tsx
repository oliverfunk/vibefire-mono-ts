import { View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";

import { mapDisplayableEventsAtom } from "@vibefire/shared-state";

import { EventsFlashListSheet } from "!/components/event/EventsList";
import { VibefireLogoName } from "!/components/VibefireBottomLogo";
import { navViewEvent } from "!/nav";

export const GeoQueryListSheet = () => {
  const [mapDisplayableEvents] = useAtom(mapDisplayableEventsAtom);
  const router = useRouter();

  if (mapDisplayableEvents.length > 1) {
    return (
      <EventsFlashListSheet
        events={mapDisplayableEvents}
        vibefireFooter={true}
        onEventPress={(_eventId, event) => {
          navViewEvent(router, event.id!);
        }}
      />
    );
  }

  return (
    <>
      <EventsFlashListSheet
        events={mapDisplayableEvents}
        noEventsMessage="No events in this area"
        onEventPress={(_eventId, event) => {
          navViewEvent(router, event.id!);
        }}
      />
      <View className="p-4">
        <VibefireLogoName />
      </View>
    </>
  );
};
