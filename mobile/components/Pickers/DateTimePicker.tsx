import React, { useCallback, useState, useMemo } from "react";
import {
  StyleSheet,
  Platform,
  TextStyle,
  StyleProp,
  ViewStyle,
} from "react-native";

import RNDateTimePicker, {
  IOSNativeProps,
  TimePickerOptions,
} from "@react-native-community/datetimepicker";

import BottomSheetModal, { useModalRef } from "~/components/BottomSheetModal";
import Text from "~/components/Text";
import { Touchable } from "~/components/Touchables";

import { useBackgroundColor } from "~/contexts";

import { Theme } from "~/theme";

import { DateFormatter } from "~/utils/display";

import PickerActionBar from "./PickerActionBar";

const styles = StyleSheet.create({
  picker: {
    opacity: +(Platform.OS !== "android"),
    ...StyleSheet.absoluteFillObject,
  },
  ios14: {
    flex: 1,
  },
});

type DateTimePickerProps = React.ComponentProps<typeof RNDateTimePicker> & {
  mode: "date" | "time";
  onValueChange: (newValue: Date) => void;
  value?: Date;
  prefix?: string;
  emptyLabel?: string;
  themeVariant?: "dark" | "light";
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: TextStyle;
  labelVariant?: keyof Theme["textVariants"];
  minimumDate?: Date;
  maximumDate?: Date;
  format?: string;
  useiOS14Style?: boolean;
};

const PICKER_HEIGHT = 162; // iOS system constant
const ACTION_BAR_HEIGHT = 60;
const PADDING = 20;

const snapPoints = [PICKER_HEIGHT + ACTION_BAR_HEIGHT + PADDING];

const iOS14Supported =
  Platform.OS === "ios" && parseInt(Platform.Version as string) >= 14;

const DateTimePicker = ({
  value,
  onValueChange,
  prefix = "",
  emptyLabel = "",
  mode,
  format,
  useiOS14Style = true,
  ...props
}: DateTimePickerProps): JSX.Element => {
  const { themeVariant } = useBackgroundColor();
  props.themeVariant = props.themeVariant ?? themeVariant;

  const bsModalRef = useModalRef();

  const dateFormatter = useMemo(() => {
    if (format) {
      return DateFormatter(format);
    }
    return DateFormatter(mode === "time" ? "h:mm A" : "LL");
  }, [format, mode]);

  const [visible, setVisible] = useState(false);

  const open = useCallback((): void => {
    bsModalRef.current?.present();
    setVisible(true);
  }, [bsModalRef]);

  const onChange = useCallback(
    (_: unknown, itemValue: Date | undefined): void => {
      setVisible(false);
      itemValue && onValueChange(itemValue);
    },
    [onValueChange]
  );

  const isUsingiOS14Style = useiOS14Style && iOS14Supported;
  const display: IOSNativeProps["display"] =
    Platform.OS === "ios"
      ? isUsingiOS14Style
        ? "inline"
        : "spinner"
      : "default";

  const Picker = (
    <RNDateTimePicker
      {...props}
      value={value || new Date()}
      style={[isUsingiOS14Style ? styles.ios14 : styles.picker]}
      onChange={onChange}
      mode={mode}
      display={display as TimePickerOptions["display"]}
    />
  );

  if (isUsingiOS14Style) {
    return Picker;
  }

  return (
    <>
      <Touchable onPress={open} style={props.containerStyle}>
        <Text variant={props.labelVariant} style={props.labelStyle}>
          {!value ? emptyLabel : `${prefix} ${dateFormatter(value)}`}
        </Text>
      </Touchable>
      {Platform.select({
        default: visible ? Picker : null,
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

export default DateTimePicker;
