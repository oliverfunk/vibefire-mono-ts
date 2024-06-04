import { useCallback, useMemo } from "react";
import { View } from "react-native";

import { useItemSeparator } from "!/c/misc/ItemSeparator";

export type SimpleListProps<T extends object> = {
  items: T[];
  itemRenderer: (item: T) => React.ReactNode;
  noItemsComponent?: React.ReactNode;
  styleOpts: {
    separatorHeight: number | undefined;
  };
};

const useListItemRenderer = <T extends object>(
  itemRenderer: SimpleListProps<T>["itemRenderer"],
  separatorHeight: SimpleListProps<T>["styleOpts"]["separatorHeight"],
) => {
  const ItemSeparator = useItemSeparator(separatorHeight);
  return useCallback(
    ({ item, index, length }: { item: T; index: number; length: number }) => (
      <View key={index}>
        {index !== 0 && index < length && separatorHeight && <ItemSeparator />}
        {itemRenderer(item)}
      </View>
    ),
    [ItemSeparator, itemRenderer, separatorHeight],
  );
};

export const SimpleList = <T extends object>(props: SimpleListProps<T>) => {
  const { items, itemRenderer, noItemsComponent, styleOpts: options } = props;

  const listItemRenderer = useListItemRenderer(
    itemRenderer,
    options.separatorHeight,
  );

  const renderedItems = useMemo(() => {
    return items.map((item, index) =>
      listItemRenderer({ item, index, length: items.length }),
    );
  }, [items, listItemRenderer]);

  return renderedItems.length > 0 ? renderedItems : noItemsComponent;
};
