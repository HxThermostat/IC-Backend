import React from "react";
import { View, Platform, StyleSheet, StyleProp, ViewStyle } from "react-native";

import { useDeviceContext } from "~/contexts";
import { useTheme } from "~/theme";

import ListItemCheckmark from "./ListItem/ListItemCheckmark";
import ListItemChevron from "./ListItem/ListItemChevron";
import ListItemSubTitle from "./ListItem/ListItemSubtitle";
import ListItemTitle from "./ListItem/ListItemTitle";
import PressableListItem, {
  PressableListItemProps,
} from "./ListItem/PressableListItem";
import { BaseListItem } from "./ListItem/types";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

type ListItemProps = Omit<PressableListItemProps, "children"> & {
  item: BaseListItem;
  // over-ride style here because Pressable's style type signature is kinda weird now
  style?: StyleProp<ViewStyle>;
};

const ListItem = ({
  item,
  style,
  onPress,
  onLongPress,
  ...rest
}: ListItemProps): JSX.Element => {
  // this seems weird/expensive to register each item with the context? Not that it'd ever change to re-render...
  const { isTablet } = useDeviceContext();
  const { spacing } = useTheme();

  const containerStyle = Platform.select({
    ios: {
      padding: spacing.m,
    },
    default: {
      padding: spacing.m,
    },
  });

  const handlePress =
    item.navigate != undefined ||
    item.onPress != undefined ||
    item.onLongPress != undefined;

  return (
    <PressableListItem
      {...rest}
      onPress={handlePress ? onPress : undefined}
      onLongPress={item.onLongPress ? onLongPress : undefined}
      delayLongPress={item.delayLongPress}
      disabled={item.disabled || !handlePress}
      style={[styles.container, containerStyle, style, item.style]}
    >
      {item.leftElement}
      <View style={[styles.contentContainer, item.contentContainerStyle]}>
        <ListItemTitle item={item} isTablet={isTablet} />
        {Platform.OS === "android" && <ListItemSubTitle item={item} />}
      </View>
      {Platform.OS === "ios" && <ListItemSubTitle item={item} />}
      {item.rightElement}
      <ListItemChevron item={item} />
    </PressableListItem>
  );
};

export default ListItem;

export { ListItemCheckmark };
