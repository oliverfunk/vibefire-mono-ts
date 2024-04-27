import { useRef } from "react";
import { Text } from "react-native";

import { trpc } from "!/api/trpc-client";

import {
  ErrorSheet,
  LoadingSheet,
  ScrollViewSheetWithRef,
} from "!/components/utils/sheet-utils";
import { withSuspenseErrorBoundary } from "!/components/utils/SuspenseWithError";

function ErrorFallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return <ErrorSheet message="Couldn't load the event" />;
}

export const EditEventWysiwyg = withSuspenseErrorBoundary(
  (props: { eventLinkId: string }) => {
    const { eventLinkId } = props;

    const formRef = useRef(null);

    const [data, query] = trpc.events.eventForEdit.useSuspenseQuery({
      linkId: eventLinkId,
    });

    return (
      <ScrollViewSheetWithRef ref={formRef}>
        <Text>Event Name e:</Text>
        <Text>{data.location?.addressDescription ?? "NONE"}</Text>
      </ScrollViewSheetWithRef>
    );
  },
  {
    LoadingFallback: <LoadingSheet />,
    ErrorFallback,
  },
);
