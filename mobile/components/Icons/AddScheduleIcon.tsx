import React from "react";

import { Animated } from "react-native";

import Box from "~/components/Box";
import { Touchable } from "~/components/Touchables";
import { PlusIcon } from "~/components/Icons";

const AnimatedBox = Animated.createAnimatedComponent(Box);

interface AddScheduleIconProps {
  onPress: () => void;
  backgroundColor: Animated.AnimatedInterpolation;
}
const AddScheduleIcon = ({
  onPress,
  backgroundColor,
}: AddScheduleIconProps): JSX.Element => {
  return (
    <AnimatedBox borderRadius={26} padding="xs" style={{ backgroundColor }}>
      <Touchable onPress={onPress}>
        <PlusIcon size={26} color="text" />
      </Touchable>
    </AnimatedBox>
  );
};

export default AddScheduleIcon;
