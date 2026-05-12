import React from "react";
import { Box, BoxWithChildrenProps } from "./Box";

export const Row = (
  props: Omit<BoxWithChildrenProps, "flexDirection">
): ReturnType<typeof Box> => <Box flexDirection="row" {...props} />;
