import { createBox } from "@shopify/restyle";

import { Theme } from "~/theme";

import { BoxProps } from "./Box";

// There's probably some easy to not do this? Pulled from internal return type of `createBox`
type BoxReturnType<P> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<BoxProps & Pick<P, Exclude<keyof P, keyof BoxProps>>> &
    React.RefAttributes<unknown>
> & {
  defaultProps?:
    | Partial<
        React.PropsWithoutRef<
          BoxProps & Pick<P, Exclude<keyof P, keyof BoxProps>>
        > &
          React.RefAttributes<unknown>
      >
    | undefined;
};

// It wants us to use `Record<string, unknown> instead of `object`, but this causes errors when wrapping components in general.
// eslint-disable-next-line @typescript-eslint/ban-types
export const withBoxProps = <P extends object>(
  Component: React.ComponentType<P>
): BoxReturnType<P> => createBox<Theme, P>(Component);
