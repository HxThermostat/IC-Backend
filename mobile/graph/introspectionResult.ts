export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    SetAppActiveResult: ["SetAppActiveSuccess", "NotSupported", "NotFound"],
    SendTokenResult: ["SendTokenSuccess", "EmailInvalid"],
    SignInResult: ["SignInSuccess", "TokenInvalid", "EmailInvalid"],
    RefreshTokenResult: ["RefreshTokenSuccess", "TokenInvalid"],
    SignUpResult: ["SignUpSuccess", "EmailInvalid", "EmailTaken"],
    RemoveAccountResult: ["RemoveAccountSuccess", "TokenInvalid"],
    GenerateAccountSharingQrCodeResult: [
      "GenerateAccountSharingQrCodeSuccess",
      "NotSupported",
    ],
    ToggleControllerAwayResult: [
      "ToggleControllerAwaySuccess",
      "NotFound",
      "NotSupported",
    ],
    ToggleLocationAwayResult: [
      "ToggleLocationAwaySuccess",
      "NotFound",
      "NotSupported",
    ],
    ChangeControllerAwaySetpointResult: [
      "ChangeControllerAwaySetpointSuccess",
      "NotFound",
      "NotSupported",
    ],
    ChangeLocationAwaySetpointResult: [
      "ChangeLocationAwaySetpointSuccess",
      "NotFound",
      "NotSupported",
    ],
    RangeValue: ["PercentageRangeValue", "SingleSetpoint"],
    DualRangeValue: [
      "DualSetpoint",
      "HumidityNotification",
      "TemperatureNotification",
    ],
    Range: ["SetpointRange"],
    File: ["AccountSharingQrCode"],
    FanRunning: ["SpeedNameFan", "PercentageFan"],
    Fan: ["PercentageFan", "SpeedNameFan"],
    ChangeModeResult: [
      "ChangeModeSuccess",
      "InvalidMode",
      "InvalidModeTransition",
      "NotFound",
    ],
    HoldLength: [
      "HoldLengthIndefinite",
      "HoldLengthNextEvent",
      "HoldLengthHours",
      "HoldLengthDate",
    ],
    CancelHoldResult: ["CancelHoldSuccess", "NotFound"],
    ChangeScheduleEventTimeResult: [
      "ChangeScheduleEventTimeSuccess",
      "NotFound",
    ],
    ChangeScheduleEventTemperaturePresetResult: [
      "ChangeScheduleEventTemperaturePresetSuccess",
      "NotFound",
    ],
    AddScheduleEventResult: [
      "AddScheduleEventSuccess",
      "NotFound",
      "NotSupported",
      "ScheduleFull",
    ],
    CopyScheduleResult: ["CopyScheduleSuccess", "NotFound"],
    RemoveScheduleEventResult: ["RemoveScheduleEventSuccess", "NotFound"],
    Setpoint: ["SingleSetpoint", "DualSetpoint"],
    ChangeSetpointResult: [
      "ChangeSetpointSuccess",
      "AwayActive",
      "NotSupported",
      "NotFound",
    ],
    ChangeDefaultControllerHoldLengthResult: [
      "ChangeDefaultControllerHoldLengthSuccess",
      "NotSupported",
      "NotFound",
    ],
    ChangeDefaultLocationHoldLengthResult: [
      "ChangeDefaultLocationHoldLengthSuccess",
      "NotSupported",
      "NotFound",
    ],
    Error: [
      "EmailInvalid",
      "EmailTaken",
      "InvalidMode",
      "InvalidModeTransition",
      "ScheduleFull",
      "AwayActive",
      "NotFound",
      "NotSupported",
      "TokenInvalid",
      "DeviceStateInvalid",
    ],
    Log: ["FaultLogLabel", "FaultLogLabelAndDescription"],
    FaultLog: ["FaultLogLabel", "FaultLogLabelAndDescription"],
    RemoveLocationResult: ["RemoveLocationSuccess", "NotFound"],
    ChangeLocationAwayResult: [
      "ChangeLocationAwaySuccess",
      "NotFound",
      "NotSupported",
    ],
    ConnectAylaDisplayResult: [
      "ConnectAylaDisplaySuccess",
      "TokenInvalid",
      "DeviceStateInvalid",
      "NotSupported",
    ],
    ChangeTemperatureUnitResult: [
      "ChangeTemperatureUnitSuccess",
      "NotFound",
      "NotSupported",
    ],
    Notification: [
      "HumidityNotification",
      "TemperatureNotification",
      "BasicNotification",
    ],
    SubscribeToNotificationsResult: [
      "SubscribeToNotificationsSuccess",
      "NotSupported",
    ],
    UnsubscribeFromNotificationsResult: [
      "UnsubscribeFromNotificationsSuccess",
      "NotFound",
      "NotSupported",
    ],
    ToggleControllerTemperatureNotificationResult: [
      "ToggleControllerTemperatureNotificationSuccess",
      "NotFound",
      "NotSupported",
    ],
    AdjustControllerTemperatureNotificationThresholdResult: [
      "AdjustControllerTemperatureNotificationThresholdSuccess",
      "NotFound",
      "NotSupported",
    ],
    ToggleControllerHumidityNotificationResult: [
      "ToggleControllerHumidityNotificationSuccess",
      "NotFound",
      "NotSupported",
    ],
    AdjustControllerHumidityNotificationThresholdResult: [
      "AdjustControllerHumidityNotificationThresholdSuccess",
      "NotFound",
      "NotSupported",
    ],
    ToggleLocationFaultNotificationResult: [
      "ToggleLocationFaultNotificationSuccess",
      "NotFound",
      "NotSupported",
    ],
    ToggleLocationTemperatureNotificationResult: [
      "ToggleLocationTemperatureNotificationSuccess",
      "NotFound",
      "NotSupported",
    ],
    ToggleLocationHumidityNotificationResult: [
      "ToggleLocationHumidityNotificationSuccess",
      "NotFound",
      "NotSupported",
    ],
    AdjustLocationTemperatureNotificationThresholdResult: [
      "AdjustLocationTemperatureNotificationThresholdSuccess",
      "NotFound",
      "NotSupported",
    ],
    AdjustLocationHumidityNotificationThresholdResult: [
      "AdjustLocationHumidityNotificationThresholdSuccess",
      "NotFound",
      "NotSupported",
    ],
    RenameControllerResult: [
      "RenameControllerSuccess",
      "NotFound",
      "NotSupported",
    ],
    RenameLocationResult: ["RenameLocationSuccess", "NotFound", "NotSupported"],
    AddTemperaturePresetResult: [
      "AddTemperaturePresetSuccess",
      "NotFound",
      "NotSupported",
    ],
    ChangeTemperaturePresetNameResult: [
      "ChangeTemperaturePresetNameSuccess",
      "NotFound",
      "NotSupported",
    ],
    ChangeTemperaturePresetSetpointResult: [
      "ChangeTemperaturePresetSetpointSuccess",
      "NotFound",
      "NotSupported",
    ],
    ChangeTemperaturePresetFanModeResult: [
      "ChangeTemperaturePresetFanModeSuccess",
      "NotFound",
      "NotSupported",
    ],
    RemoveTemperaturePresetResult: [
      "RemoveTemperaturePresetSuccess",
      "NotFound",
      "NotSupported",
    ],
  },
};
export default result;
