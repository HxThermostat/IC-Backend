import React from "react";
import { StyleSheet, ViewStyle, StyleProp } from "react-native";

import Box, { BoxProps } from "~/components/Box";

const styles = StyleSheet.create({
  container: {
    height: StyleSheet.hairlineWidth,
    marginTop: -StyleSheet.hairlineWidth,
  },
});

type DividerProps = BoxProps & {
  style?: StyleProp<ViewStyle>;
};

const Divider = (props: DividerProps): JSX.Element => {
  const { style, ...rest } = props;
  return (
    <Box {...rest}>
      <Box backgroundColor="divider" style={[styles.container, style]} />
    </Box>
  );
};

export default Divider;
