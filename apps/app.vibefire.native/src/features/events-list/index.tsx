import { trpc } from "!/api/trpc-client";

import { GroupsListSimpleChipView } from "!/components/group/GroupsList";
import { SummaryList } from "!/components/structural/SummaryList";
import {
  ErrorSheetSuspense,
  LoadingSheet,
} from "!/components/utils/sheet-utils";
import { withSuspenseErrorBoundary } from "!/components/utils/SuspenseWithError";
import { navCreateEvent } from "!/nav";

export const UsersEventsSummary = () => {
  const EventsList = withSuspenseErrorBoundary(
    () => {
      const [allGroupsForUser, _] =
        trpc.groups.allGroupsForUser.useSuspenseQuery();

      return (
        <GroupsListSimpleChipView
          groups={allGroupsForUser}
          onGroupPress={() => {}}
        />
      );
    },
    {
      ErrorFallback: ErrorSheetSuspense,
      LoadingFallback: <LoadingSheet />,
    },
  );

  return (
    <SummaryList title="Your Events" onTitleButtonPress={navCreateEvent}>
      <EventsList />
    </SummaryList>
  );
};
