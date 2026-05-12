import { RouteProp } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import moment from "moment";
import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Dimensions, LayoutAnimation } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { useDebouncedCallback } from "use-debounce";

import Box, { Row } from "~/components/Box";
import Cloak from "~/components/Cloak";
import { AddTemperaturePresetIcon } from "~/components/Icons";
import DateTimePicker from "~/components/Pickers/DateTimePicker";
import {
  DaysLongName,
  getDayEnum,
  nextDay,
  toDate,
} from "~/components/Schedules";
import Screen from "~/components/Screen";
import { ConnectedTemperaturePresetItem } from "~/components/TemperaturePresets";
import Text from "~/components/Text";
import { Link, Touchable } from "~/components/Touchables";
import { QueryIdProvider, useDeviceContext } from "~/contexts";
import {
  useConfirmDestructiveMutation,
  useHeaderButton,
  useLazyEffect,
  useSaveButton,
  useScheduleLinearGradient,
} from "~/hooks";
import { useTheme } from "~/theme";

import {
  GoBack,
  TemperaturePreset,
  useAddScheduleEventMutation,
  useChangeScheduleEventMutation,
  useManageScheduleQuery,
  useNewScheduleQuery,
  useRemoveScheduleEventMutation,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import i18n from "~/i18n";

import { makeToDisplay } from "~/utils/display";

import { ManageScheduleNavigatorRouteList } from "~/navigators/ManageScheduleNavigator";
import { KohortFunnelEventStep, useKohortTracking } from "~/utils/kohort";

const scope = "Screens.Authenticated.SchedulesNavigator.ManageSchedule";

const window = Dimensions.get("window");

const getDefaultEndDate = (date: Date): Date =>
  moment(date).add(2, "hours").toDate();

export type ManageScheduleProps = {
  navigation: NativeStackNavigationProp<
    ManageScheduleNavigatorRouteList,
    "ManageSchedule"
  >;
  route: RouteProp<ManageScheduleNavigatorRouteList, "ManageSchedule">;
} & WithQueryDataProps<typeof useManageScheduleQuery>;

function ManageSchedule({
  navigation,
  route,
  data: { controller, scheduleEvent },
}: ManageScheduleProps): JSX.Element {
  if (!controller) throw new GoBack();
  if (!controller.schedule) throw new GoBack();

  const { day } = route.params;

  const {
    location: { id: locationId, temperatureUnit, temperaturePresets },
  } = controller;

  const toDisplay = makeToDisplay(temperatureUnit);
  const { isIpad } = useDeviceContext();

  const isEditing = !!scheduleEvent?.id;

  const { minEventInterval } = controller.schedule;

  const temperaturePreset = scheduleEvent?.temperaturePreset;
  const slot = temperaturePreset?.slot;

  const [screenWidth, setScreenWidth] = useState(isIpad ? 0 : window.width);

  const { spacing } = useTheme();

  const [startDate, setStartDate] = useState(
    scheduleEvent
      ? toDate(scheduleEvent.start)
      : moment()
          .day(day ? DaysLongName[day] : "")
          .toDate()
  );

  const [endDate, setEndDate] = useState(
    scheduleEvent ? toDate(scheduleEvent.end) : getDefaultEndDate(startDate)
  );

  const [endsTomorrow, setEndsTomorrow] = useState(false);

  const { trackFeatureUse, trackFunnel } = useKohortTracking();

  useEffect(() => {
    setEndsTomorrow(endDate.getDay() > startDate.getDay());
  }, [endDate, startDate]);

  useEffect(() => {
    if (endDate.getTime() - startDate.getTime() < minEventInterval * 60000) {
      setEndDate(moment(startDate).add(minEventInterval, "minutes").toDate());
    }
  }, [minEventInterval, startDate, endDate]);

  const [presetSelected, setPresetSelected] = useState(temperaturePreset);

  const [removeSchedule] = useConfirmDestructiveMutation(
    useRemoveScheduleEventMutation({
      variables: {
        input: {
          id: controller.id,
          scheduleEventId: scheduleEvent?.id ?? "",
        },
      },
      update: (cache, { data }) => {
        if (
          data?.removeScheduleEvent.__typename === "RemoveScheduleEventSuccess"
        ) {
          scheduleEvent && cache.evict({ id: cache.identify(scheduleEvent) });
        }
      },
      onCompleted: ({ removeScheduleEvent }) => {
        if (removeScheduleEvent.__typename === "RemoveScheduleEventSuccess") {
          navigation.goBack();
        }
      },
    }),
    {
      title: i18n.t("deleteScheduleSheet.title", { scope }),
      message: i18n.t("deleteScheduleSheet.message", { scope }),
    },
    i18n.t("delete", { scope })
  );

  const [
    changeScheduleEvent,
    { loading: editLoading },
  ] = useChangeScheduleEventMutation({
    onCompleted: ({
      changeScheduleEventTemperaturePreset,
      changeScheduleEventTime,
    }) => {
      if (
        changeScheduleEventTemperaturePreset.__typename ===
          "ChangeScheduleEventTemperaturePresetSuccess" ||
        changeScheduleEventTime.__typename === "ChangeScheduleEventTimeSuccess"
      ) {
        navigation.goBack();
      }
    },
  });

  const [addSchedule, { loading: addLoading }] = useAddScheduleEventMutation({
    onCompleted: ({ addScheduleEvent }) => {
      if (addScheduleEvent.__typename === "AddScheduleEventSuccess") {
        navigation.goBack();
      }
    },
  });

  const handleSaveChangeSchedule = useCallback(() => {
    if (!scheduleEvent?.id) return;
    if (!presetSelected?.id) return;

    trackFeatureUse("Change Schedule", slot || "Unknown");
    trackFunnel({ step: KohortFunnelEventStep.Action });

    void changeScheduleEvent({
      variables: {
        timeInput: {
          id: scheduleEvent.id,
          start: {
            day: getDayEnum(startDate.getDay()),
            hour: startDate.getHours(),
            minute: startDate.getMinutes(),
          },
          end: {
            day: getDayEnum(endDate.getDay()),
            hour: endDate.getHours(),
            minute: endDate.getMinutes(),
          },
        },
        temperaturePresetInput: {
          id: scheduleEvent.id,
          temperaturePresetId: presetSelected.id,
        },
      },
    });
  }, [
    changeScheduleEvent,
    startDate,
    endDate,
    scheduleEvent?.id,
    presetSelected?.id,
    trackFeatureUse,
    trackFunnel,
    slot,
  ]);

  const handleSaveNewEvent = useCallback(() => {
    if (!presetSelected?.id) return;
    trackFeatureUse("Create Schedule");
    trackFunnel({ step: KohortFunnelEventStep.Action });
    const day = getDayEnum(startDate.getDay());
    void addSchedule({
      variables: {
        input: {
          id: controller.id,
          start: {
            day,
            hour: startDate.getHours(),
            minute: startDate.getMinutes(),
          },
          end: {
            day: endsTomorrow ? nextDay(day) : day,
            hour: endDate.getHours(),
            minute: endDate.getMinutes(),
          },
          temperaturePresetId: presetSelected.id,
        },
      },
    });
  }, [
    addSchedule,
    controller.id,
    endDate,
    endsTomorrow,
    presetSelected?.id,
    startDate,
    trackFeatureUse,
    trackFunnel,
  ]);

  const { didChange } = useSaveButton({
    loading: isEditing ? editLoading : addLoading,
    disabled: false,
    handleSave: isEditing ? handleSaveChangeSchedule : handleSaveNewEvent,
    placement: "headerRight",
    text: i18n.t("Common.save"),
  });

  useLazyEffect(() => {
    didChange();
  }, [startDate, endDate, presetSelected]);

  useHeaderButton({
    loading: false,
    disabled: false,
    onPress: () => navigation.goBack(),
    placement: "headerLeft",
    text: i18n.t("Common.done"),
  });

  const fontColor = isEditing ? "textOnColor" : "text";

  function handleSelectPreset(preset: TemperaturePreset): void {
    setPresetSelected(preset);
  }

  function goToEditPreset(preset: TemperaturePreset): void {
    navigation.navigate("ManageTemperaturePreset", {
      locationId: locationId,
      temperaturePresetId: preset.id,
    });
  }

  function goToNewTemperaturePreset(): void {
    navigation.navigate("NewTemperaturePreset", {
      locationId,
    });
  }

  const resetEndDate = useCallback(() => {
    setEndDate(
      scheduleEvent ? toDate(scheduleEvent.end) : getDefaultEndDate(startDate)
    );
  }, [scheduleEvent, startDate]);

  const handleStartDateChange = useCallback(
    (date: Date) => {
      if (date > endDate) {
        setEndDate(getDefaultEndDate(date));
      }
      setStartDate(date);
    },
    [endDate]
  );

  const handleEndDateChange = useCallback(
    (date: Date) => {
      const revertToSameDayEvent =
        endsTomorrow &&
        moment.duration(moment(date).diff(startDate)).asDays() > 1;

      if (revertToSameDayEvent) {
        date.setDate(date.getDate() - 1);
      } else if (date < startDate) {
        date.setDate(date.getDate() + 1);
      }
      setEndDate(date);
    },
    [startDate, endsTomorrow]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t(isEditing ? "titleEdit" : "titleAdd", { scope }),
    });
  }, [navigation, isEditing]);

  const presetIsSetByDevice = isEditing && !slot;

  const gradientProps = useScheduleLinearGradient(
    presetIsSetByDevice ? "VIRTUAL" : slot
  );

  const itemWidth = useMemo(() => {
    const itemsPerRow = 3;
    const paddingHorizontal = spacing.l * 2;
    return screenWidth / itemsPerRow - paddingHorizontal / itemsPerRow;
  }, [screenWidth, spacing.l]);

  const { callback } = useDebouncedCallback((width) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setScreenWidth(width);
  }, 500);

  return (
    <Screen
      edges={["right", "left"]}
      backgroundProps={isEditing ? gradientProps : undefined}
      paddingHorizontal="z"
      marginBottom="l"
    >
      <Box paddingHorizontal="l" marginBottom="l">
        <Row
          justifyContent="space-between"
          alignItems="center"
          marginVertical="l"
        >
          <Box flex={1}>
            <Text variant="bodyStrong" color={fontColor}>
              {i18n.t("startsAt", { scope })}
            </Text>
          </Box>

          <DateTimePicker
            mode="time"
            value={startDate}
            onValueChange={handleStartDateChange}
          />
        </Row>
        <Row
          justifyContent="space-between"
          alignItems="center"
          marginVertical="l"
        >
          <Box flex={1}>
            <Text variant="bodyStrong" color={fontColor}>
              {i18n.t("endsAt", { scope })}
            </Text>
          </Box>

          <DateTimePicker
            mode="time"
            value={endDate}
            onValueChange={handleEndDateChange}
          />
        </Row>
        {endsTomorrow && (
          <Row>
            {/* placeholder UI */}
            <Text color={fontColor}>{i18n.t("note", { scope })}: </Text>
            <Link
              onPress={resetEndDate}
              text={i18n.t("reset", { scope })}
              color={fontColor}
            />
          </Row>
        )}
      </Box>

      <Row
        borderBottomWidth={0.5}
        borderBottomColor={fontColor}
        paddingBottom={"xs"}
        marginLeft="l"
      >
        <Text variant="bodyStrong" color={fontColor}>
          {i18n.t("temperatureLabel", { scope })}
        </Text>
      </Row>
      <Box
        paddingHorizontal="l"
        onLayout={({
          nativeEvent: {
            layout: { width },
          },
        }) => callback(width)}
      >
        <Cloak visible={itemWidth > 0}>
          {({ opacity }) => {
            return (
              <Row opacity={opacity} flexWrap="wrap">
                {[
                  ...(scheduleEvent && presetIsSetByDevice
                    ? [scheduleEvent.temperaturePreset]
                    : []),
                  ...(temperaturePresets ?? []),
                ].map((preset, index) => {
                  const isSelected = presetSelected?.id === preset.id;

                  return (
                    <QueryIdProvider key={index} queryId={preset.id}>
                      <ConnectedTemperaturePresetItem
                        toDisplay={toDisplay}
                        isSelected={isSelected}
                        isEditing={isEditing}
                        onPress={() => handleSelectPreset(preset)}
                        onPressEdit={() => goToEditPreset(preset)}
                        marginTop={"m"}
                        width={itemWidth}
                      />
                    </QueryIdProvider>
                  );
                })}
                <Touchable
                  onPress={goToNewTemperaturePreset}
                  marginTop={"m"}
                  width={itemWidth}
                  alignItems="center"
                >
                  <AddTemperaturePresetIcon size={35} color="text" />
                  <Text
                    marginTop="xs"
                    variant="scheduleTitleMetadata"
                    textAlign="center"
                    color={fontColor}
                  >
                    {i18n.t("add", { scope })}
                  </Text>
                </Touchable>
              </Row>
            );
          }}
        </Cloak>
        {isEditing && scheduleEvent?.removable && (
          <Row justifyContent="flex-end" marginTop="l">
            <Link
              onPress={removeSchedule}
              text={i18n.t("delete", { scope })}
              color={fontColor}
            />
          </Row>
        )}
      </Box>
    </Screen>
  );
}

export const NewSchedule = withQueryData(useNewScheduleQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables: ({ controllerId }) =>
    useMemo(() => ({ controllerId }), [controllerId]),
})(ManageSchedule);

export default withQueryData(useManageScheduleQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables({ controllerId }) {
    const route = useRoute<
      RouteProp<ManageScheduleNavigatorRouteList, "ManageSchedule">
    >();
    return useMemo(
      () => ({ scheduleEventId: route.params.scheduleId ?? "", controllerId }),
      [route.params.scheduleId, controllerId]
    );
  },
})(ManageSchedule);
