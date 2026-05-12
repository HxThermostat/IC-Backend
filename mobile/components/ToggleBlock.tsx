import React from "react";

import Switch from "~/components/Switch";
import Text from "~/components/Text";
import Box, { Row, withBoxProps } from "~/components/Box";

interface ToggleBlockProps {
  title: string;
  body: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  hideToggle?: boolean;
  disabled?: boolean;
}

const ToggleBlock = ({
  title,
  value,
  onValueChange,
  body,
  hideToggle,
  disabled,
  ...boxProps
}: ToggleBlockProps): JSX.Element => {
  return (
    <Box paddingBottom="xxl" {...boxProps}>
      <Row justifyContent="space-between" alignItems="center">
        <Box flex={1} marginRight="xl">
          <Text variant="heading" marginBottom={"s"}>
            {title}
          </Text>
          <Text>{body}</Text>
        </Box>
        {!hideToggle && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
          />
        )}
      </Row>
    </Box>
  );
};

export default withBoxProps(ToggleBlock);
