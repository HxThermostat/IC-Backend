import React, { useContext, useMemo } from "react";

import { FeatureMapFieldsFragment as FeatureMap } from "~/graph";

type FeatureName = keyof FeatureMap;

type FeatureFlagsContext = {
  enabledFeatures: () => Array<FeatureName>;
  getVariant: <F extends FeatureName>(feature: F) => FeatureMap[F];
  handleEnabledFeature: <T, F extends FeatureName>(
    feature: F,
    handle: (variant: NonNullable<FeatureMap[F]>, feature: F) => T
  ) => T | null;
  handleEnabledFeatures: <T, F extends FeatureName>(
    feature: F[],
    handle: (variant: NonNullable<FeatureMap[F]>[], feature: F[]) => T
  ) => T | null;
  handleEnabledVariant: <T, F extends FeatureName, V extends FeatureMap[F]>(
    feature: F,
    variant: NonNullable<V>,
    handle: (variant: V, feature: F) => T,
    filter?: "every" | "some"
  ) => T | null;
  handleEnabledVariants: <T, F extends FeatureName, V extends FeatureMap[F]>(
    feature: F,
    variants: Array<NonNullable<V>>,
    handle: (variant: V[], feature: F) => T,
    filter?: "every" | "some"
  ) => T | null;
  handleFeature: <T, F extends FeatureName>(
    feature: F,
    handle: (variant: FeatureMap[F], feature: F) => T
  ) => T;
  isFeatureEnabled: <F extends FeatureName>(feature: F) => boolean;
  isVariantEnabled: <F extends FeatureName, V extends FeatureMap[F]>(
    feature: F,
    variant: V,
    filter?: "every" | "some"
  ) => boolean;
};

export type { FeatureFlagsContext, FeatureMap, FeatureName };

const FeatureFlagsContext = React.createContext<
  FeatureFlagsContext | undefined
>(undefined);

type FeatureFlagsContextProviderProps = React.PropsWithChildren<{
  features: FeatureMap | undefined;
}>;

export function FeatureFlagProvider({
  features,
  children,
}: FeatureFlagsContextProviderProps): JSX.Element {
  // Serializing allows useMemo to do effectively use the features
  // object as its dependency
  const serialized = JSON.stringify(features);
  const context: FeatureFlagsContext = useMemo(() => {
    if (!serialized) return {} as FeatureFlagsContext;

    const features = JSON.parse(serialized) as FeatureMap;

    const getVariant: FeatureFlagsContext["getVariant"] = (feature) => {
      return features[feature];
    };

    const isFeatureEnabled: FeatureFlagsContext["isFeatureEnabled"] = (
      feature
    ) => {
      const variant = features[feature];
      return Array.isArray(variant) ? variant.length > 0 : variant != null;
    };

    const isVariantEnabled: FeatureFlagsContext["isVariantEnabled"] = (
      feature,
      variant,
      filter = "every"
    ) => {
      // We have to do a little type trickery here to handle the
      // list comparisons, but this should be safe because,
      // fundamentally, the feature variants are expressed as
      // strings
      const enabledVariant = features[feature] as string[];
      if (Array.isArray(enabledVariant)) {
        if (Array.isArray(variant)) {
          return (variant as string[])[filter]((v) =>
            enabledVariant.includes(v)
          );
        }
      }

      return features[feature] === variant;
    };

    return {
      enabledFeatures() {
        const enabled: Array<FeatureName> = [];

        for (const [key, value] of Object.entries(features)) {
          if (value != null) {
            enabled.push(key as FeatureName);
          }
        }

        return enabled;
      },
      getVariant,
      handleEnabledFeature(feature, handle) {
        if (isFeatureEnabled(feature)) {
          return handle(
            getVariant(feature) as NonNullable<FeatureMap[typeof feature]>,
            feature
          );
        }
        return null;
      },
      handleEnabledFeatures(features, handle) {
        const enabled = features.filter((feature) => isFeatureEnabled(feature));

        if (enabled.length > 0) {
          return handle(
            enabled.map(
              (feature) =>
                getVariant(feature) as NonNullable<FeatureMap[typeof feature]>
            ),
            enabled
          );
        }
        return null;
      },
      handleEnabledVariant(feature, variant, handle, filter = "every") {
        if (isVariantEnabled(feature, variant, filter)) {
          return handle(variant, feature);
        }
        return null;
      },
      handleEnabledVariants(feature, variants, handle, filter = "every") {
        const enabled = variants.filter((variant) =>
          isVariantEnabled(feature, variant, filter)
        );

        if (enabled.length > 0) {
          return handle(enabled, feature);
        }
        return null;
      },
      handleFeature(feature, handle) {
        return handle(features[feature], feature);
      },
      isFeatureEnabled,
      isVariantEnabled,
    };
  }, [serialized]);

  return (
    <FeatureFlagsContext.Provider value={context}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags(): FeatureFlagsContext {
  const context = useContext(FeatureFlagsContext);

  if (context === undefined) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider"
    );
  }

  return context;
}

export class UnsupportedVariant extends Error {
  constructor(feature: FeatureName, variant: FeatureMap[typeof feature]) {
    super(`${String(variant)} is not a supported variant of ${feature}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
