import React from "react";

import { Day } from "~/graph";

import { Row } from "~/components/Box";
import Text from "~/components/Text";
import { Touchable } from "~/components/Touchables";

import i18n from "~/i18n";

import { Days } from "./time";

interface DaySelectorProps {
  selected: Day | Day[];
  onPress: (day: Day) => void;
}

const scope = "Components.DaySelector.Short";
const DaySelector = ({ selected, onPress }: DaySelectorProps): JSX.Element => {
  const selectedDays = typeof selected === "string" ? [selected] : selected;
  return (
    <Row justifyContent="space-around">
      {Days.map((day, index) => {
        const isSelected = selectedDays.includes(day);
        return (
          <Touchable key={index} onPress={() => onPress(day)}>
            <Text
              opacity={isSelected ? 1 : 0.2}
              variant={isSelected ? "bodyStrong" : "body"}
            >
              {i18n.t(day, { scope })}
            </Text>
          </Touchable>
        );
      })}
    </Row>
  );
};

export default DaySelector;
