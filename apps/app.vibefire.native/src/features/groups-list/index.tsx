import { Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { trpc } from "!/api/trpc-client";

import { IconButton } from "!/components/button/IconButton";
import { GroupsListSimpleChipView } from "!/components/group/GroupsList";
import {
  ErrorDisplay,
  LoadingDisplay,
  withSuspenseErrorBoundary,
} from "!/components/misc/SuspenseWithError";
import { SummaryComponent } from "!/components/structural/SummaryComponent";
import { navCreateGroup, navGroupUserManaged } from "!/nav";

export const UsersGroupsSummary = () => {
  const GroupsList = withSuspenseErrorBoundary(
    () => {
      const [allGroupsForUser, _] =
        trpc.groups.allGroupsForUser.useSuspenseQuery();

      return (
        <View className="flex-col">
          <GroupsListSimpleChipView
            groups={allGroupsForUser}
            onPress={() => {}}
          />
          <View className="items-start py-4">
            <IconButton
              onPress={navGroupUserManaged}
              useOpacity={true}
              size={1}
            >
              <View className="flex-row items-center justify-center rounded-sm bg-white/10 px-4 py-2">
                <FontAwesome name="eye" size={20} color="white" />
                <Text className="text-lg text-white"> View all</Text>
              </View>
            </IconButton>
          </View>
        </View>
      );
    },
    {
      ErrorFallback: ({ error, resetErrorBoundary }) => (
        <View className="p-5">
          <ErrorDisplay
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            textWhite={true}
          />
        </View>
      ),
      LoadingFallback: (
        <View className="p-5">
          <LoadingDisplay loadingWhite={true} />
        </View>
      ),
    },
  );

  return (
    <View className="bg-black px-2">
      <SummaryComponent
        headerTitle="Your Groups"
        onHeaderButtonPress={navCreateGroup}
      >
        <GroupsList />
      </SummaryComponent>
    </View>
  );
};
