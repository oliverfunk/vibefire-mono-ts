import { useLocalSearchParams } from "expo-router";

import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";

import { CreateEvent } from "!/features/event/create";

const Screen = () => {
  const { fromPrevious } = useLocalSearchParams<{
    fromPrevious?: string;
  }>();

  useExpandBottomSheet();

  return <CreateEvent fromPrevious={!!fromPrevious} />;
};
export default Screen;
