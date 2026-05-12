import React from "react";
import { View, StyleSheet, Platform } from "react-native";

import Text from "~/components/Text";

import { BaseListItem } from "./types";

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  rightContentContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

interface ListItemSubTitleProps {
  item: BaseListItem;
}
export const ListItemSubTitleAndroid = ({
  item,
}: ListItemSubTitleProps): JSX.Element => {
  return (
    <Text
      variant="sublistLabel"
      style={[item.subtitleStyle]}
      selectable={item.subtitleSelectable === true}
    >
      {item.subtitle}
    </Text>
  );
};
export const ListItemSubTitleIOS = ({
  item,
}: ListItemSubTitleProps): JSX.Element => {
  return (
    <View
      style={[styles.rightContentContainer, item.rightContentContainerStyle]}
    >
      <Text
        variant="sublistLabel"
        style={[item.subtitleStyle]}
        selectable={item.subtitleSelectable === true}
      >
        {item.subtitle}
      </Text>
    </View>
  );
};

const ListItemSubTitle = (props: ListItemSubTitleProps): JSX.Element | null => {
  if (!props.item.subtitle) {
    return null;
  }

  return Platform.select({
    ios: <ListItemSubTitleIOS {...props} />,
    default: <ListItemSubTitleAndroid {...props} />,
  });
};
export default ListItemSubTitle;
