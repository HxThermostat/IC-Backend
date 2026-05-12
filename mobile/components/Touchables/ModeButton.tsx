import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

import { ConnectionStatus, EffectiveMode } from "~/graph";

import i18n from "~/i18n";

import { ThemeColors } from "~/theme/color";

import Text from "~/components/Text";

import Touchable, { TouchableProps } from "./Touchable";

const styles = StyleSheet.create({
  // Override default disabled value from Touchable
  disabled: {
    opacity: 1,
  },
});

type ModeButtonProps = Omit<TouchableProps, "children" | "text"> & {
  mode: EffectiveMode;
  connectionStatus: ConnectionStatus;
  awayActive: boolean | undefined;
};

const scope = "Common.Modes";

export default function ModeButton({
  mode,
  connectionStatus,
  awayActive,
  ...rest
}: ModeButtonProps): JSX.Element {
  const bgColor = useMemo((): keyof ThemeColors => {
    if (connectionStatus === "OFFLINE") {
      return "modeButtonOffline";
    }

    switch (mode) {
      case "HEAT":
        return "modeButtonHeat";
      case "HEATCOOL":
      case "COOL":
        return "modeButtonCool";
      case "OFF":
        return "modeButtonOff";
      default:
        return "modeButtonOff";
    }
  }, [mode, connectionStatus]);

  const text = useMemo((): string => {
    const scopeLabel =
      connectionStatus === "OFFLINE" ? "OFFLINE" : awayActive ? "AWAY" : mode;
    return i18n.t(scopeLabel, { scope });
  }, [connectionStatus, mode, awayActive]);

  return (
    <Touchable
      borderRadius={25}
      backgroundColor={bgColor}
      minWidth={130}
      alignItems={"center"}
      alignSelf={"center"}
      justifyContent={"center"}
      padding="m"
      disabled={connectionStatus === "OFFLINE"}
      disabledStyle={styles.disabled}
      shadowOffset={{ height: 0, width: 0 }}
      shadowOpacity={0.2}
      shadowRadius={5}
      elevation={3}
      {...rest}
    >
      <Text variant={"button"}>{text}</Text>
    </Touchable>
  );
}
