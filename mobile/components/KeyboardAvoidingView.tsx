import React, { PropsWithChildren } from "react";

import {
  Platform,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps as RNKeyboardAvoidingViewProps,
  StyleSheet,
} from "react-native";

import { useResponsiveProp } from "@shopify/restyle";

import { BoxProps } from "./Box";

export interface KeyboardAvoidingViewProps extends RNKeyboardAvoidingViewProps {
  flexGrow?: BoxProps["flexGrow"];
}

export default function KeyboardAvoidingView({
  style,
  flexGrow: responsiveFlexGrow = 1,
  ...props
}: PropsWithChildren<KeyboardAvoidingViewProps>): JSX.Element {
  const behavior = Platform.select<KeyboardAvoidingViewProps["behavior"]>({
    ios: "padding",
    default: undefined,
  });

  const flexGrow = useResponsiveProp(responsiveFlexGrow);

  return (
    <RNKeyboardAvoidingView
      behavior={behavior}
      style={StyleSheet.flatten([{ flexGrow }, style])}
      {...props}
    />
  );
}
