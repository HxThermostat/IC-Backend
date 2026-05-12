import { useMemo } from "react";

import { Slot } from "~/graph";

import { ThemeColor } from "~/theme";

type LinearGradientValues = {
  colors: [ThemeColor, ThemeColor];
  locations: [number, number];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

type ClientSideSlots = Slot | "VIRTUAL" | "BLANK";
// Virtual - slot is null/preset is set by device
// Blank - display-only value used on copy schedule screen

export const useScheduleLinearGradient = (
  slot: ClientSideSlots | null | undefined
): LinearGradientValues => {
  const gradient = useMemo<LinearGradientValues>(() => {
    const start = { x: 0, y: 0 };
    const end = { x: 1, y: 1 };
    switch (slot) {
      case "HOME":
        return {
          colors: ["scheduleHomeGradientEnd", "scheduleHomeGradientStart"],
          locations: [0.1, 0.99],
          start,
          end,
        };
      case "AWAY":
        return {
          colors: ["scheduleAwayGradientEnd", "scheduleAwayGradientStart"],
          locations: [0.1, 0.99],
          start,
          end,
        };
      case "SLEEP":
        return {
          colors: ["scheduleSleepGradientEnd", "scheduleSleepGradientStart"],
          locations: [0.1, 0.99],
          start,
          end,
        };
      case "CUSTOM":
        return {
          colors: ["scheduleCustomGradientEnd", "scheduleCustomGradientStart"],
          locations: [0.1, 0.99],
          start,
          end,
        };
      case "VIRTUAL":
        return {
          colors: ["scheduleCustomGradientEnd", "scheduleCustomGradientStart"],
          locations: [0.0, 0.9],
          start,
          end,
        };
      case "BLANK":
      default:
        return {
          colors: [
            "emptyScheduleCardBackground",
            "emptyScheduleCardBackground",
          ],
          locations: [0.0, 0.9],
          start,
          end,
        };
    }
  }, [slot]);

  return gradient;
};
