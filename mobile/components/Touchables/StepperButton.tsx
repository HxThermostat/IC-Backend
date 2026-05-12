import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from "@shopify/restyle";
import React, { useCallback, useEffect, useRef } from "react";

import Box from "~/components/Box";
import { MinusIcon, PlusIcon, IconProps } from "~/components/Icons";
import Touchable, { TouchableProps } from "~/components/Touchables/Touchable";
import { Theme } from "~/theme";

const REPEAT_RATE = 150;

// it's a button without children
export type StepperButtonProps = Pick<
  TouchableProps,
  Exclude<keyof TouchableProps, "children">
> &
  VariantProps<Theme, "stepperButtonVariants"> & {
    direction: "up" | "down";
  };

const StepperButton = (props: StepperButtonProps): JSX.Element => {
  const { disabled, direction, onPress, ...rest } = props;

  const intervalRef = useRef<number>(0);

  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  useEffect(() => {
    // Clear Interval
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
      intervalRef.current = 0;
    };
  }, []);

  const onLongPress = useCallback((e) => {
    // Execute first onPress
    onPressRef.current && onPressRef.current(e);

    // Start interval
    intervalRef.current = setInterval(
      () => onPressRef.current && void onPressRef.current(e),
      REPEAT_RATE
    );
  }, []);

  const onPressOut = useCallback(() => {
    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = 0;
  }, []);

  const iconProps: IconProps & { key: string } = {
    key: disabled ? "disabled" : "enabled",
    size: 39,
    color: "text",
  };

  return (
    <Box>
      <Touchable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressOut={onPressOut}
        disabled={disabled}
        // kraftful/klimate#369: It would really be better if this worked
        // as-expected coming from the "disabled" variant
        // eslint-disable-next-line react-native/no-inline-styles
        disabledStyle={{ opacity: 1 }}
        {...rest}
      >
        {direction === "down" ? (
          <MinusIcon {...iconProps} />
        ) : (
          <PlusIcon {...iconProps} />
        )}
      </Touchable>
    </Box>
  );
};

const variant = createVariant({
  themeKey: "stepperButtonVariants",
});

const VariantStepperButton = createRestyleComponent<
  VariantProps<Theme, "stepperButtonVariants"> &
    React.ComponentProps<typeof StepperButton>,
  Theme
>([variant], StepperButton);

export default VariantStepperButton;
