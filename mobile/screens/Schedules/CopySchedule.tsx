import React, { useEffect, useMemo, useState } from "react";

import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { RouteProp } from "@react-navigation/core";

import { FlatList } from "react-native-gesture-handler";

import { SchedulesNavigatorRouteList } from "~/navigators/SchedulesNavigator";

import { ListScreen } from "~/components/Screen";
import {
  ScheduleCard,
  DaySelector,
  DaysLongName,
} from "~/components/Schedules";

import Text from "~/components/Text";
import Box from "~/components/Box";

import { QueryIdProvider } from "~/contexts";

import { useBackButton, useSaveButton } from "~/hooks";

import i18n from "~/i18n";

import {
  Day,
  GoBack,
  ScheduleEventFieldsFragment,
  useCopyScheduleQuery,
  withQueryData,
  WithQueryDataProps,
  useMakeScheduleCopyMutation,
} from "~/graph";

import { makeToDisplay } from "~/utils/display";
import { KohortFunnelEventStep, useKohortTracking } from "~/utils/kohort";

const scope = "Screens.Authenticated.SchedulesNavigator.CopySchedule";

type CopyScheduleProps = {
  navigation: NativeStackNavigationProp<
    SchedulesNavigatorRouteList,
    "CopySchedule"
  >;
  route: RouteProp<SchedulesNavigatorRouteList, "CopySchedule">;
} & WithQueryDataProps<typeof useCopyScheduleQuery>;

function CopySchedule({
  navigation,
  route,
  data,
}: CopyScheduleProps): JSX.Element {
  const { controller } = data;
  if (!controller) throw new GoBack();

  const { trackFeatureUse, trackFunnel } = useKohortTracking();

  const toDisplay = makeToDisplay(controller.location.temperatureUnit);

  const { day } = route.params;
  const [selectedDays, setSelectedDays] = useState<Day[]>([day]);

  const dayName = DaysLongName[day];
  const events = controller.schedule?.[dayName]?.events ?? [];

  const [copySchedule, { loading }] = useMakeScheduleCopyMutation({
    variables: {
      input: {
        id: controller.id,
        source: day,
        destination: selectedDays.filter((d) => d !== day),
      },
    },
    onCompleted: ({ copySchedule }) => {
      if (copySchedule.__typename === "CopyScheduleSuccess") {
        navigation.goBack();
      }
    },
  });

  useBackButton({ placement: "headerLeft", text: i18n.t("Common.cancel") });

  const { didChange } = useSaveButton({
    loading: loading,
    handleSave: () => {
      trackFeatureUse("Copy Schedule");
      trackFunnel({ step: KohortFunnelEventStep.Action });
      void copySchedule();
    },
    placement: "headerRight",
    text: i18n.t("copy", { scope }),
  });

  useEffect(() => {
    didChange(selectedDays.length > 1);
  }, [didChange, selectedDays]);

  function handleDaySelect(selectedDay: Day): void {
    // The source schedule's day should always remain selected
    if (day === selectedDay) return;

    if (selectedDays.includes(selectedDay)) {
      setSelectedDays(selectedDays.filter((d) => d !== selectedDay));
    } else {
      setSelectedDays([...selectedDays, selectedDay]);
    }
    didChange();
  }

  return (
    <ListScreen edges={["right", "left"]} marginBottom="l">
      <FlatList<ScheduleEventFieldsFragment>
        ListHeaderComponent={
          <Box marginVertical="l">
            <Text variant="bodyStrong" marginBottom="m">
              {i18n.t("header", { scope })}
            </Text>
            <DaySelector selected={selectedDays} onPress={handleDaySelect} />
          </Box>
        }
        data={events}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <QueryIdProvider queryId={item.id}>
            <ScheduleCard
              onPress={noop}
              useEmptyState={true}
              toDisplay={toDisplay}
            />
          </QueryIdProvider>
        )}
      />
    </ListScreen>
  );
}

export default withQueryData(useCopyScheduleQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables: ({ controllerId }) =>
    useMemo(() => ({ controllerId }), [controllerId]),
})(CopySchedule);
