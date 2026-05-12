import React from "react";
import {
  TextInput as RNTextInput,
  View,
  Platform,
  TextStyle,
} from "react-native";

import Text from "~/components/Text";

import TextInput, { TextInputProps } from "./TextInput";

export type TextInputWithLabelProps = TextInputProps & {
  labelStyle?: TextStyle;
};

const TextInputWithLabel = React.forwardRef<
  RNTextInput,
  TextInputWithLabelProps
>(
  (props: TextInputWithLabelProps, ref): JSX.Element => {
    const { label, labelStyle, ...rest } = props;

    return (
      <View>
        {Platform.OS === "ios" && (
          <Text
            variant="textInputTextLabelIOS"
            marginBottom="s"
            style={labelStyle}
          >
            {label}
          </Text>
        )}
        <TextInput {...rest} ref={ref} label={label} />
      </View>
    );
  }
);

TextInputWithLabel.displayName = "TextInputWithLabel";
export default TextInputWithLabel;
