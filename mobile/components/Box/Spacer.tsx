import React from "react";
import { Theme, useTheme } from "~/theme";
import { Box, BoxProps } from "./Box";

export const HSpacer = ({
  size = "xxl",
  ...props
}: Pick<BoxProps, "flexGrow"> & {
  size?: keyof Theme["spacing"];
}): ReturnType<typeof Box> => {
  const { spacing } = useTheme();
  return <Box flexGrow={1} minWidth={spacing[size]} {...props} />;
};

export const VSpacer = ({
  size = "xxl",
  ...props
}: Pick<BoxProps, "flexGrow"> & {
  size?: keyof Theme["spacing"];
}): ReturnType<typeof Box> => {
  const { spacing } = useTheme();
  return <Box flexGrow={1} minHeight={spacing[size]} {...props} />;
};
