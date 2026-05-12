import React, { ComponentType, useCallback, useEffect } from "react";

import { QueryHookOptions, QueryResult } from "@apollo/client";

import { useNavigation } from "@react-navigation/native";

import { useController, useQueryId } from "~/contexts";

import { useFocusPolling } from "~/hooks";

import LoadingIndicator from "~/components/Loading";
import { BottomSheetModalMethods } from "~/components/BottomSheetModal";

type NonUndefined<A> = A extends undefined ? never : A;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractQuery<H extends (...args: any) => any> = NonUndefined<
  ReturnType<H>["data"]
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HookConstraint = (...args: any) => any;

type Props<Q> = {
  data: Q;
  startPolling: (interval?: number) => void;
  stopPolling: () => void;
};

type DataHookProp<H extends HookConstraint> = ExtractQuery<H>;
export type WithQueryDataProps<H extends HookConstraint> = Props<
  DataHookProp<H>
>;

type QueryHook<Q, V> = (
  baseOptions?: QueryHookOptions<Q, V>
) => QueryResult<Q, V>;

export class GoBack extends Error {
  constructor() {
    super("Component was unable to ");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

type GoBackBoundaryProps = {
  navigation?: ReturnType<typeof useNavigation>;
};

type GoBackBoundaryState = {
  hasError: boolean;
};

class GoBackBoundary extends React.Component<GoBackBoundaryProps> {
  public state: GoBackBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): GoBackBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    if (error instanceof GoBack && this.props.navigation) {
      this.props.navigation.goBack();
    } else {
      throw error;
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <></>;
    }

    return this.props.children;
  }
}

export const withQueryData = <Q, V>(
  useQuery: QueryHook<Q, V>,
  {
    options,
    useVariables: loadVariables,
    variables: staticVariables,
    disableGoBack,
    focusPollInterval = 5000,
  }: {
    options?: Omit<QueryHookOptions<Q, V>, "pollInterval">;
    useVariables?: (
      controllerContext: ReturnType<typeof useController>,
      queryIdContext: ReturnType<typeof useQueryId>
    ) => V | undefined;
    variables?: V;
    disableGoBack?: boolean;
    focusPollInterval?: number;
  } = {},
  Loading = LoadingIndicator
) => <P extends Props<Q>>(
  WrappedComponent: ComponentType<P>
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Omit<P, keyof Props<unknown> | "forwardedRef">> &
    React.RefAttributes<BottomSheetModalMethods>
> => {
  return React.forwardRef(
    (
      props: Omit<P, keyof Props<unknown> | "forwardedRef">,
      ref: React.ForwardedRef<BottomSheetModalMethods>
    ) => {
      const controllerContext = useController();
      const navigation = useNavigation();
      const queryIdContext = useQueryId();

      const variables =
        staticVariables != null
          ? staticVariables
          : (loadVariables &&
              loadVariables(controllerContext, queryIdContext)) ??
            undefined;

      const fetchPolicy = "cache-first";
      const queryResult = useQuery({
        fetchPolicy,
        ...options,
        pollInterval: 0, // We handle polling via the focusPolling hook
        variables,
      });

      const {
        data,
        loading,
        startPolling: _startPolling,
        stopPolling: _stopPolling,
        refetch: _refetch,
      } = queryResult;

      // In order for the useFocusPolling hook to work as expected, we
      // need the start/stop/refetch references to change when the
      // variables change. We don't actually need the variables value
      // in any of these useCallback blocks, but we're including them
      // to keep the eslint react-hooks/exhaustive-deps rule happy
      // (without silencing it altogether)

      const startPolling = useCallback(
        (pollInterval: number = focusPollInterval) => {
          variables;
          return _startPolling(pollInterval);
        },
        [_startPolling, variables]
      );
      const stopPolling = useCallback(() => {
        variables;
        return _stopPolling();
      }, [_stopPolling, variables]);
      const refetch = useCallback(() => {
        variables;
        return _refetch();
      }, [_refetch, variables]);

      const queryFailed = !loading && !data;

      useEffect(() => {
        if (queryFailed) {
          // kraftful/klimate#371: Add Sentry logging

          if (!disableGoBack) {
            navigation.goBack();
          } else {
            // kraftful/klimate#371: What should we actually do here?
            throw new Error();
          }
        }
      }, [navigation, queryFailed]);

      useFocusPolling({
        refetch,
        startPolling,
        stopPolling,
        focusPollInterval,
        fetchPolicy: options?.fetchPolicy ?? fetchPolicy,
      });

      if (!data) {
        return <Loading />;
      }

      // The typecast is kind of a bummer but should be safe
      // https://stackoverflow.com/a/51084259
      return (
        <GoBackBoundary navigation={disableGoBack ? undefined : navigation}>
          <WrappedComponent
            {...(props as P)}
            data={data}
            startPolling={startPolling}
            stopPolling={stopPolling}
            forwardedRef={ref}
          />
        </GoBackBoundary>
      );
    }
  );
};
