import React, { PropsWithChildren } from "react";

import RawBackground, { BackgroundProps } from "~/components/Background";
import Screen from "~/components/Screen";

import { AppStateProvider } from "~/contexts";

import AppThemeProvider from "~/theme/AppThemeProvider";

export function ReStyleWrapper({
  children,
}: PropsWithChildren<unknown>): JSX.Element {
  return (
    <AppStateProvider>
      <AppThemeProvider>{children}</AppThemeProvider>
    </AppStateProvider>
  );
}

export function ScreenWrapper({
  children,
}: PropsWithChildren<unknown>): JSX.Element {
  return (
    <ReStyleWrapper>
      <Screen>{children}</Screen>
    </ReStyleWrapper>
  );
}

export function BackgroundWrapper({
  children,
  ...props
}: BackgroundProps): JSX.Element {
  return (
    <ReStyleWrapper>
      <RawBackground testID="background" {...props}>
        {children}
      </RawBackground>
    </ReStyleWrapper>
  );
}
