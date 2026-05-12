import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { TextProps } from "~/components/Text";

import {
  AuthenticatedAppScreenNames,
  AuthenticatedAppScreenParams,
} from "~/navigators/types";

export type BaseListItem = {
  title: string;
  style?: StyleProp<ViewStyle>;
  titleSelectable?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  titleProps?: TextProps;
  subtitle?: string;
  subtitleSelectable?: boolean;
  subtitleStyle?: StyleProp<TextStyle>;
  rightTitleProps?: TextProps;
  rightContentContainerStyle?: StyleProp<ViewStyle>;
  rightElement?: React.ReactElement;
  leftElement?: React.ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
  destructive?: boolean;
  disabled?: boolean;
  displayBadge?: boolean;
  displayChevronIOS?: boolean;
  navigate?: {
    name: AuthenticatedAppScreenNames;
    params?: AuthenticatedAppScreenParams;
  };
  actsAsButton?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  delayLongPress?: number;
};
