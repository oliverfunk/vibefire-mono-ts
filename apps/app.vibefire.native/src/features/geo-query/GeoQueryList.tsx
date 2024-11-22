import { useAtom } from "jotai";

import { mapDisplayableEventsAtom } from "@vibefire/shared-state";

import { EventsFlashListSheet } from "!/components/event/EventsList";
import { navViewEvent } from "!/nav";

export const GeoQueryListSheet = () => {
  const [mapDisplayableEvents] = useAtom(mapDisplayableEventsAtom);

  return (
    <EventsFlashListSheet
      events={mapDisplayableEvents}
      noEventsMessage="No events in this area"
      onEventPress={(_eventId, event) => {
        navViewEvent(event.id!);
      }}
    />
  );
};
