import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";

import { BottomPanel } from "~/components/bottom-panel/BottomPanel";
import { EventMap } from "~/components/event/EventMap";
import { NoTopContainer } from "~/components/NoTopContainer";

const Home = () => {
  const params = useLocalSearchParams<{
    eventId?: string;
    orgId?: string;
    manageEvent?: string;
    eventsBy?: string;
    editEvent?: string;
    create?: string;
  }>();

  const url = Linking.useURL();

  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams,
      )}`,
    );
  }

  console.log("routing params");
  console.log(JSON.stringify(params, null, 2));

  return (
    <NoTopContainer>
      <EventMap />
      <BottomPanel
        eventID={params.eventId}
        orgID={params.orgId}
        manageEvent={params.manageEvent}
        eventsBy={params.eventsBy}
        editEvent={params.editEvent}
        create={params.create}
      />
    </NoTopContainer>
  );
};
export default Home;
