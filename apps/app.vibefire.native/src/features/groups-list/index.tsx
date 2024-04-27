import {
  GroupsChipSimpleList,
  GroupsList,
} from "~/components/group/GroupsList";
import {
  ErrorSheetSuspense,
  LoadingSheet,
} from "~/components/utils/sheet-utils";
import { withSuspenseErrorBoundary } from "~/components/utils/SuspenseWithError";
import { trpc } from "~/apis/trpc-client";

export const GroupsListAllForUser = withSuspenseErrorBoundary(
  () => {
    const [allGroupsForUser, _] =
      trpc.groups.allGroupsForUser.useSuspenseQuery();

    return (
      <GroupsChipSimpleList groups={allGroupsForUser} onGroupPress={() => {}} />
    );
  },
  {
    ErrorFallback: ErrorSheetSuspense,
    LoadingFallback: <LoadingSheet />,
  },
);
