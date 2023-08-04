import { useLocalSearchParams } from "expo-router";

import { BottomPanel } from "~/components/BottomPanel";
import { EventMap } from "~/components/EventMap";
import { NoTopContainer } from "~/components/NoTopContainer";

const Home = () => {
  // hooks
  const params = useLocalSearchParams<{
    event?: string;
    org?: string;
    mp?: string;
  }>();

  //mapPosition={params.mp}
  return (
    <NoTopContainer>
      <EventMap />
      <BottomPanel eventID={params.event} orgID={params.org} />
    </NoTopContainer>
  );
};
export default Home;
