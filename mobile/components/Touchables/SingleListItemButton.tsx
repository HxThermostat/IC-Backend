import React from "react";

import { Row } from "../Box";
import Text from "../Text";
import { ChevronIcon } from "../Icons";

import { Touchable } from ".";

interface SingleListItemButtonProps {
  onPress: () => void;
  title: string;
  value: string | null;
}
const SingleListItemButton = ({
  onPress,
  title,
  value,
}: SingleListItemButtonProps): JSX.Element => {
  return (
    <Touchable
      borderWidth={1}
      borderRadius={10}
      borderColor="listItemButtonBorder"
      paddingHorizontal="l"
      paddingVertical="m"
      onPress={onPress}
    >
      <Row justifyContent="space-between">
        <Text variant="bodyStrong">{title}</Text>
        <Row alignItems="center">
          <Text variant="sublistLabel">{value}</Text>
          <ChevronIcon color={"listChevron"} size={18} />
        </Row>
      </Row>
    </Touchable>
  );
};

export default SingleListItemButton;
