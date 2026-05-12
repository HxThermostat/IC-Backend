import React from "react";

import Screen from "~/components/Screen";
import TextInputWithLabel, {
  TextInputWithLabelProps,
} from "~/components/Inputs/TextInputWithLabel";

import { useSaveButton } from "~/hooks";

type SingleInputScreenProps = {
  value: string;
  handleSave: () => Promise<unknown>;
  onChangeText: (value: string) => void;
  label?: string;
  loading?: boolean;
  allowEmptySubmission?: boolean;
} & TextInputWithLabelProps;

export default function SingleInputScreen({
  handleSave,
  value,
  label,
  onChangeText,
  loading,
  allowEmptySubmission,
  ...rest
}: SingleInputScreenProps): JSX.Element {
  const isDisabled = allowEmptySubmission ? false : !value.length;

  const { didChange } = useSaveButton({
    handleSave,
    loading,
    navigateBack: true,
    disabled: isDisabled,
  });

  function handleInputChange(value: string): void {
    onChangeText(value);
    didChange();
  }

  return (
    <Screen scrollViewProps={{ contentContainerStyle: { flexGrow: 0 } }}>
      <TextInputWithLabel
        autoFocus={true}
        onChangeText={handleInputChange}
        clearButtonMode={"always"}
        label={label}
        value={value}
        {...rest}
      />
    </Screen>
  );
}
