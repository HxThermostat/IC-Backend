import React from "react";
import { Platform, StyleProp, TextStyle } from "react-native";

import { Row } from "~/components/Box";
import Text from "~/components/Text";

import { Theme } from "~/theme";

import Divider from "./Divider";

interface SectionHeaderProps {
  title?: string;
  helperText?: string;
  helperTextStyle?: StyleProp<TextStyle>;
  helperTextVariant?: keyof Theme["textVariants"];
}

const SectionHeader = ({
  title,
  helperText,
  helperTextStyle,
  helperTextVariant,
}: SectionHeaderProps): JSX.Element => {
  return (
    <>
      <Row
        justifyContent="space-between"
        marginTop={Platform.select({ android: "xs" })}
      >
        {Boolean(title) && (
          <Text marginBottom="s" marginLeft="m" variant="separatorLabel">
            {title}
          </Text>
        )}
        {Boolean(helperText) && (
          <Text
            variant={helperTextVariant || "separatorHelperLabel"}
            marginBottom="s"
            marginHorizontal="m"
            style={helperTextStyle}
          >
            {helperText}
          </Text>
        )}
      </Row>
      {Platform.OS === "ios" && <Divider />}
    </>
  );
};

export default SectionHeader;
