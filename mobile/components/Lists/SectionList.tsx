import React, { useMemo } from "react";
import {
  Platform,
  SectionList as RNSectionList,
  SectionListProps,
  View,
  FlexStyle,
  SectionListData,
  DefaultSectionT,
} from "react-native";

import { useTheme, Theme } from "~/theme";

import Divider from "./Divider";
import ListItem from "./ListItem";
import { BaseListItem } from "./ListItem/types";
import SectionHeader from "./SectionHeader";

export type Section<TListData = BaseListItem> = {
  title?: string;
  helperText?: string;
  helperTextVariant?: keyof Theme["textVariants"];
  data: TListData[];
};
export type Sections<TListData = BaseListItem> = Section<TListData>[];

type Props = Pick<
  SectionListProps<BaseListItem, Section>,
  | "contentContainerStyle"
  | "contentInsetAdjustmentBehavior"
  | "onRefresh"
  | "refreshing"
  | "ListFooterComponent"
  | "ItemSeparatorComponent"
  | "ListHeaderComponent"
  | "alwaysBounceVertical"
  | "ListEmptyComponent"
  | "renderSectionFooter"
> & {
  handleItemPress?: (item: BaseListItem) => void;
  handleItemLongPress?: (item: BaseListItem) => void;
  sections: Sections;
};

export function SectionListDefaults<ItemT, SectionT = DefaultSectionT>({
  children,
  sections,
}: {
  children: (
    defaults: Omit<SectionListProps<ItemT, SectionT>, "renderItem">
  ) => JSX.Element;
  sections: ReadonlyArray<SectionListData<ItemT, SectionT>>;
}): JSX.Element {
  const { spacing } = useTheme();

  const footerStyles = useMemo(
    () =>
      Platform.select<FlexStyle>({
        ios: { marginBottom: spacing.l },
        default: { marginVertical: spacing.l },
      }),
    [spacing.l]
  );

  return children({
    sections,
    ItemSeparatorComponent() {
      return Platform.select({
        android: null,
        default: <Divider marginLeft="m" zIndex={1} />,
      });
    },
    contentContainerStyle: Platform.select({
      ios: { paddingTop: spacing.xl },
      default: { marginTop: spacing.l },
    }),
    contentInsetAdjustmentBehavior: "automatic",
    initialNumToRender: 20,
    // eslint-disable-next-line react/display-name, react/prop-types
    renderSectionFooter: ({ section }) => {
      const index = sections.findIndex((compare) => compare === section);

      return index < sections.length - 1 ? (
        <Divider style={footerStyles} />
      ) : (
        Platform.select({
          default: <View style={footerStyles} />,
          ios: <Divider style={footerStyles} />,
        })
      );
    },
    stickySectionHeadersEnabled: false,
  });
}

export default function SectionList({
  contentContainerStyle,
  sections,
  handleItemPress,
  handleItemLongPress,
  ...rest
}: Props): JSX.Element {
  return (
    <SectionListDefaults<BaseListItem, Section> sections={sections}>
      {(defaults) => (
        <RNSectionList
          {...defaults}
          contentContainerStyle={[
            defaults.contentContainerStyle,
            contentContainerStyle,
          ]}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          renderItem={({ item }) => (
            <ListItem
              onPress={handleItemPress ? () => handleItemPress(item) : noop}
              onLongPress={
                handleItemLongPress ? () => handleItemLongPress(item) : noop
              }
              item={item}
            />
          )}
          renderSectionHeader={({
            section: { title, helperText, helperTextVariant },
          }) => {
            return (
              <SectionHeader
                title={title}
                helperText={helperText}
                helperTextVariant={helperTextVariant}
              />
            );
          }}
          {...rest}
        />
      )}
    </SectionListDefaults>
  );
}
