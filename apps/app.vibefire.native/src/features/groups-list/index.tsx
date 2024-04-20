import { useCallback, useMemo } from "react";
import { Text, View, type ListRenderItemInfo } from "react-native";

import { type VibefireGroupT } from "@vibefire/models";

import { FlatListViewSheet } from "~/components/bottom-panel/_shared";
import { GroupCard } from "~/components/group/GroupCard";
import { GroupChip } from "~/components/group/GroupChip";
import { useSortedGroups } from "~/hooks/useSortedGroups";

const useGroupChipRenderer = (
  onPress: (groupId: string, group: VibefireGroupT) => void,
) => {
  return useCallback(
    ({ item: group }: ListRenderItemInfo<VibefireGroupT>) => (
      <GroupChip
        group={group}
        onPress={() => {
          onPress(group.id, group);
        }}
      />
    ),
    [onPress],
  );
};

const useGroupCardRenderer = (
  onPress: (groupId: string, group: VibefireGroupT) => void,
) => {
  return useCallback(
    ({ item: group }: ListRenderItemInfo<VibefireGroupT>) => (
      <GroupCard
        group={group}
        onPress={() => {
          onPress(group.id, group);
        }}
      />
    ),
    [onPress],
  );
};

const useItemSeparator = () => {
  return useCallback(() => {
    return <View className="h-2" />;
  }, []);
};

const useNoGroupsText = (noGroupsMessage?: string) => {
  return useMemo(() => {
    return (
      <View className="h-[30vh] items-center justify-center">
        <Text className="text-lg font-bold text-black">
          {noGroupsMessage ? noGroupsMessage : "Not apart of any groups yet"}
        </Text>
      </View>
    );
  }, [noGroupsMessage]);
};

type GroupsListProps = {
  groups: VibefireGroupT[];
  asChip: boolean;
  onGroupPress: (groupId: string, group: VibefireGroupT) => void;
  listTitle?: string;
  noGroupsMessage?: string;
  sortAsc?: boolean;
};

export const GroupsChipViewList = ({
  groups,
  asChip,
  onGroupPress,
  listTitle,
  noGroupsMessage,
  sortAsc = false,
}: GroupsListProps) => {
  const sortedGroups = useSortedGroups(groups, sortAsc);

  const noGroupsText = useNoGroupsText(noGroupsMessage);
  const renderGroupChip = useGroupChipRenderer(onGroupPress);
  const renderGroupCard = useGroupCardRenderer(onGroupPress);

  const header = useMemo(() => {
    return <Text className="text-2xl font-bold text-black">{listTitle}</Text>;
  }, [listTitle]);

  const itemSep = useItemSeparator();

  return (
    <FlatListViewSheet
      ListEmptyComponent={noGroupsText}
      ListHeaderComponent={listTitle ? header : undefined}
      ItemSeparatorComponent={itemSep}
      data={sortedGroups}
      contentContainerStyle={{ padding: 5 }}
      renderItem={asChip ? renderGroupChip : renderGroupCard}
      keyExtractor={(item) => item.id}
    />
  );
};
