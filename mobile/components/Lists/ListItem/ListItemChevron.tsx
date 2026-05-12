import React from "react";
import { Platform } from "react-native";
import Box from "~/components/Box";

import { ChevronIcon } from "~/components/Icons";

import { BaseListItem } from "./types";

interface ListItemChevronProps {
  item: BaseListItem;
}
const ListItemChevron = ({
  item,
}: ListItemChevronProps): JSX.Element | null => {
  if (item.displayChevronIOS && Platform.OS === "ios") {
    return (
      <Box marginLeft="s">
        <ChevronIcon color={"listChevron"} size={18} />
      </Box>
    );
  }
  return null;
};

export default ListItemChevron;
