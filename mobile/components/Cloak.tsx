import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

import { CloakProvider } from "~/contexts";

const styles = StyleSheet.create({ hidden: { opacity: 0 }, visible: {} });

export default function Cloak({
  hidden: _hidden,
  visible: _visible,
  children,
}: {
  hidden?: unknown;
  visible?: unknown;
  children: (args: {
    opacity: 0 | undefined;
    style: ViewStyle;
    containerStyle: ViewStyle;
  }) => JSX.Element;
}): JSX.Element {
  let hidden = false;

  if (_visible) {
    hidden = false;
  } else if (_hidden) {
    hidden = true;
  } else if (_visible != null && _visible == false) {
    hidden = true;
  }

  const style = styles[hidden ? "hidden" : "visible"];

  return (
    <CloakProvider hidden={hidden}>
      {children({
        opacity: hidden ? 0 : undefined,
        style,
        containerStyle: style,
      })}
    </CloakProvider>
  );
}
