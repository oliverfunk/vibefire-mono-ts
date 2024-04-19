export const GroupsListChip = ({ group }: { group: Group }) => {};

export const GroupsListChipView = () => {
  const { groups } = useGroupsList();

  return (
    <FlatList
      data={groups}
      renderItem={({ item }) => <GroupItem group={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};
