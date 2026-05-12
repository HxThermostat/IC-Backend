import React from "react";

import ActivityIndicator from "~/components/ActivityIndicator";
import Background from "~/components/Background";
import Box from "~/components/Box";

export default function Splash(): JSX.Element {
  return (
    <Background>
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator />
      </Box>
    </Background>
  );
}
