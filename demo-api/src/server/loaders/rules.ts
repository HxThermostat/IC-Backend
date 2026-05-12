import { AylaRule, getRules } from "ayla-client";

import DataLoader from "dataloader";

import * as Sentry from "@sentry/node";

import type { Loaders } from ".";

export function rulesLoader(): DataLoader<string, AylaRule[]> {
  return new DataLoader(
    async (ids: readonly string[]) => {
      const [accessToken] = ids;

      let rules: AylaRule[];

      try {
        rules = await getRules({ accessToken });
      } catch (e) {
        Sentry.captureException(e);
        rules = [];
      }

      return [rules];
    },
    { batch: false }
  );
}

export function ruleLoader(
  loadRules: ReturnType<typeof rulesLoader>,
  accessToken?: string
): Loaders["rule"] {
  return new DataLoader(async (names: readonly string[]) => {
    if (!accessToken) return names.map(() => null);

    const rules = await loadRules.load(accessToken);

    return names.map((name) => {
      return rules.find((rule) => rule.name === name) ?? null;
    });
  });
}
