import { trpc } from "!/api/trpc-client";

import { GroupsListSimpleChipView } from "!/components/group/GroupsList";
import { ErrorDisplay, LoadingDisplay } from "!/components/misc/errors-loading";
import { withSuspenseErrorBoundary } from "!/components/misc/SuspenseWithError";
import { SummaryCompStructure } from "!/components/structural/SummaryComponent";
import { navCreateGroup } from "!/nav";

export const UsersGroupsSummary = () => {
  const GroupsList = withSuspenseErrorBoundary(
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
      ErrorFallback: ({ error, resetErrorBoundary }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ErrorDisplay({ error, resetErrorBoundary, textWhite: true }),
      LoadingFallback: LoadingDisplay({ loadingWhite: true }),
    },
  );

  return (
    <SummaryCompStructure
      headerTitle="Your Groups"
      onHeaderButtonPress={navCreateGroup}
    >
      <GroupsList />
    </SummaryCompStructure>
  );
};
