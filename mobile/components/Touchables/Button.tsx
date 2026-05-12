import React from "react";

import { useResponsiveProp } from "@shopify/restyle";

import { useTheme } from "~/theme";

import Text from "~/components/Text";

import { colorForBackground } from "~/utils/display";

import Touchable, { TouchableProps } from "./Touchable";

type ButtonProps = Omit<TouchableProps, "children"> & {
  children?: JSX.Element;
  text?: string;
};

export default function Button({
  children,
  text,
  ...rest
}: ButtonProps): JSX.Element {
  const { colors } = useTheme();

  const backgroundColor =
    useResponsiveProp(rest.backgroundColor) ?? "primaryButton";

  return (
    <Touchable
      borderRadius={25}
      minWidth={150}
      alignItems={"center"}
      alignSelf={"center"}
      justifyContent={"center"}
      padding="m"
      activityIndicatorProps={{
        ...rest.activityIndicatorProps,
        color:
          rest.activityIndicatorProps?.color ??
          colorForBackground(backgroundColor, ["text", "textOnColor"], colors),
      }}
      {...rest}
      backgroundColor={backgroundColor}
    >
      {children ?? <Text variant={"button"}>{text ?? " "}</Text>}
    </Touchable>
  );
}
