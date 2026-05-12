import React from "react";

import { Badge } from "~/components/Badgeable";
import { HSpacer, Row } from "~/components/Box";
import Text from "~/components/Text";
import { useTheme } from "~/theme";

import { BaseListItem } from "./types";

interface ListItemTitleProps {
  item: BaseListItem;
  isTablet: boolean;
}
const ListItemTitle = ({
  item,
  isTablet,
}: ListItemTitleProps): JSX.Element | null => {
  const { colors } = useTheme();

  let color: keyof typeof colors | undefined = undefined;

  if (item.disabled) {
    color = "textDisabled";
  } else if (item.destructive) {
    color = "error";
  }

  return (
    <Row flex={0}>
      <Row>
        <Text
          variant="listLabel"
          color={color}
          {...item.titleProps}
          style={[
            item.actsAsButton && isTablet ? { color: colors.tint } : null,
            item.titleStyle,
          ]}
          selectable={item.titleSelectable === true}
        >
          {item.title}
        </Text>
        {item.displayBadge && <Badge right={-9} />}
      </Row>
      <HSpacer size="z" />
    </Row>
  );
};

export default ListItemTitle;
