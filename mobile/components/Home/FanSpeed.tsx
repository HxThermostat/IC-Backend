import React from "react";

import Cloak from "~/components/Cloak";
import Text from "~/components/Text";

import i18n from "~/i18n";

import { translateFanSpeedName } from "~/utils/i18n";

const defaultScope = "Screens.Authenticated.Home";

type FanSpeedProps = {
  speed?: string | number;
  i18nScope?: string;
};

export function FanSpeed({
  speed,
  i18nScope = defaultScope,
}: FanSpeedProps): JSX.Element {
  let text: string | null = null;

  switch (typeof speed) {
    case "number":
      text = i18n.t("fanSpeed.percent", {
        scope: i18nScope,
        speedPercent: speed,
      });
      break;
    case "string": {
      const speedName = translateFanSpeedName(speed);
      if (speedName) {
        text = i18n.t("fanSpeed.name", {
          scope: i18nScope,
          speedName,
        });
      }
      break;
    }
    default:
      break;
  }

  return (
    <Cloak visible={text != null}>
      {({ opacity }) => (
        <Text
          opacity={opacity}
          textAlign="center"
          variant="scheduleOverrideCaption"
        >
          {text}
        </Text>
      )}
    </Cloak>
  );
}
