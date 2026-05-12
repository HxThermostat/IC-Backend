import { MutationTuple } from "@apollo/client";

import { ValuesType } from "utility-types";

import i18n from "~/i18n";

import { useActionSheet } from "./useActionSheet";

export const useConfirmDestructiveMutation = <TData, TVariables>(
  [mutation, result]: MutationTuple<TData, TVariables>,
  actionSheetParameters: Omit<
    ValuesType<
      Parameters<
        ReturnType<typeof useActionSheet>["showActionSheetWithOptions"]
      >
    >,
    "items"
  >,
  destructiveLabel: string
): MutationTuple<TData, TVariables> => {
  const { showActionSheetWithOptions } = useActionSheet();

  return [
    async (...args) => {
      return new Promise((resolve) => {
        showActionSheetWithOptions({
          ...actionSheetParameters,
          items: [
            {
              label: destructiveLabel,
              onPress: async () => {
                resolve(await mutation(...args));
              },
              destructive: true,
            },
            {
              label: i18n.t("Common.cancel"),
              cancel: true,
              onPress: () => resolve({}),
            },
          ],
        });
      });
    },
    result,
  ];
};
