import React from "react";
import { StyleSheet } from "react-native";

import ActivityIndicator from "~/components/ActivityIndicator";
import Box from "~/components/Box";

type LoadingProps = Pick<React.ComponentProps<typeof Box>, "backgroundColor"> &
  React.ComponentProps<typeof ActivityIndicator>;

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function Loading({
  backgroundColor = "transparent",
  ...props
}: LoadingProps): JSX.Element {
  return (
    <Box backgroundColor={backgroundColor} style={[style.container]}>
      <ActivityIndicator {...props} />
    </Box>
  );
}
