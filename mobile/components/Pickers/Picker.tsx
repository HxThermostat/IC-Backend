import React, { useCallback, useImperativeHandle, useRef } from "react";
import {
  StyleSheet,
  Platform,
  TextStyle,
  StyleProp,
  ViewStyle,
} from "react-native";

import { Picker as RNCPicker } from "@react-native-picker/picker";

import BottomSheetModal, {
  BottomSheetModalMethods,
} from "~/components/BottomSheetModal";
import Text from "~/components/Text";
import { Touchable } from "~/components/Touchables";

import { Theme, useTheme } from "~/theme";

import PickerActionBar from "./PickerActionBar";

const styles = StyleSheet.create({
  picker: {
    opacity: +(Platform.OS !== "android"),
    ...StyleSheet.absoluteFillObject,
  },
});

export interface PickerOption<T extends string = string> {
  itemLabel?: string;
  label: string;
  value: T;
}

function convertToPickerOption<T extends string>(
  options: Array<PickerOption<T> | string>
): Array<PickerOption<T>> {
  return options.map((option: PickerOption<T> | string) => {
    if (typeof option === "string") {
      return { value: option as T, label: option };
    } else {
      return option;
    }
  });
}

interface PickerProps<T extends string> {
  value: T;
  options: Array<PickerOption<T> | T>;
  onValueChange: (newValue: T) => void;
  blurOnChange?: boolean;
  labelStyle?: TextStyle;
  labelVariant?: keyof Theme["textVariants"];
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const PICKER_HEIGHT = 162; // iOS system constant
const ACTION_BAR_HEIGHT = 60;
const PADDING = 20;

const snapPoints = [PICKER_HEIGHT + ACTION_BAR_HEIGHT + PADDING];

const Picker = <T extends string>({
  ref,
  ...props
}: PickerProps<T> & {
  ref?: React.Ref<Pick<BottomSheetModalMethods, "dismiss" | "present">>;
}): JSX.Element => {
  const { colors } = useTheme();
  const bsModalRef = useRef<BottomSheetModalMethods>(null);

  useImperativeHandle(ref, () => ({
    dismiss: () => {
      bsModalRef.current?.dismiss();
    },
    present: () => {
      bsModalRef.current?.present();
    },
  }));

  const handleCloseBottomSheet = useCallback(() => {
    bsModalRef?.current?.dismiss();
  }, []);

  const handlePresentBottomSheet = useCallback(() => {
    bsModalRef?.current?.present();
  }, []);

  const { value, options, onValueChange, blurOnChange } = props;

  const optionObjects: PickerOption<T>[] = convertToPickerOption(options);

  const Picker = (
    <RNCPicker
      selectedValue={value}
      style={[styles.picker, { backgroundColor: colors.pickerBackground }]}
      itemStyle={{
        color: colors.text,
        backgroundColor: colors.pickerBackground,
      }}
      onValueChange={(itemValue) => {
        onValueChange(itemValue as T);
        if (blurOnChange) {
          handleCloseBottomSheet();
        }
      }}
    >
      {optionObjects.map((option, index) => (
        <RNCPicker.Item
          key={index}
          label={option.itemLabel || option.label}
          value={option.value}
        />
      ))}
    </RNCPicker>
  );

  return (
    <>
      <Touchable
        onPress={handlePresentBottomSheet}
        style={props.containerStyle}
        disabled={props.disabled}
      >
        <Text variant={props.labelVariant} style={props.labelStyle}>
          {optionObjects.find((o) => o.value === value)?.label}
        </Text>
      </Touchable>
      {!props.disabled &&
        Platform.select({
          default: Picker,
          ios: (
            <BottomSheetModal
              backdrop={true}
              handleComponent={PickerActionBar}
              ref={bsModalRef}
              snapPoints={snapPoints}
            >
              {Picker}
            </BottomSheetModal>
          ),
        })}
    </>
  );
};

Picker.displayName = "Picker";
export default Picker;
