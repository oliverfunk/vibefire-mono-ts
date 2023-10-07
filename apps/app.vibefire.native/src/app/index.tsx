import { useLocalSearchParams } from "expo-router";

import { BottomPanel } from "~/components/bottom-panel/BottomPanel";
import { EventMap } from "~/components/EventMap";
import { NoTopContainer } from "~/components/NoTopContainer";

const Home = () => {
  const params = useLocalSearchParams<{
    eventId?: string;
    orgId?: string;
    manageEvent?: string;
  }>();

  console.log("routing params");
  console.log(JSON.stringify(params, null, 2));

  return (
    <NoTopContainer>
      <EventMap />
      <BottomPanel
        eventID={params.eventId}
        orgID={params.orgId}
        manageEvent={params.manageEvent}
      />
    </NoTopContainer>
  );
};
export default Home;
