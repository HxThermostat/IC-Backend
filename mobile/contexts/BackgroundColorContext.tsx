import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LayoutChangeEvent, useWindowDimensions } from "react-native";

import chroma from "chroma-js";

import { LinearGradientProps } from "react-native-linear-gradient";

import { ThemeColor, useIsThemeColor, useTheme } from "~/theme";

import { colorForBackground } from "~/utils/display";

type Coordinate = [x: number, y: number];

export interface BackgroundColorContextProps {
  color: (coord?: Coordinate) => chroma.Color;
  isDark: (coord?: Coordinate) => boolean;
  isLight: (coord?: Coordinate) => boolean;
  selectColor: (colors: ThemeColor[], coord?: Coordinate) => ThemeColor;
}

const BackgroundColorContext = React.createContext<
  BackgroundColorContextProps | undefined
>(undefined);

interface BackgroundColorContextProviderProps {
  colors: string[] | ThemeColor[];
  end?: LinearGradientProps["end"];
  locations?: LinearGradientProps["locations"];
  start?: LinearGradientProps["start"];
}

const midpoint = 0.5;

export function BackgroundColorProvider({
  colors,
  locations = [0, 1],
  start: _start = { x: 0.5, y: 0 },
  end: _end = { x: 0.5, y: 1 },
  children,
}: PropsWithChildren<BackgroundColorContextProviderProps>): JSX.Element {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { colors: palette } = useTheme();
  const isThemeColor = useIsThemeColor();

  const normalizeColor = useCallback(
    (c: string) => (isThemeColor(c) ? palette[c] : c),
    [isThemeColor, palette]
  );

  const aspectRatio = windowWidth / windowHeight;

  const colorsDep = JSON.stringify(colors);
  const locationsDep = locations ? JSON.stringify(locations) : undefined;
  const scale = useMemo(() => {
    const colors = (JSON.parse(colorsDep) as string[]).map(normalizeColor);
    const locations = locationsDep
      ? (JSON.parse(locationsDep) as number[])
      : undefined;
    return chroma.scale(colors).domain(locations?.map((l) => l * windowHeight));
  }, [colorsDep, locationsDep, normalizeColor, windowHeight]);

  const start = useMemo(() => ({ x: _start.x, y: _start.y }), [
    _start.x,
    _start.y,
  ]);
  const end = useMemo(() => ({ x: _end.x, y: _end.y }), [_end.x, _end.y]);

  // We calculate the effective angle based on the start / end and the
  // device's aspect ratio. This is ultimately used to "unrotate" the
  // gradient to determine where a given x,y coordinate is on the
  // gradient
  const theta = useMemo(() => {
    const y2 = 0.5 - end.y;
    const y1 = 0.5 - start.y;
    const x2 = end.x - 0.5;
    const x1 = start.x - 0.5;
    return Math.atan2(y2 - y1, (x2 - x1) * aspectRatio) + Math.PI / 2;
  }, [end.y, end.x, start.y, start.x, aspectRatio]);

  // Calculate the color for a given x,y coordinate
  // The typing of scale() is a little ambiguous so we need to make
  // this explicit for the dependent functions
  const color: (coord?: Coordinate) => chroma.Color = useCallback(
    ([x, y] = [midpoint * windowWidth, midpoint * windowHeight]) => {
      const midX = midpoint * windowWidth;
      const midY = midpoint * windowHeight;

      // Translate the x,y coordinates to a cartesian origin
      const translatedX = x - midX;
      const translatedY = -y + midY;

      // Rotate the y coordinate based on the angle of the gradient
      const rotatedY =
        translatedX * Math.sin(-theta) + translatedY * Math.cos(-theta);

      // Translate the y coordinate back to a canvas origin
      const untranslatedY = Math.abs(rotatedY - midY);

      return scale(untranslatedY);
    },
    [scale, theta, windowHeight, windowWidth]
  );
  const isLight = useCallback(
    (coord?: Coordinate) => color(coord).luminance() >= 0.5,
    [color]
  );
  const isDark = useCallback(
    (coord?: Coordinate) => color(coord).luminance() <= 0.5,
    [color]
  );
  const selectColor = useCallback(
    (colors: ThemeColor[], coord?: Coordinate): ThemeColor => {
      const currentColor = color(coord);

      return colorForBackground(currentColor, colors, palette);
    },
    [color, palette]
  );

  const context = useMemo(
    () => ({
      color,
      isDark,
      isLight,
      selectColor,
    }),
    [color, isDark, isLight, selectColor]
  );

  return (
    <BackgroundColorContext.Provider value={context}>
      {children}
    </BackgroundColorContext.Provider>
  );
}

export function useBackgroundColorContext(): BackgroundColorContextProps {
  const context = useContext(BackgroundColorContext);

  if (context === undefined) {
    throw new Error(
      "useBackgroundColorContext must be used within a BackgroundColorProvider"
    );
  }

  return context;
}

export function useBackgroundColor(): {
  color: string;
  chroma: chroma.Color;
  isDark: boolean;
  isLight: boolean;
  onLayout: (event: LayoutChangeEvent) => void;
  themeVariant: "dark" | "light";
} {
  const context = useBackgroundColorContext();

  const [coord, setCoord] = useState<[number, number]>();
  const chroma = context.color(coord);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setCoord([
      event.nativeEvent.layout.x + event.nativeEvent.layout.width / 2,
      event.nativeEvent.layout.y + event.nativeEvent.layout.height / 2,
    ]);
  }, []);

  return {
    onLayout,
    chroma,
    color: chroma.hex(),
    isDark: context.isDark(coord),
    isLight: context.isLight(coord),
    themeVariant: context.isDark(coord) ? "dark" : "light",
  };
}

export function useForegroundColor(
  colors: ThemeColor[]
): { color: ThemeColor; onLayout: (event: LayoutChangeEvent) => void } {
  const { selectColor } = useBackgroundColorContext();

  const colorsDep = JSON.stringify(colors);
  const colorsMemo = useMemo(() => JSON.parse(colorsDep) as ThemeColor[], [
    colorsDep,
  ]);

  const [color, setColor] = useState<ThemeColor>(selectColor(colorsMemo));
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();

  useEffect(() => {
    if (x == null || y == null) return;
    setColor(selectColor(colorsMemo, [x, y]));
  }, [colorsMemo, selectColor, x, y]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setX(event.nativeEvent.layout.x + event.nativeEvent.layout.width / 2);
    setY(event.nativeEvent.layout.y + event.nativeEvent.layout.height / 2);
  }, []);

  return { color, onLayout };
}
