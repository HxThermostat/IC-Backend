import React from "react";

import Box, { Row } from "~/components/Box";
import Cloak from "~/components/Cloak";
import Text from "~/components/Text";

import i18n from "~/i18n";

import { TemperatureUnit } from "~/graph";

import { toDisplay } from "~/utils/display";

const scope = "Screens.Authenticated.Home";

export type HumidityTempOutdoorProps = {
  temperatureOutdoor?: number;
  humidityAmbient?: number;
  temperatureUnit: TemperatureUnit;
};
export default function HumidityTempOutdoor({
  temperatureOutdoor: outdoorTemp,
  humidityAmbient: humidity,
  temperatureUnit,
}: HumidityTempOutdoorProps): JSX.Element {
  return (
    <Box>
      {outdoorTemp != null && (
        <Row
          alignItems="flex-end"
          justifyContent="space-between"
          marginBottom="s"
        >
          <Text
            fontVariant="small-caps"
            marginRight="s"
            variant="homeTitleBarText"
          >
            {i18n.t("outdoorTemp", { scope })}
          </Text>
          <Text fontVariant="tabular-nums" variant="homeTitleBarValue">
            {toDisplay(temperatureUnit, outdoorTemp)}
          </Text>
        </Row>
      )}

      <Cloak hidden={humidity == null}>
        {({ opacity }) => (
          <Row
            alignItems="flex-end"
            justifyContent="space-between"
            opacity={opacity}
          >
            <Text
              fontVariant="small-caps"
              marginRight="s"
              variant="homeTitleBarText"
            >
              {i18n.t("humidity", { scope })}
            </Text>

            <Text fontVariant="tabular-nums" variant="homeTitleBarValue">
              {humidity ?? " "}
            </Text>
          </Row>
        )}
      </Cloak>

      {/* Empty text with the biggest variant to ensure a consistent height */}
      {outdoorTemp == null && <Text variant="homeTitleBarValue"> </Text>}
    </Box>
  );
}
