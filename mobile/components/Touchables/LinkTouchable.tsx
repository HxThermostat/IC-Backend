import { useResponsiveProp } from "@shopify/restyle";
import React from "react";

import Text, { TextProps } from "~/components/Text";

import Touchable, { TouchableProps } from "./Touchable";

export interface LinkTouchableProps extends TextProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  touchableProps?: Partial<TouchableProps>;
}

const LinkTouchable = (props: LinkTouchableProps): JSX.Element => {
  const { text, onPress, disabled, touchableProps, ...textProps } = props;

  const color = useResponsiveProp(textProps.color);

  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      // this vertical padding ensure the loading icon isn't clipped on Android
      paddingVertical="xs"
      {...touchableProps}
      activityIndicatorProps={{
        ...touchableProps?.activityIndicatorProps,
        color: color,
      }}
    >
      <Text textDecorationLine="underline" {...textProps}>
        {text}
      </Text>
    </Touchable>
  );
};

export default LinkTouchable;
