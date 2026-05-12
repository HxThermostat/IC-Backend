import { PropsWithChildren } from "react";
import { BoxProps as RsBoxProps, createBox } from "@shopify/restyle";

import { Theme } from "~/theme";

export type BoxProps = RsBoxProps<Theme>;
export type BoxWithChildrenProps = PropsWithChildren<BoxProps>;

export const Box = createBox<Theme>();
