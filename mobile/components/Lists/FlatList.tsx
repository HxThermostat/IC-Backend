import React from "react";
import { Platform, FlatListProps } from "react-native";
import { FlatList as RNGHFlatList } from "react-native-gesture-handler";

import { useTheme } from "~/theme";

import Divider from "./Divider";
import ListItem from "./ListItem";
import { BaseListItem } from "./ListItem/types";

export type ListData = BaseListItem[];

type OptionalRenderItem = Partial<
  Pick<FlatListProps<BaseListItem>, "renderItem">
>;

type Props = Pick<
  FlatListProps<BaseListItem>,
  | "data"
  | "contentContainerStyle"
  | "onRefresh"
  | "refreshing"
  | "ListFooterComponent"
  | "ListFooterComponentStyle"
  | "ItemSeparatorComponent"
  | "ListHeaderComponent"
  | "alwaysBounceVertical"
  | "contentInsetAdjustmentBehavior"
  | "ListEmptyComponent"
> &
  OptionalRenderItem & {
    handleItemPress?: (item: BaseListItem) => void;
    handleItemLongPress?: (item: BaseListItem) => void;
  };

export function FlatListDefaults<ItemT>({
  children,
  data,
}: {
  children: (defaults: Omit<FlatListProps<ItemT>, "renderItem">) => JSX.Element;
  data: ReadonlyArray<ItemT> | null | undefined;
}): JSX.Element {
  const { spacing } = useTheme();
  return children({
    data,
    ItemSeparatorComponent() {
      return Platform.select({
        android: null,
        default: <Divider marginLeft="m" />,
      });
    },
    ListFooterComponent() {
      return Platform.select({
        android: null,
        default: <Divider />,
      });
    },
    ListHeaderComponent() {
      return Platform.select({
        android: null,
        default: <Divider />,
      });
    },
    contentContainerStyle: Platform.select({
      ios: { paddingTop: spacing.xl, paddingBottom: spacing.xxl },
      android: { marginTop: spacing.l, paddingBottom: spacing.xxl },
    }),
    contentInsetAdjustmentBehavior: "automatic",
    initialNumToRender: 20,
  });
}

export default function FlatList({
  contentContainerStyle,
  data,
  handleItemPress,
  handleItemLongPress,
  ...rest
}: Props): JSX.Element {
  return (
    <FlatListDefaults<BaseListItem> data={data}>
      {(defaults) => (
        <RNGHFlatList
          {...defaults}
          contentContainerStyle={[
            defaults.contentContainerStyle,
            contentContainerStyle,
          ]}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              onPress={handleItemPress ? () => handleItemPress(item) : noop}
              onLongPress={
                handleItemLongPress ? () => handleItemLongPress(item) : noop
              }
            />
          )}
          {...rest}
        />
      )}
    </FlatListDefaults>
  );
}
