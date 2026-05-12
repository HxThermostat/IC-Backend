import React, { useMemo } from "react";

import moment from "moment";

import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

import {
  GoBack,
  useSettingsFaultLogsLocationQuery,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import { withBackground } from "~/components/Background";
import { SectionList, Sections } from "~/components/Lists";

import i18n from "~/i18n";

export type FaultLogsProps = {
  navigation: NativeStackNavigationProp<
    SettingsNavigatorRouteList,
    "FaultLogDescription"
  >;
  route: RouteProp<SettingsNavigatorRouteList, "FaultLogDescription">;
} & WithQueryDataProps<typeof useSettingsFaultLogsLocationQuery>;

const scope = "Screens.Authenticated.SettingsNavigator.FaultLogDescription";

function FaultLogsDescription({
  route: { params },
  data: { location },
}: FaultLogsProps): JSX.Element {
  if (!location?.faultLogs || params.index >= location.faultLogs.length) {
    throw new GoBack();
  }

  const log = location.faultLogs[params.index];
  if (log.__typename !== "FaultLogLabelAndDescription") {
    throw new GoBack();
  }

  const sections: Sections = [
    {
      title: i18n.t("label", { scope }),
      data: [{ title: log.label }],
    },
    {
      title: i18n.t("date", { scope }),
      data: [{ title: moment(log.date).format("l LT") }],
    },
    {
      title: i18n.t("description", { scope }),
      data: [{ title: log.description }],
    },
  ];

  return <SectionList alwaysBounceVertical={false} sections={sections} />;
}

export default withBackground(
  withQueryData(useSettingsFaultLogsLocationQuery, {
    useVariables: () => {
      const route = useRoute<FaultLogsProps["route"]>();
      return useMemo(() => ({ locationId: route.params.locationId }), [
        route.params.locationId,
      ]);
    },
  })(FaultLogsDescription)
);
