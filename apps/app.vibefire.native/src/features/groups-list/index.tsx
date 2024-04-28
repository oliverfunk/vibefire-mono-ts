import { trpc } from "!/api/trpc-client";

import { GroupsListSimpleChipView } from "!/components/group/GroupsList";
import { SummaryCompStructure } from "!/components/structural/SummaryComponent";
import {
  ErrorDisplay,
  LoadingDisplay,
} from "!/components/utils/errors-loading";
import { withSuspenseErrorBoundary } from "!/components/utils/SuspenseWithError";
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
