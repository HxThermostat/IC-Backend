import { Theme, theme, darkTheme } from ".";
import { ThemeProvider } from "@shopify/restyle";
import * as SplashScreen from "expo-splash-screen";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Appearance, ColorSchemeName, Platform, StatusBar } from "react-native";
import {
  Provider as PaperProvider,
  DefaultTheme as DefaultPaperTheme,
} from "react-native-paper";

import { useAppState } from "~/contexts";

import { colors, darkPalette, defaultPalette } from "./color";

interface AppThemeProviderProps {
  children: ReactNode;
}

const AppThemeProvider = ({ children }: AppThemeProviderProps): JSX.Element => {
  const themeManifestLoaded = useRef(false);

  const [appearance, setAppearance] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  const [customTheme, setCustomTheme] = useState<Theme>(theme);
  const [customDarkTheme, setCustomDarkTheme] = useState<Theme>(darkTheme);

  const [currentTheme, setCurrentTheme] = useState<Theme>(
    appearance === "dark" ? darkTheme : theme
  );

  const handleAppearanceChange = useCallback(
    (): void => setAppearance(Appearance.getColorScheme()),
    []
  );

  useEffect(() => {
    Appearance.addChangeListener(handleAppearanceChange);
    return () => Appearance.removeChangeListener(handleAppearanceChange);
  }, [handleAppearanceChange]);

  const appState = useAppState();

  useEffect(() => {
    // android doesn't seem to get picked up by the listeners above, so we manually check here when the app comes back to active state
    if (
      Platform.OS === "android" &&
      appState === "active" &&
      appearance !== Appearance.getColorScheme()
    ) {
      setAppearance(Appearance.getColorScheme());
    }
  }, [appState, appearance]);

  useEffect(() => {
    setCurrentTheme(appearance === "dark" ? customDarkTheme : customTheme);
  }, [appearance, customDarkTheme, customTheme]);

  useEffect(() => {
    if (themeManifestLoaded?.current) {
      return;
    }

    void (async () => {
      const loadedTheme = await import("./custom-theme");

      setCustomTheme((current) => ({
        ...current,
        colors: colors({
          ...defaultPalette,
          ...loadedTheme.lightPalette,
        }),
      }));

      setCustomDarkTheme((current) => ({
        ...current,
        colors: colors({
          ...darkPalette,
          ...loadedTheme.lightPalette,
          ...loadedTheme.darkPalette,
        }),
      }));

      setCurrentTheme(appearance === "dark" ? customDarkTheme : customTheme);

      themeManifestLoaded.current = true;

      await SplashScreen.hideAsync();
    })();
  });

  const paperTheme = useMemo(
    () => ({
      ...DefaultPaperTheme,
      dark: appearance === "dark",
      colors: {
        ...DefaultPaperTheme.colors,
        primary: currentTheme.colors.tint,
        background: currentTheme.colors.backgroundGradientStart,
        disabled: currentTheme.colors.textDisabled,
        placeholder: currentTheme.colors.textPlaceholder,
        text: currentTheme.colors.text,
      },
    }),
    [appearance, currentTheme]
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <StatusBar
        barStyle={appearance === "dark" ? "light-content" : "dark-content"}
        backgroundColor={"transparent"}
        translucent={true}
        animated={true}
      />
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeProvider>
  );
};

export default AppThemeProvider;
