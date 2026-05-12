import { RouteProp } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";

import { AdjustTemperatureGradientBlock } from "~/components/AdjustTemperatureBlock";
import Box, { VSpacer } from "~/components/Box";
import Cloak from "~/components/Cloak";
import { TextInputWithLabel } from "~/components/Inputs";
import KeyboardAvoidingView from "~/components/KeyboardAvoidingView";
import Screen from "~/components/Screen";
import SetpointRenderer from "~/components/SetpointRenderer";
import Text from "~/components/Text";
import { Link, SingleListItemButton } from "~/components/Touchables";
import { useFeatureFlags } from "~/contexts";
import {
  useConfirmDestructiveMutation,
  useDualRangeSafe,
  useRangeSafe,
  useSaveButton,
  useSetpointState,
} from "~/hooks";

import {
  DualSetpoint,
  DualSetpointInput,
  FanMode,
  GoBack,
  SingleSetpoint,
  SingleSetpointInput,
  TemperaturePresetsFieldsFragmentDoc,
  useAddTemperaturePresetMutation,
  useChangeTemperaturePresetMutation,
  useManageTemperaturePresetQuery,
  useNewTemperaturePresetQuery,
  useRemoveTemperaturePresetMutation,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import i18n from "~/i18n";

import { makeToDisplay } from "~/utils/display";

import { ManageScheduleNavigatorRouteList } from "~/navigators/ManageScheduleNavigator";

const scope =
  "Screens.Authenticated.SchedulesNavigator.ManageTemperaturePreset";

export type ManageTemperaturePresetRouteParams = {
  locationId: string;
  temperaturePresetId?: string | null;
  unsavedFanMode?: FanMode;
};

export type ManageTemperaturePresetProps = {
  navigation: NativeStackNavigationProp<
    ManageScheduleNavigatorRouteList,
    "ManageTemperaturePreset"
  >;
  route: RouteProp<ManageScheduleNavigatorRouteList, "ManageTemperaturePreset">;
} & WithQueryDataProps<typeof useManageTemperaturePresetQuery>;

type CommonSetpointProps = {
  changeSetpoint: (input: SingleSetpointInput | DualSetpointInput) => void;
  toDisplay: (number: number) => number;
};

type DualSetpointPreset = CommonSetpointProps & {
  lower: number;
  upper: number;
  setpoint: DualSetpoint;
};

type SingleSetpointManageTemperaturePresetProps = {
  target: number;
  setpoint: SingleSetpoint;
} & CommonSetpointProps;

// Note: Still a bit TBD on the UI for this single setpoint
// https://kraftful.slack.com/archives/C01KWNZB9KJ/p1623707531008000?thread_ts=1623704812.000100&cid=C01KWNZB9KJ
const SingleSetpointManageTemperaturePreset = ({
  toDisplay,
  changeSetpoint,
  setpoint,
  target,
}: SingleSetpointManageTemperaturePresetProps): JSX.Element => {
  const onValuesChange = useCallback(
    (target: number) => changeSetpoint({ target }),
    [changeSetpoint]
  );

  const { decreaseValueSafe, increaseValueSafe } = useRangeSafe(
    target,
    setpoint,
    onValuesChange
  );

  return (
    <AdjustTemperatureGradientBlock
      type="heat"
      label="Target"
      currentTemperature={toDisplay(target)}
      onDecreasePress={decreaseValueSafe}
      onIncreasePress={increaseValueSafe}
    />
  );
};

const DualSetpointManageTemperaturePreset = ({
  toDisplay,
  changeSetpoint,
  setpoint,
  upper,
  lower,
}: DualSetpointPreset): JSX.Element => {
  const onValuesChange = useCallback(
    (lower: number, upper: number) => changeSetpoint({ lower, upper }),
    [changeSetpoint]
  );

  const {
    increaseDualRangeSafe: increaseSetpointSafe,
    decreaseDualRangeSafe: decreaseSetpointSafe,
  } = useDualRangeSafe(
    lower,
    upper,
    setpoint.lower,
    setpoint.upper,
    setpoint.minInterval,
    onValuesChange
  );
  return (
    <>
      <AdjustTemperatureGradientBlock
        type="heat"
        label="Heat to"
        currentTemperature={toDisplay(lower)}
        onDecreasePress={() => decreaseSetpointSafe("lower")}
        onIncreasePress={() => increaseSetpointSafe("lower")}
      />
      <AdjustTemperatureGradientBlock
        type="cool"
        label="Cool to"
        currentTemperature={toDisplay(upper)}
        onDecreasePress={() => decreaseSetpointSafe("upper")}
        onIncreasePress={() => increaseSetpointSafe("upper")}
      />
    </>
  );
};

function ManageTemperaturePreset({
  navigation,
  route,
  data: { location, temperaturePreset },
}: ManageTemperaturePresetProps): JSX.Element {
  if (!location || !location.temperaturePresets) throw new GoBack();

  const { id: locationId } = location;
  const isEditing = !!temperaturePreset;

  const { unsavedFanMode } = route.params;

  if (!temperaturePreset) {
    // If we're adding a new preset (i.e we don't have a preset from the graph)
    // default to the HOME preset for creating a new preset
    const defaultTemplate = location.temperaturePresets.find(
      (preset) => preset.slot === "HOME"
    );
    if (defaultTemplate) {
      temperaturePreset = {
        ...defaultTemplate,
        name: "",
        id: "",
        fanMode: null,
      };
    }
  }

  if (!temperaturePreset) throw new GoBack();

  const toDisplay = makeToDisplay(location.temperatureUnit);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t(isEditing ? "titleEdit" : "titleAdd", {
        scope,
        name: temperaturePreset?.name,
      }),
    });
  }, [navigation, isEditing, temperaturePreset]);

  const { isVariantEnabled } = useFeatureFlags();
  const fanFeatureEnabled = isVariantEnabled(
    "schedule",
    "SCHEDULE_TEMPERATURE_FAN"
  );

  const [name, setName] = useState(temperaturePreset.name);
  const [fanMode, setFanMode] = useState<FanMode | null>(
    temperaturePreset.fanMode
  );

  const {
    singleSetpoint,
    setSingleSetpoint,
    dualSetpoint,
    setDualSetpoint,
  } = useSetpointState(temperaturePreset.setpoint);

  const [
    addTemperaturePreset,
    { loading: addPresetLoading },
  ] = useAddTemperaturePresetMutation({
    variables: {
      input: {
        id: locationId,
        single: singleSetpoint,
        dual: dualSetpoint,
        name,
        fanMode,
      },
    },
    update: (cache, { data }) => {
      const result = data?.addTemperaturePreset;
      if (result?.__typename === "AddTemperaturePresetSuccess") {
        cache.modify({
          id: cache.identify(location),
          fields: {
            temperaturePresets: () => {
              const existingPresets = location.temperaturePresets ?? [];
              return [...existingPresets, result.temperaturePreset].map(
                (data) => {
                  return cache.writeFragment({
                    data,
                    fragment: TemperaturePresetsFieldsFragmentDoc,
                    fragmentName: "TemperaturePresetsFields",
                  });
                }
              );
            },
          },
        });
      }
    },
    onCompleted: ({ addTemperaturePreset }) => {
      if (addTemperaturePreset.__typename === "AddTemperaturePresetSuccess") {
        navigation.goBack();
      }
    },
  });

  const [
    changeTemperaturePreset,
    { loading: changePresetLoading },
  ] = useChangeTemperaturePresetMutation({
    variables: {
      setpointInput: {
        id: temperaturePreset.id,
        single: singleSetpoint,
        dual: dualSetpoint,
      },
      nameInput: {
        id: temperaturePreset.id,
        name,
      },
    },
    onCompleted: ({
      changeTemperaturePresetSetpoint,
      changeTemperaturePresetName,
    }) => {
      if (
        changeTemperaturePresetSetpoint.__typename ===
          "ChangeTemperaturePresetSetpointSuccess" ||
        changeTemperaturePresetName.__typename ===
          "ChangeTemperaturePresetNameSuccess"
      ) {
        navigation.goBack();
      }
    },
  });

  const [removeTemperaturePreset] = useConfirmDestructiveMutation(
    useRemoveTemperaturePresetMutation({
      variables: {
        input: {
          locationId: locationId,
          id: temperaturePreset.id,
        },
      },
      update: (cache, { data }) => {
        if (
          data?.removeTemperaturePreset.__typename ===
          "RemoveTemperaturePresetSuccess"
        ) {
          temperaturePreset &&
            cache.evict({ id: cache.identify(temperaturePreset) });
        }
      },
      onCompleted: ({ removeTemperaturePreset }) => {
        if (
          removeTemperaturePreset.__typename ===
          "RemoveTemperaturePresetSuccess"
        ) {
          navigation.goBack();
        }
      },
    }),
    {
      title: i18n.t("deleteScheduleSheet.title", { scope }),
      message: i18n.t("deleteScheduleSheet.message", { scope }),
    },
    i18n.t("deleteScheduleSheet.confirm", { scope })
  );

  const { didChange } = useSaveButton({
    handleSave: isEditing ? changeTemperaturePreset : addTemperaturePreset,
    loading: isEditing ? changePresetLoading : addPresetLoading,
    disabled: !name,
  });

  useEffect(() => {
    if (unsavedFanMode) {
      setFanMode(unsavedFanMode);
    }
  }, [unsavedFanMode, didChange]);

  useEffect(() => {
    if (temperaturePreset?.fanMode) {
      setFanMode(temperaturePreset.fanMode);
    }
  }, [temperaturePreset.fanMode]);

  const changeSetpoint = useCallback(
    (input: SingleSetpointInput | DualSetpointInput) => {
      const single = input as SingleSetpointInput;
      const dual = input as DualSetpointInput;

      if (typeof single.target === "number") {
        setSingleSetpoint(single);
      } else if (typeof dual.lower === "number") {
        setDualSetpoint(dual);
      }

      didChange();
    },
    [didChange, setSingleSetpoint, setDualSetpoint]
  );

  const handleChangeName = useCallback(
    (name: string) => {
      setName(name);
      didChange();
    },
    [didChange]
  );

  const showDeleteButton = isEditing && temperaturePreset?.removable;

  return (
    <Screen edges={["left", "right", "bottom"]}>
      <Box marginVertical="l">
        <TextInputWithLabel
          label={"Name"}
          onChangeText={handleChangeName}
          value={name}
          returnKeyType="done"
          maxLength={25}
        />
        {!isEditing && (
          <Text marginTop={"s"}>{i18n.t("label", { scope })}</Text>
        )}
      </Box>
      <SetpointRenderer
        setpoint={temperaturePreset.setpoint}
        single={(single) => (
          <SingleSetpointManageTemperaturePreset
            changeSetpoint={changeSetpoint}
            target={singleSetpoint?.target ?? single.value}
            setpoint={single}
            toDisplay={toDisplay}
          />
        )}
        dual={(dual) => (
          <DualSetpointManageTemperaturePreset
            changeSetpoint={changeSetpoint}
            lower={dualSetpoint?.lower ?? dual.lower.value}
            upper={dualSetpoint?.upper ?? dual.upper.value}
            setpoint={dual}
            toDisplay={toDisplay}
          />
        )}
      />
      <KeyboardAvoidingView>
        <VSpacer size="z" flexGrow={4} />
        {fanFeatureEnabled && (
          <SingleListItemButton
            title={i18n.t("fan", { scope })}
            value={
              fanMode ? i18n.t(`Common.fanSettings.${fanMode}.label`) : null
            }
            onPress={() =>
              navigation.navigate("SelectFanMode", {
                temperaturePresetId: temperaturePreset?.id,
                fanMode,
                locationId,
              })
            }
          />
        )}

        <VSpacer flexGrow={2} />
        <Cloak visible={showDeleteButton}>
          {({ opacity }) => (
            <Box alignSelf="flex-end" opacity={opacity}>
              <Link
                onPress={removeTemperaturePreset}
                text={i18n.t("delete", { scope })}
              />
            </Box>
          )}
        </Cloak>
        <VSpacer flexGrow={1} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

export const NewTemperaturePreset = withQueryData(
  useNewTemperaturePresetQuery,
  {
    options: { fetchPolicy: "cache-and-network" },
    useVariables() {
      const route = useRoute<
        RouteProp<ManageScheduleNavigatorRouteList, "ManageTemperaturePreset">
      >();
      return useMemo(
        () => ({
          locationId: route.params.locationId,
        }),
        [route.params.locationId]
      );
    },
  }
)(ManageTemperaturePreset);

export default withQueryData(useManageTemperaturePresetQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables() {
    const route = useRoute<
      RouteProp<ManageScheduleNavigatorRouteList, "ManageTemperaturePreset">
    >();
    return useMemo(
      () => ({
        temperaturePresetId: route.params.temperaturePresetId ?? "",
        locationId: route.params.locationId,
      }),
      [route.params.temperaturePresetId, route.params.locationId]
    );
  },
})(ManageTemperaturePreset);
