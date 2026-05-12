import React from "react";
import Box from "~/components/Box";
import Text from "~/components/Text";
import i18n from "~/i18n";
import { Call } from "~/graph";

const defaultScope = "Screens.Authenticated.Home";

type SystemModeProps = {
  call: Call | null;
  i18nScope?: string;
};

export const SystemMode = ({
  call,
  i18nScope = defaultScope,
}: SystemModeProps): JSX.Element => (
  <Box opacity={call == null ? 0 : 1}>
    <Text textAlign="center" variant="scheduleOverrideCaption">
      {call === "COOL"
        ? i18n.t("systemModeCool", { scope: i18nScope })
        : i18n.t("systemModeHeat", { scope: i18nScope })}
    </Text>
  </Box>
);
