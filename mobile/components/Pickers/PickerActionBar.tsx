import React from "react";
import { StyleSheet } from "react-native";

import { useBottomSheetModal } from "@gorhom/bottom-sheet";

import i18n from "~/i18n";

import Text from "~/components/Text";
import Touchable from "~/components/Touchables/Touchable";
import Box from "~/components/Box";

const PickerActionBar = (): JSX.Element => {
  const { dismissAll } = useBottomSheetModal();

  return (
    <Box
      backgroundColor="pickerActionBarBackground"
      borderTopColor="divider"
      borderBottomColor="divider"
      alignItems="flex-end"
      borderBottomWidth={StyleSheet.hairlineWidth}
      borderTopWidth={StyleSheet.hairlineWidth}
    >
      <Touchable
        onPress={dismissAll}
        paddingHorizontal="l"
        paddingVertical="m"
        alignSelf="flex-end"
      >
        <Text color="tint">{i18n.t("Common.done")}</Text>
      </Touchable>
    </Box>
  );
};

export default PickerActionBar;
