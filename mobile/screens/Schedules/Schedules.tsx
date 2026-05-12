import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Animated } from "react-native";

import { FlatList } from "react-native-gesture-handler";

import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { RouteProp } from "@react-navigation/core";

import { SchedulesNavigatorRouteList } from "~/navigators/SchedulesNavigator";

import { ListScreen } from "~/components/Screen";

import { Link } from "~/components/Touchables";
import AddScheduleIcon from "~/components/Icons/AddScheduleIcon";
import Box, { Row } from "~/components/Box";
import {
  DaySelector,
  ScheduleCard,
  getDayEnum,
  DaysLongName,
} from "~/components/Schedules";

import { QueryIdProvider } from "~/contexts";

import {
  Day,
  GoBack,
  ScheduleEventFieldsFragment,
  useSchedulesQuery,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import { makeToDisplay } from "~/utils/display";

import i18n from "~/i18n";

import { useTheme } from "~/theme";
import { useKohortTracking } from "~/utils/kohort";

const scope = "Screens.Authenticated.SchedulesNavigator.Schedules";

export type SchedulesProps = {
  navigation: NativeStackNavigationProp<
    SchedulesNavigatorRouteList,
    "Schedules"
  >;
  route: RouteProp<SchedulesNavigatorRouteList, "Schedules">;
} & WithQueryDataProps<typeof useSchedulesQuery>;

function Schedules({ navigation, data }: SchedulesProps): JSX.Element {
  const { controller } = data;
  if (!controller) throw new GoBack();

  const { colors } = useTheme();
  const { trackFeatureUse } = useKohortTracking();

  const scrollY = useRef(new Animated.Value(0)).current;

  const toDisplay = makeToDisplay(controller.location.temperatureUnit);

  const [selectedDay, setSelectedDay] = useState<Day>(
    getDayEnum(new Date().getDay())
  );

  const day = DaysLongName[selectedDay];
  const schedule = controller.schedule?.[day];

  function handleDaySelect(day: Day): void {
    setSelectedDay(day);
  }

  const goToManageSchedule = useCallback(
    (id?: string) => {
      trackFeatureUse("View Schedule");
      navigation.navigate("ManageSchedule", {
        screen: "ManageSchedule",
        params: {
          scheduleId: id,
        },
      });
    },
    [navigation, trackFeatureUse]
  );

  const goToNewSchedule = useCallback(() => {
    navigation.navigate("ManageSchedule", {
      screen: "NewSchedule",
      params: {
        day: selectedDay,
      },
    });
  }, [navigation, selectedDay]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerRight: () =>
        schedule?.full ? null : (
          <AddScheduleIcon
            onPress={goToNewSchedule}
            backgroundColor={scrollY.interpolate({
              inputRange: [0, 50],
              outputRange: [colors.scheduleAddStart, colors.scheduleAddEnd],
              extrapolate: "clamp",
            })}
          />
        ),
    });
  }, [
    navigation,
    goToNewSchedule,
    schedule?.full,
    scrollY,
    colors.scheduleAddStart,
    colors.scheduleAddEnd,
  ]);

  return (
    <ListScreen edges={["right", "left"]}>
      <FlatList<ScheduleEventFieldsFragment>
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Box marginVertical="l">
            <DaySelector onPress={handleDaySelect} selected={selectedDay} />
          </Box>
        }
        data={schedule?.events}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <QueryIdProvider queryId={item.id}>
            <ScheduleCard
              onPress={() => goToManageSchedule(item.id)}
              toDisplay={toDisplay}
            />
          </QueryIdProvider>
        )}
        ListFooterComponent={
          <Row justifyContent="flex-end" marginBottom="l">
            <Link
              onPress={() => {
                navigation.navigate("CopySchedule", {
                  day: selectedDay,
                });
              }}
              text={i18n.t("button", { scope })}
            />
          </Row>
        }
      />
    </ListScreen>
  );
}

export default withQueryData(useSchedulesQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables: ({ controllerId }) =>
    useMemo(() => ({ controllerId }), [controllerId]),
})(Schedules);
