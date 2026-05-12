import React from "react";

import { ConnectionStatus } from "~/graph";

import Box from "~/components/Box";
import Cloak from "~/components/Cloak";
import Text from "~/components/Text";
import { Touchable } from "~/components/Touchables";

import i18n from "~/i18n";

const defaultScope = "Screens.Authenticated.Home";

type BackToScheduleProps = {
  activeHold: boolean;
  connectionStatus: ConnectionStatus;
  onPressBackToSchedule: () => void;
  i18nScope?: string;
};

export const BackToSchedule = ({
  activeHold,
  connectionStatus,
  onPressBackToSchedule,
  i18nScope = defaultScope,
}: BackToScheduleProps): JSX.Element => {
  return (
    <Cloak visible={activeHold}>
      {({ opacity }) => (
        <Box opacity={opacity}>
          <Touchable
            disabled={connectionStatus === "OFFLINE"}
            onPress={onPressBackToSchedule}
          >
            <Text textAlign="center" variant="scheduleOverrideCaption">
              {i18n.t("activeHold", { scope: i18nScope })}
            </Text>
            <Text
              textAlign="center"
              textDecorationLine="underline"
              variant="scheduleOverrideCaption"
            >
              {i18n.t("backToSchedule", { scope: i18nScope })}
            </Text>
          </Touchable>
        </Box>
      )}
    </Cloak>
  );
};
