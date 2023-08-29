import { useLocalSearchParams } from "expo-router";

import { BottomPanel } from "~/components/bottom-panel/BottomPanel";
import { EventMap } from "~/components/EventMap";
import { NoTopContainer } from "~/components/NoTopContainer";

const Home = () => {
  // hooks
  const params = useLocalSearchParams<{
    eventId?: string;
    orgId?: string;
    mp?: string;
  }>();

  return (
    <NoTopContainer>
      <EventMap />
      <BottomPanel eventID={params.eventId} orgID={params.orgId} />
    </NoTopContainer>
  );
};
export default Home;
