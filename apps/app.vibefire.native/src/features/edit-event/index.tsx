import { useRef } from "react";
import { Text } from "react-native";
import composeHooks from "react-hooks-compose";

import {
  ErrorSheet,
  LoadingSheet,
  ScrollViewSheetWithRef,
} from "~/components/bottom-panel/_shared";
import { withSuspenseErrorBoundary } from "~/components/SuspenseWithError";
import { trpc } from "~/apis/trpc-client";

function ErrorFallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return <ErrorSheet message="Couldn't load the event" />;
}

export const EditEventWysiwygForm = (props: { eventLinkId: string }) => {
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
};

export const EditEventWysiwyg = withSuspenseErrorBoundary(
  EditEventWysiwygForm,
  {
    LoadingFallback: <LoadingSheet />,
    ErrorFallback,
  },
);
