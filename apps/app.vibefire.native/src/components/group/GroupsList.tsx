import { useCallback, useMemo } from "react";
import { Text, View, type ListRenderItemInfo } from "react-native";

import { type VibefireGroupT } from "@vibefire/models";

import { useSortedGroups } from "!/hooks/useSortedGroups";

import { GroupCard } from "!/components/group/GroupCard";
import { GroupChip } from "!/components/group/GroupChip";
import { FlatListViewSheet } from "!/components/misc/sheet-utils";

const useGroupChipRenderer = (
  onPress: (groupId: string, group: VibefireGroupT) => void,
) => {
  return useCallback(
    ({
      item: group,
      index,
    }: Omit<ListRenderItemInfo<VibefireGroupT>, "separators">) => (
      <View key={index}>
        <GroupChip
          group={group}
          onPress={() => {
            onPress(group.id, group);
          }}
        />
      </View>
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
          {noGroupsMessage ? noGroupsMessage : "No groups yet."}
        </Text>
      </View>
    );
  }, [noGroupsMessage]);
};

type GroupsListProps = {
  groups: VibefireGroupT[];
  onGroupPress: (groupId: string, group: VibefireGroupT) => void;
  noGroupsMessage?: string;
  sortAsc?: boolean;
  listTitle?: string;
};

export const GroupsList = ({
  groups,
  onGroupPress,
  listTitle,
  noGroupsMessage,
  sortAsc = false,
}: GroupsListProps) => {
  const sortedGroups = useSortedGroups(groups, sortAsc);

  const noGroupsText = useNoGroupsText(noGroupsMessage);
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
      renderItem={renderGroupCard}
      keyExtractor={(item) => item.id}
    />
  );
};

export const GroupsListSimpleChipView = ({
  groups,
  onGroupPress,
  listTitle,
  noGroupsMessage,
  sortAsc = false,
}: GroupsListProps) => {
  const sortedGroups = useSortedGroups(groups, sortAsc);

  const noGroupsText = useNoGroupsText(noGroupsMessage);
  const renderGroupChip = useGroupChipRenderer(onGroupPress);

  const header = useMemo(() => {
    return <Text className="text-2xl font-bold text-black">{listTitle}</Text>;
  }, [listTitle]);

  const groupChips = useMemo(() => {
    return sortedGroups.map((group, index) =>
      renderGroupChip({ item: group, index }),
    );
  }, [sortedGroups, renderGroupChip]);

  return groupChips;
};
