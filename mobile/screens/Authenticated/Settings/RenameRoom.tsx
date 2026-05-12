import React, { useMemo, useState } from "react";

import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";

import {
  useRenameControllerMutation,
  useControllerNameQuery,
  withQueryData,
  WithQueryDataProps,
  GoBack,
} from "~/graph";

import i18n from "~/i18n";

import SingleInputScreen from "./SingleInputScreen";
import { KohortFunnelEventStep, useKohortTracking } from "~/utils/kohort";

export type RenameRoomProps = WithQueryDataProps<typeof useControllerNameQuery>;

const scope = "Screens.Authenticated.SettingsNavigator.RenameRoom";

function RenameRoom({ data: { controller } }: RenameRoomProps): JSX.Element {
  if (!controller) throw new GoBack();

  const { trackFeatureUse, trackFunnel } = useKohortTracking();
  const [name, setName] = useState(controller.name);
  const [changeControllerName] = useRenameControllerMutation({
    variables: { input: { id: controller.id, name } },
  });

  async function handlePressSave(): Promise<void> {
    if (name) {
      trackFeatureUse("Rename Controller");
      trackFunnel({ step: KohortFunnelEventStep.Action });
      await changeControllerName();
    }
  }

  return (
    <SingleInputScreen
      allowEmptySubmission={false}
      value={name}
      label={i18n.t("label", { scope })}
      onChangeText={(value: string) => setName(value)}
      handleSave={handlePressSave}
      maxLength={16}
    />
  );
}

export default withQueryData(useControllerNameQuery, {
  useVariables: () => {
    const route = useRoute<
      RouteProp<SettingsNavigatorRouteList, "RenameRoom">
    >();
    return useMemo(() => ({ controllerId: route.params.controllerId }), [
      route.params.controllerId,
    ]);
  },
})(RenameRoom);
