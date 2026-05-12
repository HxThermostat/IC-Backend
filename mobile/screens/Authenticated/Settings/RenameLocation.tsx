import React, { useMemo, useState } from "react";

import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";

import {
  WithQueryDataProps,
  withQueryData,
  GoBack,
  useRenameLocationMutation,
  useNamesQuery,
} from "~/graph";

import i18n from "~/i18n";

import SingleInputScreen from "./SingleInputScreen";
import { KohortFunnelEventStep, useKohortTracking } from "~/utils/kohort";

const scope = "Screens.Authenticated.SettingsNavigator.RenameLocation";

export type RenameLocationProps = {
  route: RouteProp<SettingsNavigatorRouteList, "RenameLocation">;
} & WithQueryDataProps<typeof useNamesQuery>;

function RenameLocation({
  data: { location },
}: RenameLocationProps): JSX.Element {
  if (!location) throw new GoBack();

  const { trackFeatureUse, trackFunnel } = useKohortTracking();
  const [name, setName] = useState(location.name);
  const [changeLocationName] = useRenameLocationMutation({
    variables: { input: { id: location.id, name } },
  });

  async function handlePressSave(): Promise<void> {
    if (name) {
      trackFeatureUse("Rename Location");
      trackFunnel({ step: KohortFunnelEventStep.Action });
      await changeLocationName();
    }
  }

  return (
    <SingleInputScreen
      allowEmptySubmission={false}
      handleSave={handlePressSave}
      value={name}
      label={i18n.t("label", { scope })}
      onChangeText={(value) => setName(value)}
      maxLength={16}
    />
  );
}

export default withQueryData(useNamesQuery, {
  useVariables: () => {
    const route = useRoute<
      RouteProp<SettingsNavigatorRouteList, "RenameLocation">
    >();
    return useMemo(() => ({ locationId: route.params.locationId }), [
      route.params.locationId,
    ]);
  },
})(RenameLocation);
