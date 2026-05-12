import React from "react";

import Text from "~/components/Text";
import { Row, withBoxProps } from "~/components/Box";
import { StepperButton } from "~/components/Touchables";

interface AdjustHumidityBlockProps {
  handleDecreasePress: () => void;
  handleIncreasePress: () => void;
  value: number | string;
}

const SLOP = 40;
const hitSlop = { top: SLOP, left: SLOP, right: SLOP, bottom: SLOP };

const AdjustHumidityBlock = (props: AdjustHumidityBlockProps): JSX.Element => {
  const { handleDecreasePress, handleIncreasePress, value, ...rest } = props;

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      marginTop={"xxl"}
      marginBottom="xl"
      paddingHorizontal="l"
      {...rest}
    >
      <StepperButton
        hitSlop={hitSlop}
        direction="down"
        onPress={handleDecreasePress}
      />
      <Row alignItems="baseline" paddingHorizontal={"l"}>
        <Text variant="adjustBlockLabel" fontVariant={"tabular-nums"}>
          {value}
        </Text>
        <Text marginLeft="xxs" paddingBottom="xxs">
          %
        </Text>
      </Row>
      <StepperButton
        hitSlop={hitSlop}
        direction="up"
        onPress={handleIncreasePress}
      />
    </Row>
  );
};

export default withBoxProps(AdjustHumidityBlock);
