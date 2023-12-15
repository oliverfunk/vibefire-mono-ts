import { useLayoutEffect } from "react";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";

import { BottomPanel } from "~/components/bottom-panel/BottomPanel";
import { EventMap } from "~/components/event/EventMap";
import { NoTopContainer } from "~/components/NoTopContainer";
import { navViewEvent } from "~/nav";

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

  useLayoutEffect(() => {
    if (url) {
      const { hostname, path, queryParams } = Linking.parse(url);
      if (path) {
        const [pathDirective, data] = path.split("/").filter((x) => x !== "");
        console.log(
          `deeplink - pathDirective: ${pathDirective}, data: ${data}`,
        );
        if (pathDirective === "e") {
          navViewEvent(data);
        }
      }

      console.log(
        `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
          queryParams,
        )}`,
      );
    }
  }, [url]);

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
