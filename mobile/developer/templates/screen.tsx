import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import Text from "~/components/Text";
import { Touchable } from "~/components/Touchables";

import i18n from "~/i18n";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const scope = "Screens.Example";

export default function Home(): JSX.Element {
  return (
    <ScrollView
      alwaysBounceVertical={false}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior={"automatic"}
    >
      <Text>${i18n.t("text", { scope })}</Text>
      <Touchable onPress={noop}>
        <Text>${i18n.t("label", { scope })}</Text>
      </Touchable>
    </ScrollView>
  );
}
