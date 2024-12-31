import { useLocalSearchParams } from "expo-router";

import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";
import { useOnFocusUserNotAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

import {
  CreateEventFromPreviousSheet,
  CreateEventSheet,
} from "!/features/event/create";
import { ErrorSheet, LoadingSheet } from "!/components/misc/sheet-utils";
import { SuspenseWithError } from "!/components/misc/SuspenseWithError";

const Screen = () => {
  const { fromPrevious } = useLocalSearchParams<{
    fromPrevious?: string;
  }>();

  useOnFocusUserNotAuthedRedirect();
  useExpandBottomSheet();

  return (
    <SuspenseWithError
      LoadingFallback={<LoadingSheet />}
      ErrorFallback={({ error, resetErrorBoundary }) => (
        <ErrorSheet retryCallback={resetErrorBoundary} />
      )}
    >
      {fromPrevious ? <CreateEventFromPreviousSheet /> : <CreateEventSheet />}
    </SuspenseWithError>
  );
};
export default Screen;
