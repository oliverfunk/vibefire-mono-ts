import { useRef } from "react";
import { Text } from "react-native";

import { trpc } from "!/api/trpc-client";

import { ApiResponseView } from "!/components/misc/ApiResponseView";
import { ScrollViewSheetWithRef } from "!/c/misc/sheet-utils";
import { withSuspenseErrorBoundarySheet } from "!/c/misc/SuspenseWithError";

export const EditEventWysiwyg = withSuspenseErrorBoundarySheet(
  (props: { eventId: string }) => {
    const { eventId } = props;

    const formRef = useRef(null);

    const [data, viewManageCont] = trpc.events.viewManage.useSuspenseQuery({
      eventId,
    });
    const updateMut = trpc.events.update.useMutation();

    return (
      <ScrollViewSheetWithRef ref={formRef}>
        <ApiResponseView
          response={data}
          ok={(data) => {
            return <Text>{JSON.stringify(data)}</Text>;
          }}
          error={(error) => {
            error.code === "insufficient_permission";
            return <Text>{JSON.stringify(error)}</Text>;
          }}
        />
      </ScrollViewSheetWithRef>
    );
  },
);
