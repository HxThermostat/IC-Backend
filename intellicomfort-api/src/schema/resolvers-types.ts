import { GraphQLResolveInfo } from "graphql";
import {
  ControllerMapper,
  DualSetpointMapper,
  FeatureMapMapper,
  LocationMapper,
  ModeMapper,
  PushTokenMapper,
  SingleSetpointMapper,
  FanMapper,
  UserMapper,
} from "./mappers";
import { AppContext } from "../server/context";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum Platform {
  Ios = "IOS",
  Android = "ANDROID",
}

export enum UpdateMechanism {
  Native = "NATIVE",
  Ota = "OTA",
}

export type Query = {
  __typename?: "Query";
  _?: Maybe<Scalars["Boolean"]>;
  controller?: Maybe<Controller>;
  controllers: Array<Controller>;
  features: FeatureMap;
  location?: Maybe<Location>;
  locations: Array<Location>;
  manufacturer: Manufacturer;
  me?: Maybe<User>;
  requestRating: Scalars["Boolean"];
  requestSurveyFeedback: Scalars["Boolean"];
  scheduleEvent?: Maybe<ScheduleEvent>;
  scheduleEvents: Array<ScheduleEvent>;
  temperaturePreset?: Maybe<TemperaturePreset>;
  temperaturePresets?: Maybe<Array<TemperaturePreset>>;
  updateRequired?: Maybe<UpdateMechanism>;
};

export type QueryControllerArgs = {
  id: Scalars["ID"];
};

export type QueryLocationArgs = {
  id: Scalars["ID"];
};

export type QueryRequestRatingArgs = {
  input?: Maybe<RequestRatingInput>;
};

export type QueryRequestSurveyFeedbackArgs = {
  input: RequestSurveyFeedbackInput;
};

export type QueryScheduleEventArgs = {
  id: Scalars["ID"];
};

export type QueryTemperaturePresetArgs = {
  id: Scalars["ID"];
};

export type QueryUpdateRequiredArgs = {
  input: UpdateRequiredInput;
};

export type Mutation = {
  __typename?: "Mutation";
  _?: Maybe<Scalars["Boolean"]>;
  addScheduleEvent: AddScheduleEventResult;
  addTemperaturePreset: AddTemperaturePresetResult;
  adjustControllerHumidityNotificationThreshold: AdjustControllerHumidityNotificationThresholdResult;
  adjustControllerTemperatureNotificationThreshold: AdjustControllerTemperatureNotificationThresholdResult;
  adjustLocationHumidityNotificationThreshold: AdjustLocationHumidityNotificationThresholdResult;
  adjustLocationTemperatureNotificationThreshold: AdjustLocationTemperatureNotificationThresholdResult;
  cancelHold: CancelHoldResult;
  changeControllerAwaySetpoint: ChangeControllerAwaySetpointResult;
  changeDefaultControllerHoldLength: ChangeDefaultControllerHoldLengthResult;
  changeDefaultLocationHoldLength: ChangeDefaultLocationHoldLengthResult;
  changeLocationAway: ChangeLocationAwayResult;
  changeLocationAwaySetpoint: ChangeLocationAwaySetpointResult;
  changeMode: ChangeModeResult;
  changeScheduleEventTemperaturePreset: ChangeScheduleEventTemperaturePresetResult;
  changeScheduleEventTime: ChangeScheduleEventTimeResult;
  changeSetpoint: ChangeSetpointResult;
  changeTemperaturePresetFanMode: ChangeTemperaturePresetFanModeResult;
  changeTemperaturePresetName: ChangeTemperaturePresetNameResult;
  changeTemperaturePresetSetpoint: ChangeTemperaturePresetSetpointResult;
  changeTemperatureUnit: ChangeTemperatureUnitResult;
  checkEmail: CheckEmailResult;
  connectAylaDisplay: ConnectAylaDisplayResult;
  copySchedule: CopyScheduleResult;
  generateAccountSharingQrCode: GenerateAccountSharingQrCodeResult;
  refreshToken: RefreshTokenResult;
  removeAccount: RemoveAccountResult;
  removeLocation: RemoveLocationResult;
  removeScheduleEvent: RemoveScheduleEventResult;
  removeTemperaturePreset: RemoveTemperaturePresetResult;
  renameController: RenameControllerResult;
  renameLocation: RenameLocationResult;
  requestSurveySession: RequestSurveySessionResult;
  sendToken: SendTokenResult;
  setAppActive: SetAppActiveResult;
  signIn: SignInResult;
  signUp: SignUpResult;
  subscribeToNotifications: SubscribeToNotificationsResult;
  toggleControllerAway: ToggleControllerAwayResult;
  toggleControllerHumidityNotification: ToggleControllerHumidityNotificationResult;
  toggleControllerTemperatureNotification: ToggleControllerTemperatureNotificationResult;
  toggleLocationAway: ToggleLocationAwayResult;
  toggleLocationFaultNotification: ToggleLocationFaultNotificationResult;
  toggleLocationHumidityNotification: ToggleLocationHumidityNotificationResult;
  toggleLocationTemperatureNotification: ToggleLocationTemperatureNotificationResult;
  unsubscribeFromNotifications: UnsubscribeFromNotificationsResult;
};

export type MutationAddScheduleEventArgs = {
  input: AddScheduleEventInput;
};

export type MutationAddTemperaturePresetArgs = {
  input: AddTemperaturePresetInput;
};

export type MutationAdjustControllerHumidityNotificationThresholdArgs = {
  input: AdjustNotificationThresholdInput;
};

export type MutationAdjustControllerTemperatureNotificationThresholdArgs = {
  input: AdjustNotificationThresholdInput;
};

export type MutationAdjustLocationHumidityNotificationThresholdArgs = {
  input: AdjustNotificationThresholdInput;
};

export type MutationAdjustLocationTemperatureNotificationThresholdArgs = {
  input: AdjustNotificationThresholdInput;
};

export type MutationCancelHoldArgs = {
  input: CancelHoldInput;
};

export type MutationChangeControllerAwaySetpointArgs = {
  input: ChangeAwaySetpointInput;
};

export type MutationChangeDefaultControllerHoldLengthArgs = {
  input: ChangeDefaultHoldLengthInput;
};

export type MutationChangeDefaultLocationHoldLengthArgs = {
  input: ChangeDefaultHoldLengthInput;
};

export type MutationChangeLocationAwayArgs = {
  input: ChangeLocationAwayInput;
};

export type MutationChangeLocationAwaySetpointArgs = {
  input: ChangeAwaySetpointInput;
};

export type MutationChangeModeArgs = {
  input: ChangeModeInput;
};

export type MutationChangeScheduleEventTemperaturePresetArgs = {
  input: ChangeScheduleEventTemperaturePresetInput;
};

export type MutationChangeScheduleEventTimeArgs = {
  input: ChangeScheduleEventTimeInput;
};

export type MutationChangeSetpointArgs = {
  input: ChangeSetpointInput;
};

export type MutationChangeTemperaturePresetFanModeArgs = {
  input: ChangeTemperaturePresetFanModeInput;
};

export type MutationChangeTemperaturePresetNameArgs = {
  input: ChangeTemperaturePresetNameInput;
};

export type MutationChangeTemperaturePresetSetpointArgs = {
  input: ChangeTemperaturePresetSetpointInput;
};

export type MutationChangeTemperatureUnitArgs = {
  input: ChangeTemperatureUnitInput;
};

export type MutationCheckEmailArgs = {
  input: CheckEmailInput;
};

export type MutationConnectAylaDisplayArgs = {
  input: ConnectAylaDisplayInput;
};

export type MutationCopyScheduleArgs = {
  input: CopyScheduleInput;
};

export type MutationGenerateAccountSharingQrCodeArgs = {
  input: GenerateAccountSharingQrCodeInput;
};

export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};

export type MutationRemoveAccountArgs = {
  input: RemoveAccountInput;
};

export type MutationRemoveLocationArgs = {
  input: RemoveLocationInput;
};

export type MutationRemoveScheduleEventArgs = {
  input: RemoveScheduleEventInput;
};

export type MutationRemoveTemperaturePresetArgs = {
  input: RemoveTemperaturePresetInput;
};

export type MutationRenameControllerArgs = {
  input: RenameInput;
};

export type MutationRenameLocationArgs = {
  input: RenameInput;
};

export type MutationSendTokenArgs = {
  input: SendTokenInput;
};

export type MutationSetAppActiveArgs = {
  input: SetAppActiveInput;
};

export type MutationSignInArgs = {
  input: SignInInput;
};

export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type MutationSubscribeToNotificationsArgs = {
  input: SubscribeToNotificationsInput;
};

export type MutationToggleControllerAwayArgs = {
  input: ToggleAwayInput;
};

export type MutationToggleControllerHumidityNotificationArgs = {
  input: ToggleNotificationInput;
};

export type MutationToggleControllerTemperatureNotificationArgs = {
  input: ToggleNotificationInput;
};

export type MutationToggleLocationAwayArgs = {
  input: ToggleAwayInput;
};

export type MutationToggleLocationFaultNotificationArgs = {
  input: ToggleNotificationInput;
};

export type MutationToggleLocationHumidityNotificationArgs = {
  input: ToggleNotificationInput;
};

export type MutationToggleLocationTemperatureNotificationArgs = {
  input: ToggleNotificationInput;
};

export type MutationUnsubscribeFromNotificationsArgs = {
  input: UnsubscribeFromNotificationsInput;
};

export type RequestSurveySessionResult = {
  __typename?: "RequestSurveySessionResult";
  userId: Scalars["String"];
  userName: Scalars["String"];
  sessionToken: Scalars["String"];
  sessionExpiresAt: Scalars["String"];
};

export type RequestRatingInput = {
  build: Scalars["String"];
  installedAt: Scalars["String"];
  lastDisplayedAt?: Maybe<Scalars["String"]>;
  platform: Platform;
  version: Scalars["String"];
};

export type RequestSurveyFeedbackInput = {
  build: Scalars["String"];
  installedAt: Scalars["String"];
  lastDisplayedAt?: Maybe<Scalars["String"]>;
  lastResponseAt?: Maybe<Scalars["String"]>;
  platform: Platform;
  version: Scalars["String"];
};

export type UpdateRequiredInput = {
  platform: Platform;
  version: Scalars["String"];
  build: Scalars["String"];
};

export enum AppActiveTrackingFeature {
  Interval_60 = "INTERVAL_60",
}

export type FeatureMap = {
  __typename?: "FeatureMap";
  _?: Maybe<Scalars["Boolean"]>;
  accountSharing?: Maybe<AccountSharingFeature>;
  appActiveTracking?: Maybe<Array<AppActiveTrackingFeature>>;
  away?: Maybe<Array<AwayFeature>>;
  changeDefaultHoldLengthController?: Maybe<Array<DefaultHoldLengthFeature>>;
  changeDefaultHoldLengthLocation?: Maybe<Array<DefaultHoldLengthFeature>>;
  changeTemperatureUnit?: Maybe<ChangeTemperatureUnitFeature>;
  connect?: Maybe<ConnectFeature>;
  faultLogsController?: Maybe<FaultLogsFeature>;
  faultLogsLocation?: Maybe<FaultLogsFeature>;
  notifications?: Maybe<Array<NotificationsFeature>>;
  rename?: Maybe<Array<RenameFeature>>;
  schedule?: Maybe<ScheduleFeature>;
  signIn: SignInFeature;
  temperaturePresets?: Maybe<Array<TemperaturePresetsFeature>>;
};

export enum AppState {
  Foreground = "FOREGROUND",
  Background = "BACKGROUND",
  Unknown = "UNKNOWN",
}

export type SetAppActiveInput = {
  appState: AppState;
  controllerId?: Maybe<Scalars["ID"]>;
  locationId?: Maybe<Scalars["ID"]>;
};

export type SetAppActiveSuccess = {
  __typename?: "SetAppActiveSuccess";
  _?: Maybe<Scalars["Boolean"]>;
};

export type SetAppActiveResult = SetAppActiveSuccess | NotSupported | NotFound;

export enum AccountSharingFeature {
  QrCode = "QR_CODE",
}

export enum SignInFeature {
  Token = "TOKEN",
}

export type CheckEmailInput = {
  email: Scalars["String"];
};

export type CheckEmailResult = {
  __typename?: "CheckEmailResult";
  available: Scalars["Boolean"];
};

export type SendTokenInput = {
  email: Scalars["String"];
};

export type SendTokenSuccess = {
  __typename?: "SendTokenSuccess";
  _?: Maybe<Scalars["Boolean"]>;
};

export type SendTokenResult = SendTokenSuccess | EmailInvalid;

export type SignInInput = {
  email: Scalars["String"];
  token: Scalars["String"];
};

export type SignInSuccess = {
  __typename?: "SignInSuccess";
  accessToken: Scalars["String"];
  refreshToken: Scalars["String"];
  ttl: Scalars["Int"];
  user: User;
};

export type EmailInvalid = Error & {
  __typename?: "EmailInvalid";
  message?: Maybe<Scalars["String"]>;
};

export type SignInResult = SignInSuccess | TokenInvalid | EmailInvalid;

export type RefreshTokenInput = {
  token: Scalars["String"];
};

export type RefreshTokenSuccess = {
  __typename?: "RefreshTokenSuccess";
  accessToken: Scalars["String"];
  refreshToken: Scalars["String"];
  ttl: Scalars["Int"];
};

export type RefreshTokenResult = RefreshTokenSuccess | TokenInvalid;

export type SignUpInput = {
  email: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
};

export type SignUpSuccess = {
  __typename?: "SignUpSuccess";
  _?: Maybe<Scalars["Boolean"]>;
};

export type EmailTaken = Error & {
  __typename?: "EmailTaken";
  message?: Maybe<Scalars["String"]>;
};

export type SignUpResult = SignUpSuccess | EmailInvalid | EmailTaken;

export type RemoveAccountInput = {
  token: Scalars["String"];
};

export type RemoveAccountSuccess = {
  __typename?: "RemoveAccountSuccess";
  _?: Maybe<Scalars["Boolean"]>;
};

export type RemoveAccountResult = RemoveAccountSuccess | TokenInvalid;

export type GenerateAccountSharingQrCodeInput = {
  size: Scalars["Int"];
};

export type AccountSharingQrCode = File & {
  __typename?: "AccountSharingQrCode";
  dataUrl: Scalars["String"];
  mimeType: Scalars["String"];
  data: Scalars["String"];
  ttl?: Maybe<Scalars["Int"]>;
};

export type GenerateAccountSharingQrCodeSuccess = {
  __typename?: "GenerateAccountSharingQrCodeSuccess";
  code: AccountSharingQrCode;
};

export type GenerateAccountSharingQrCodeResult =
  | GenerateAccountSharingQrCodeSuccess
  | NotSupported;

export enum AwayFeature {
  AwayController = "AWAY_CONTROLLER",
  AwayLocation = "AWAY_LOCATION",
}

export type Away = {
  __typename?: "Away";
  active: Scalars["Boolean"];
  setpoint: Setpoint;
};

export type Controller = {
  __typename?: "Controller";
  activeHold?: Maybe<HoldLength>;
  away?: Maybe<Away>;
  call?: Maybe<Call>;
  defaultHoldLength?: Maybe<HoldLength>;
  fan?: Maybe<Fan>;
  faultActive?: Maybe<Scalars["Boolean"]>;
  faultLogs?: Maybe<Array<FaultLog>>;
  humidityAmbient?: Maybe<Scalars["Float"]>;
  humidityNotification?: Maybe<HumidityNotification>;
  id: Scalars["ID"];
  location: Location;
  mode: Mode;
  modes: Array<Mode>;
  name: Scalars["String"];
  schedule?: Maybe<Schedule>;
  setpoint: Setpoint;
  setpointRange: SetpointRange;
  temperatureAmbient: Scalars["Float"];
  temperatureNotification?: Maybe<TemperatureNotification>;
  zoning: Scalars["Boolean"];
};

export type Location = {
  __typename?: "Location";
  away?: Maybe<Away>;
  awayActive: Scalars["Boolean"];
  connectionStatus: ConnectionStatus;
  controller?: Maybe<Controller>;
  controllers: Array<Controller>;
  defaultHoldLength?: Maybe<HoldLength>;
  faultActive?: Maybe<Scalars["Boolean"]>;
  faultLogs?: Maybe<Array<FaultLog>>;
  faultNotification?: Maybe<BasicNotification>;
  humidityNotification?: Maybe<HumidityNotification>;
  id: Scalars["ID"];
  lat?: Maybe<Scalars["Float"]>;
  lng?: Maybe<Scalars["Float"]>;
  name: Scalars["String"];
  temperatureNotification?: Maybe<TemperatureNotification>;
  temperatureOutdoor?: Maybe<Scalars["Float"]>;
  temperaturePreset?: Maybe<TemperaturePreset>;
  temperaturePresets?: Maybe<Array<TemperaturePreset>>;
  temperatureUnit: TemperatureUnit;
  zoning: Scalars["Boolean"];
};

export type LocationTemperaturePresetArgs = {
  id: Scalars["ID"];
};

export type ToggleAwayInput = {
  id: Scalars["ID"];
  active: Scalars["Boolean"];
};

export type ToggleControllerAwaySuccess = {
  __typename?: "ToggleControllerAwaySuccess";
  controller: Controller;
};

export type ToggleControllerAwayResult =
  | ToggleControllerAwaySuccess
  | NotFound
  | NotSupported;

export type ToggleLocationAwaySuccess = {
  __typename?: "ToggleLocationAwaySuccess";
  location: Location;
};

export type ToggleLocationAwayResult =
  | ToggleLocationAwaySuccess
  | NotFound
  | NotSupported;

export type ChangeAwaySetpointInput = {
  id: Scalars["ID"];
  single?: Maybe<SingleSetpointInput>;
  dual?: Maybe<DualSetpointInput>;
};

export type ChangeControllerAwaySetpointSuccess = {
  __typename?: "ChangeControllerAwaySetpointSuccess";
  controller: Controller;
};

export type ChangeControllerAwaySetpointResult =
  | ChangeControllerAwaySetpointSuccess
  | NotFound
  | NotSupported;

export type ChangeLocationAwaySetpointSuccess = {
  __typename?: "ChangeLocationAwaySetpointSuccess";
  location: Location;
};

export type ChangeLocationAwaySetpointResult =
  | ChangeLocationAwaySetpointSuccess
  | NotFound
  | NotSupported;

export enum Placement {
  Primary = "PRIMARY",
  Secondary = "SECONDARY",
  Tertiary = "TERTIARY",
}

export type RangeValue = {
  value: Scalars["Float"];
  min: Scalars["Float"];
  max: Scalars["Float"];
  step: Scalars["Float"];
};

export type DualRangeValue = {
  lower: RangeValue;
  upper: RangeValue;
  minInterval?: Maybe<Scalars["Float"]>;
};

export type PercentageRangeValue = RangeValue & {
  __typename?: "PercentageRangeValue";
  value: Scalars["Float"];
  min: Scalars["Float"];
  max: Scalars["Float"];
  step: Scalars["Float"];
};

export type Range = {
  min: Scalars["Float"];
  max: Scalars["Float"];
};

export type File = {
  dataUrl: Scalars["String"];
  mimeType: Scalars["String"];
  data: Scalars["String"];
};

export enum Call {
  Heat = "HEAT",
  Cool = "COOL",
}

export type FanRunning = {
  running: Scalars["Boolean"];
};

export type SpeedNameFan = FanRunning & {
  __typename?: "SpeedNameFan";
  activeSpeedName?: Maybe<Scalars["String"]>;
  running: Scalars["Boolean"];
};

export type PercentageFan = FanRunning & {
  __typename?: "PercentageFan";
  activeSpeedPercent: Scalars["Float"];
  running: Scalars["Boolean"];
};

export type Fan = PercentageFan | SpeedNameFan;

export enum EffectiveMode {
  Cool = "COOL",
  Heat = "HEAT",
  Heatcool = "HEATCOOL",
  Off = "OFF",
}

export type Mode = {
  __typename?: "Mode";
  effectiveMode: EffectiveMode;
  name: Scalars["String"];
  placement: Placement;
  transitionFrom: Array<Mode>;
  transitionTo: Array<Mode>;
};

export type ChangeModeInput = {
  id: Scalars["ID"];
  mode: Scalars["String"];
};

export type ChangeModeSuccess = {
  __typename?: "ChangeModeSuccess";
  controller: Controller;
};

export type InvalidMode = Error & {
  __typename?: "InvalidMode";
  message?: Maybe<Scalars["String"]>;
};

export type InvalidModeTransition = Error & {
  __typename?: "InvalidModeTransition";
  message?: Maybe<Scalars["String"]>;
};

export type ChangeModeResult =
  | ChangeModeSuccess
  | InvalidMode
  | InvalidModeTransition
  | NotFound;

export enum ScheduleFeature {
  ScheduleTemperature = "SCHEDULE_TEMPERATURE",
  ScheduleTemperatureFan = "SCHEDULE_TEMPERATURE_FAN",
}

export enum Day {
  Sun = "SUN",
  Mon = "MON",
  Tue = "TUE",
  Wed = "WED",
  Thu = "THU",
  Fri = "FRI",
  Sat = "SAT",
}

export type ScheduleTime = {
  __typename?: "ScheduleTime";
  day: Day;
  hour: Scalars["Int"];
  minute: Scalars["Int"];
};

export type ScheduleTimeInput = {
  day: Day;
  hour: Scalars["Int"];
  minute: Scalars["Int"];
};

export type ScheduleEvent = {
  __typename?: "ScheduleEvent";
  id: Scalars["ID"];
  day: Day;
  removable: Scalars["Boolean"];
  start: ScheduleTime;
  end: ScheduleTime;
  nextEvent: ScheduleEvent;
  prevEvent: ScheduleEvent;
  temperaturePreset: TemperaturePreset;
};

export type ScheduleDay = {
  __typename?: "ScheduleDay";
  day: Day;
  events: Array<ScheduleEvent>;
  full: Scalars["Boolean"];
};

export type Schedule = {
  __typename?: "Schedule";
  days: Array<ScheduleDay>;
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
  maxEvents: Scalars["Int"];
  minEvents: Scalars["Int"];
  minEventInterval: Scalars["Int"];
};

export type HoldLengthIndefinite = {
  __typename?: "HoldLengthIndefinite";
  _?: Maybe<Scalars["Boolean"]>;
};

export type HoldLengthNextEvent = {
  __typename?: "HoldLengthNextEvent";
  _?: Maybe<Scalars["Boolean"]>;
};

export type HoldLengthHours = {
  __typename?: "HoldLengthHours";
  hours: Scalars["Int"];
};

export type HoldLengthDate = {
  __typename?: "HoldLengthDate";
  date: Scalars["String"];
};

export type HoldLength =
  | HoldLengthIndefinite
  | HoldLengthNextEvent
  | HoldLengthHours
  | HoldLengthDate;

export type CancelHoldInput = {
  id: Scalars["ID"];
};

export type CancelHoldSuccess = {
  __typename?: "CancelHoldSuccess";
  controller: Controller;
};

export type CancelHoldResult = CancelHoldSuccess | NotFound;

export type ChangeScheduleEventTimeInput = {
  id: Scalars["ID"];
  start: ScheduleTimeInput;
  end: ScheduleTimeInput;
};

export type ChangeScheduleEventTimeSuccess = {
  __typename?: "ChangeScheduleEventTimeSuccess";
  scheduleEvent: ScheduleEvent;
};

export type ChangeScheduleEventTimeResult =
  | ChangeScheduleEventTimeSuccess
  | NotFound;

export type ChangeScheduleEventTemperaturePresetInput = {
  id: Scalars["ID"];
  temperaturePresetId: Scalars["ID"];
};

export type ChangeScheduleEventTemperaturePresetSuccess = {
  __typename?: "ChangeScheduleEventTemperaturePresetSuccess";
  scheduleEvent: ScheduleEvent;
};

export type ChangeScheduleEventTemperaturePresetResult =
  | ChangeScheduleEventTemperaturePresetSuccess
  | NotFound;

export type AddScheduleEventInput = {
  id: Scalars["ID"];
  start: ScheduleTimeInput;
  end: ScheduleTimeInput;
  temperaturePresetId?: Maybe<Scalars["ID"]>;
};

export type AddScheduleEventSuccess = {
  __typename?: "AddScheduleEventSuccess";
  controller: Controller;
  scheduleEvent: ScheduleEvent;
};

export type ScheduleFull = Error & {
  __typename?: "ScheduleFull";
  message?: Maybe<Scalars["String"]>;
};

export type AddScheduleEventResult =
  | AddScheduleEventSuccess
  | NotFound
  | NotSupported
  | ScheduleFull;

export type CopyScheduleInput = {
  id: Scalars["ID"];
  source: Day;
  destination: Array<Day>;
};

export type CopyScheduleSuccess = {
  __typename?: "CopyScheduleSuccess";
  controller: Controller;
};

export type CopyScheduleResult = CopyScheduleSuccess | NotFound;

export type RemoveScheduleEventInput = {
  id: Scalars["ID"];
  scheduleEventId: Scalars["ID"];
};

export type RemoveScheduleEventSuccess = {
  __typename?: "RemoveScheduleEventSuccess";
  controller: Controller;
};

export type RemoveScheduleEventResult = RemoveScheduleEventSuccess | NotFound;

export type SingleSetpointInput = {
  target: Scalars["Float"];
};

export type DualSetpointInput = {
  lower: Scalars["Float"];
  upper: Scalars["Float"];
};

export type ChangeSetpointInput = {
  id: Scalars["ID"];
  single?: Maybe<SingleSetpointInput>;
  dual?: Maybe<DualSetpointInput>;
};

export type SingleSetpoint = RangeValue & {
  __typename?: "SingleSetpoint";
  value: Scalars["Float"];
  min: Scalars["Float"];
  max: Scalars["Float"];
  step: Scalars["Float"];
};

export type DualSetpoint = DualRangeValue & {
  __typename?: "DualSetpoint";
  lower: SingleSetpoint;
  upper: SingleSetpoint;
  minInterval: Scalars["Float"];
};

export type Setpoint = SingleSetpoint | DualSetpoint;

export type SetpointRange = Range & {
  __typename?: "SetpointRange";
  min: Scalars["Float"];
  max: Scalars["Float"];
};

export type ChangeSetpointSuccess = {
  __typename?: "ChangeSetpointSuccess";
  controller: Controller;
};

export type AwayActive = Error & {
  __typename?: "AwayActive";
  message?: Maybe<Scalars["String"]>;
};

export type ChangeSetpointResult =
  | ChangeSetpointSuccess
  | AwayActive
  | NotSupported
  | NotFound;

export enum DefaultHoldLengthFeature {
  Indefinite = "INDEFINITE",
  NextEvent = "NEXT_EVENT",
  Hours_12 = "HOURS_12",
  Hours_24 = "HOURS_24",
  Date = "DATE",
}

export type ChangeDefaultHoldLengthIndefiniteInput = {
  _?: Maybe<Scalars["Boolean"]>;
};

export type ChangeDefaultHoldLengthNextEventInput = {
  _?: Maybe<Scalars["Boolean"]>;
};

export type ChangeDefaultHoldLengthHoursInput = {
  hours: Scalars["Int"];
};

export type ChangeDefaultHoldLengthDateInput = {
  date: Scalars["String"];
};

export type ChangeDefaultHoldLengthInput = {
  id: Scalars["ID"];
  indefinite?: Maybe<ChangeDefaultHoldLengthIndefiniteInput>;
  nextEvent?: Maybe<ChangeDefaultHoldLengthNextEventInput>;
  hours?: Maybe<ChangeDefaultHoldLengthHoursInput>;
  date?: Maybe<ChangeDefaultHoldLengthDateInput>;
};

export type ChangeDefaultControllerHoldLengthSuccess = {
  __typename?: "ChangeDefaultControllerHoldLengthSuccess";
  controller: Controller;
};

export type ChangeDefaultControllerHoldLengthResult =
  | ChangeDefaultControllerHoldLengthSuccess
  | NotSupported
  | NotFound;

export type ChangeDefaultLocationHoldLengthSuccess = {
  __typename?: "ChangeDefaultLocationHoldLengthSuccess";
  location: Location;
};

export type ChangeDefaultLocationHoldLengthResult =
  | ChangeDefaultLocationHoldLengthSuccess
  | NotSupported
  | NotFound;

export type Error = {
  message?: Maybe<Scalars["String"]>;
};

export type NotFound = Error & {
  __typename?: "NotFound";
  message?: Maybe<Scalars["String"]>;
};

export type NotSupported = Error & {
  __typename?: "NotSupported";
  message?: Maybe<Scalars["String"]>;
};

export type TokenInvalid = Error & {
  __typename?: "TokenInvalid";
  message?: Maybe<Scalars["String"]>;
};

export enum FanMode {
  Auto = "AUTO",
  Fifteen = "FIFTEEN",
  Thirty = "THIRTY",
  Fortyfive = "FORTYFIVE",
  Always = "ALWAYS",
}

export enum FaultLogsFeature {
  LogWithLabel = "LOG_WITH_LABEL",
  LogWithLabelAndDescription = "LOG_WITH_LABEL_AND_DESCRIPTION",
}

export type Log = {
  date: Scalars["String"];
};

export type FaultLogLabel = Log & {
  __typename?: "FaultLogLabel";
  date: Scalars["String"];
  label: Scalars["String"];
};

export type FaultLogLabelAndDescription = Log & {
  __typename?: "FaultLogLabelAndDescription";
  date: Scalars["String"];
  label: Scalars["String"];
  description: Scalars["String"];
};

export type FaultLog = FaultLogLabel | FaultLogLabelAndDescription;

export enum ConnectionStatus {
  Online = "ONLINE",
  Offline = "OFFLINE",
}

export type RemoveLocationInput = {
  id: Scalars["ID"];
};

export type RemoveLocationSuccess = {
  __typename?: "RemoveLocationSuccess";
  _?: Maybe<Scalars["Boolean"]>;
};

export type RemoveLocationResult = RemoveLocationSuccess | NotFound;

export type ChangeLocationAwayInput = {
  id: Scalars["ID"];
  active: Scalars["Boolean"];
};

export type ChangeLocationAwaySuccess = {
  __typename?: "ChangeLocationAwaySuccess";
  location: Location;
};

export type ChangeLocationAwayResult =
  | ChangeLocationAwaySuccess
  | NotFound
  | NotSupported;

export enum ConnectFeature {
  AylaDisplay = "AYLA_DISPLAY",
}

export type ConnectAylaDisplayInput = {
  token: Scalars["String"];
};

export type ConnectAylaDisplaySuccess = {
  __typename?: "ConnectAylaDisplaySuccess";
  location: Location;
};

export type DeviceStateInvalid = Error & {
  __typename?: "DeviceStateInvalid";
  message?: Maybe<Scalars["String"]>;
};

export type ConnectAylaDisplayResult =
  | ConnectAylaDisplaySuccess
  | TokenInvalid
  | DeviceStateInvalid
  | NotSupported;

export enum TemperatureUnit {
  F = "F",
  C = "C",
}

export enum ChangeTemperatureUnitFeature {
  AppOnly = "APP_ONLY",
}

export type ChangeTemperatureUnitInput = {
  id: Scalars["ID"];
  temperatureUnit: TemperatureUnit;
};

export type ChangeTemperatureUnitSuccess = {
  __typename?: "ChangeTemperatureUnitSuccess";
  location: Location;
};

export type ChangeTemperatureUnitResult =
  | ChangeTemperatureUnitSuccess
  | NotFound
  | NotSupported;

export type Manufacturer = {
  __typename?: "Manufacturer";
  support?: Maybe<Contact>;
};

export type Contact = {
  __typename?: "Contact";
  name: Scalars["String"];
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
};

export enum NotificationsFeature {
  ControllerTemperature = "CONTROLLER_TEMPERATURE",
  ControllerHumidity = "CONTROLLER_HUMIDITY",
  LocationTemperature = "LOCATION_TEMPERATURE",
  LocationHumidity = "LOCATION_HUMIDITY",
  LocationFaults = "LOCATION_FAULTS",
}

export type Notification = {
  enabled: Scalars["Boolean"];
};

export type HumidityNotification = Notification &
  DualRangeValue & {
    __typename?: "HumidityNotification";
    enabled: Scalars["Boolean"];
    lower: PercentageRangeValue;
    upper: PercentageRangeValue;
    minInterval: Scalars["Float"];
  };

export type TemperatureNotification = Notification &
  DualRangeValue & {
    __typename?: "TemperatureNotification";
    enabled: Scalars["Boolean"];
    lower: SingleSetpoint;
    upper: SingleSetpoint;
    minInterval: Scalars["Float"];
  };

export type BasicNotification = Notification & {
  __typename?: "BasicNotification";
  enabled: Scalars["Boolean"];
};

export enum PushTokenStatus {
  Enabled = "ENABLED",
  Disabled = "DISABLED",
}

export type PushToken = {
  __typename?: "PushToken";
  id: Scalars["ID"];
  platform: Platform;
  status: PushTokenStatus;
  token: Scalars["String"];
};

export type User = {
  __typename?: "User";
  email: Scalars["String"];
  id: Scalars["String"];
  pushTokens?: Maybe<Array<PushToken>>;
};

export type SubscribeToNotificationsInput = {
  token: Scalars["String"];
  platform: Platform;
};

export type SubscribeToNotificationsSuccess = {
  __typename?: "SubscribeToNotificationsSuccess";
  pushToken: PushToken;
};

export type SubscribeToNotificationsResult =
  | SubscribeToNotificationsSuccess
  | NotSupported;

export type UnsubscribeFromNotificationsInput = {
  id: Scalars["ID"];
};

export type UnsubscribeFromNotificationsSuccess = {
  __typename?: "UnsubscribeFromNotificationsSuccess";
  _?: Maybe<Scalars["Boolean"]>;
};

export type UnsubscribeFromNotificationsResult =
  | UnsubscribeFromNotificationsSuccess
  | NotFound
  | NotSupported;

export type ToggleNotificationInput = {
  id: Scalars["ID"];
  enabled: Scalars["Boolean"];
};

export type AdjustNotificationThresholdInput = {
  id: Scalars["ID"];
  lower: Scalars["Float"];
  upper: Scalars["Float"];
};

export type ToggleControllerTemperatureNotificationSuccess = {
  __typename?: "ToggleControllerTemperatureNotificationSuccess";
  controller: Controller;
};

export type ToggleControllerTemperatureNotificationResult =
  | ToggleControllerTemperatureNotificationSuccess
  | NotFound
  | NotSupported;

export type AdjustControllerTemperatureNotificationThresholdSuccess = {
  __typename?: "AdjustControllerTemperatureNotificationThresholdSuccess";
  controller: Controller;
};

export type AdjustControllerTemperatureNotificationThresholdResult =
  | AdjustControllerTemperatureNotificationThresholdSuccess
  | NotFound
  | NotSupported;

export type ToggleControllerHumidityNotificationSuccess = {
  __typename?: "ToggleControllerHumidityNotificationSuccess";
  controller: Controller;
};

export type ToggleControllerHumidityNotificationResult =
  | ToggleControllerHumidityNotificationSuccess
  | NotFound
  | NotSupported;

export type AdjustControllerHumidityNotificationThresholdSuccess = {
  __typename?: "AdjustControllerHumidityNotificationThresholdSuccess";
  controller: Controller;
};

export type AdjustControllerHumidityNotificationThresholdResult =
  | AdjustControllerHumidityNotificationThresholdSuccess
  | NotFound
  | NotSupported;

export type ToggleLocationFaultNotificationSuccess = {
  __typename?: "ToggleLocationFaultNotificationSuccess";
  location: Location;
};

export type ToggleLocationFaultNotificationResult =
  | ToggleLocationFaultNotificationSuccess
  | NotFound
  | NotSupported;

export type ToggleLocationTemperatureNotificationSuccess = {
  __typename?: "ToggleLocationTemperatureNotificationSuccess";
  location: Location;
};

export type ToggleLocationTemperatureNotificationResult =
  | ToggleLocationTemperatureNotificationSuccess
  | NotFound
  | NotSupported;

export type ToggleLocationHumidityNotificationSuccess = {
  __typename?: "ToggleLocationHumidityNotificationSuccess";
  location: Location;
};

export type ToggleLocationHumidityNotificationResult =
  | ToggleLocationHumidityNotificationSuccess
  | NotFound
  | NotSupported;

export type AdjustLocationTemperatureNotificationThresholdSuccess = {
  __typename?: "AdjustLocationTemperatureNotificationThresholdSuccess";
  location: Location;
};

export type AdjustLocationTemperatureNotificationThresholdResult =
  | AdjustLocationTemperatureNotificationThresholdSuccess
  | NotFound
  | NotSupported;

export type AdjustLocationHumidityNotificationThresholdSuccess = {
  __typename?: "AdjustLocationHumidityNotificationThresholdSuccess";
  location: Location;
};

export type AdjustLocationHumidityNotificationThresholdResult =
  | AdjustLocationHumidityNotificationThresholdSuccess
  | NotFound
  | NotSupported;

export enum RenameFeature {
  Controller = "CONTROLLER",
  Location = "LOCATION",
}

export type RenameInput = {
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type RenameControllerSuccess = {
  __typename?: "RenameControllerSuccess";
  controller: Controller;
};

export type RenameControllerResult =
  | RenameControllerSuccess
  | NotFound
  | NotSupported;

export type RenameLocationSuccess = {
  __typename?: "RenameLocationSuccess";
  location: Location;
};

export type RenameLocationResult =
  | RenameLocationSuccess
  | NotFound
  | NotSupported;

export enum TemperaturePresetsFeature {
  BuiltIn = "BUILT_IN",
  Custom = "CUSTOM",
}

export enum Slot {
  Home = "HOME",
  Away = "AWAY",
  Sleep = "SLEEP",
  Custom = "CUSTOM",
}

export type TemperaturePreset = {
  __typename?: "TemperaturePreset";
  id: Scalars["ID"];
  name: Scalars["String"];
  slot?: Maybe<Slot>;
  setpoint: Setpoint;
  fanMode?: Maybe<FanMode>;
  removable: Scalars["Boolean"];
};

export type AddTemperaturePresetInput = {
  id: Scalars["ID"];
  single?: Maybe<SingleSetpointInput>;
  dual?: Maybe<DualSetpointInput>;
  name: Scalars["String"];
  fanMode?: Maybe<FanMode>;
};

export type AddTemperaturePresetSuccess = {
  __typename?: "AddTemperaturePresetSuccess";
  temperaturePreset: TemperaturePreset;
};

export type AddTemperaturePresetResult =
  | AddTemperaturePresetSuccess
  | NotFound
  | NotSupported;

export type ChangeTemperaturePresetNameInput = {
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type ChangeTemperaturePresetNameSuccess = {
  __typename?: "ChangeTemperaturePresetNameSuccess";
  temperaturePreset: TemperaturePreset;
};

export type ChangeTemperaturePresetNameResult =
  | ChangeTemperaturePresetNameSuccess
  | NotFound
  | NotSupported;

export type ChangeTemperaturePresetSetpointInput = {
  id: Scalars["ID"];
  single?: Maybe<SingleSetpointInput>;
  dual?: Maybe<DualSetpointInput>;
};

export type ChangeTemperaturePresetSetpointSuccess = {
  __typename?: "ChangeTemperaturePresetSetpointSuccess";
  temperaturePreset: TemperaturePreset;
};

export type ChangeTemperaturePresetSetpointResult =
  | ChangeTemperaturePresetSetpointSuccess
  | NotFound
  | NotSupported;

export type ChangeTemperaturePresetFanModeInput = {
  id: Scalars["ID"];
  fanMode: FanMode;
};

export type ChangeTemperaturePresetFanModeSuccess = {
  __typename?: "ChangeTemperaturePresetFanModeSuccess";
  temperaturePreset: TemperaturePreset;
};

export type ChangeTemperaturePresetFanModeResult =
  | ChangeTemperaturePresetFanModeSuccess
  | NotFound
  | NotSupported;

export type RemoveTemperaturePresetInput = {
  locationId: Scalars["ID"];
  id: Scalars["ID"];
};

export type RemoveTemperaturePresetSuccess = {
  __typename?: "RemoveTemperaturePresetSuccess";
  _?: Maybe<Scalars["Boolean"]>;
};

export type RemoveTemperaturePresetResult =
  | RemoveTemperaturePresetSuccess
  | NotFound
  | NotSupported;

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Platform: Platform;
  UpdateMechanism: UpdateMechanism;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Mutation: ResolverTypeWrapper<{}>;
  RequestSurveySessionResult: ResolverTypeWrapper<RequestSurveySessionResult>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  RequestRatingInput: RequestRatingInput;
  RequestSurveyFeedbackInput: RequestSurveyFeedbackInput;
  UpdateRequiredInput: UpdateRequiredInput;
  AppActiveTrackingFeature: AppActiveTrackingFeature;
  FeatureMap: ResolverTypeWrapper<FeatureMapMapper>;
  AppState: AppState;
  SetAppActiveInput: SetAppActiveInput;
  SetAppActiveSuccess: ResolverTypeWrapper<SetAppActiveSuccess>;
  SetAppActiveResult:
    | ResolversTypes["SetAppActiveSuccess"]
    | ResolversTypes["NotSupported"]
    | ResolversTypes["NotFound"];
  AccountSharingFeature: AccountSharingFeature;
  SignInFeature: SignInFeature;
  CheckEmailInput: CheckEmailInput;
  CheckEmailResult: ResolverTypeWrapper<CheckEmailResult>;
  SendTokenInput: SendTokenInput;
  SendTokenSuccess: ResolverTypeWrapper<SendTokenSuccess>;
  SendTokenResult:
    | ResolversTypes["SendTokenSuccess"]
    | ResolversTypes["EmailInvalid"];
  SignInInput: SignInInput;
  SignInSuccess: ResolverTypeWrapper<
    Omit<SignInSuccess, "user"> & { user: ResolversTypes["User"] }
  >;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  EmailInvalid: ResolverTypeWrapper<EmailInvalid>;
  SignInResult:
    | ResolversTypes["SignInSuccess"]
    | ResolversTypes["TokenInvalid"]
    | ResolversTypes["EmailInvalid"];
  RefreshTokenInput: RefreshTokenInput;
  RefreshTokenSuccess: ResolverTypeWrapper<RefreshTokenSuccess>;
  RefreshTokenResult:
    | ResolversTypes["RefreshTokenSuccess"]
    | ResolversTypes["TokenInvalid"];
  SignUpInput: SignUpInput;
  SignUpSuccess: ResolverTypeWrapper<SignUpSuccess>;
  EmailTaken: ResolverTypeWrapper<EmailTaken>;
  SignUpResult:
    | ResolversTypes["SignUpSuccess"]
    | ResolversTypes["EmailInvalid"]
    | ResolversTypes["EmailTaken"];
  RemoveAccountInput: RemoveAccountInput;
  RemoveAccountSuccess: ResolverTypeWrapper<RemoveAccountSuccess>;
  RemoveAccountResult:
    | ResolversTypes["RemoveAccountSuccess"]
    | ResolversTypes["TokenInvalid"];
  GenerateAccountSharingQrCodeInput: GenerateAccountSharingQrCodeInput;
  AccountSharingQrCode: ResolverTypeWrapper<AccountSharingQrCode>;
  GenerateAccountSharingQrCodeSuccess: ResolverTypeWrapper<GenerateAccountSharingQrCodeSuccess>;
  GenerateAccountSharingQrCodeResult:
    | ResolversTypes["GenerateAccountSharingQrCodeSuccess"]
    | ResolversTypes["NotSupported"];
  AwayFeature: AwayFeature;
  Away: ResolverTypeWrapper<
    Omit<Away, "setpoint"> & { setpoint: ResolversTypes["Setpoint"] }
  >;
  Controller: ResolverTypeWrapper<ControllerMapper>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Location: ResolverTypeWrapper<LocationMapper>;
  ToggleAwayInput: ToggleAwayInput;
  ToggleControllerAwaySuccess: ResolverTypeWrapper<
    Omit<ToggleControllerAwaySuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  ToggleControllerAwayResult:
    | ResolversTypes["ToggleControllerAwaySuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ToggleLocationAwaySuccess: ResolverTypeWrapper<
    Omit<ToggleLocationAwaySuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  ToggleLocationAwayResult:
    | ResolversTypes["ToggleLocationAwaySuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ChangeAwaySetpointInput: ChangeAwaySetpointInput;
  ChangeControllerAwaySetpointSuccess: ResolverTypeWrapper<
    Omit<ChangeControllerAwaySetpointSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  ChangeControllerAwaySetpointResult:
    | ResolversTypes["ChangeControllerAwaySetpointSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ChangeLocationAwaySetpointSuccess: ResolverTypeWrapper<
    Omit<ChangeLocationAwaySetpointSuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  ChangeLocationAwaySetpointResult:
    | ResolversTypes["ChangeLocationAwaySetpointSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  Placement: Placement;
  RangeValue:
    | ResolversTypes["PercentageRangeValue"]
    | ResolversTypes["SingleSetpoint"];
  DualRangeValue:
    | ResolversTypes["DualSetpoint"]
    | ResolversTypes["HumidityNotification"]
    | ResolversTypes["TemperatureNotification"];
  PercentageRangeValue: ResolverTypeWrapper<PercentageRangeValue>;
  Range: ResolversTypes["SetpointRange"];
  File: ResolversTypes["AccountSharingQrCode"];
  Call: Call;
  FanRunning: ResolversTypes["SpeedNameFan"] | ResolversTypes["PercentageFan"];
  SpeedNameFan: ResolverTypeWrapper<FanMapper>;
  PercentageFan: ResolverTypeWrapper<PercentageFan>;
  Fan: ResolversTypes["PercentageFan"] | ResolversTypes["SpeedNameFan"];
  EffectiveMode: EffectiveMode;
  Mode: ResolverTypeWrapper<ModeMapper>;
  ChangeModeInput: ChangeModeInput;
  ChangeModeSuccess: ResolverTypeWrapper<
    Omit<ChangeModeSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  InvalidMode: ResolverTypeWrapper<InvalidMode>;
  InvalidModeTransition: ResolverTypeWrapper<InvalidModeTransition>;
  ChangeModeResult:
    | ResolversTypes["ChangeModeSuccess"]
    | ResolversTypes["InvalidMode"]
    | ResolversTypes["InvalidModeTransition"]
    | ResolversTypes["NotFound"];
  ScheduleFeature: ScheduleFeature;
  Day: Day;
  ScheduleTime: ResolverTypeWrapper<ScheduleTime>;
  ScheduleTimeInput: ScheduleTimeInput;
  ScheduleEvent: ResolverTypeWrapper<ScheduleEvent>;
  ScheduleDay: ResolverTypeWrapper<ScheduleDay>;
  Schedule: ResolverTypeWrapper<Schedule>;
  HoldLengthIndefinite: ResolverTypeWrapper<HoldLengthIndefinite>;
  HoldLengthNextEvent: ResolverTypeWrapper<HoldLengthNextEvent>;
  HoldLengthHours: ResolverTypeWrapper<HoldLengthHours>;
  HoldLengthDate: ResolverTypeWrapper<HoldLengthDate>;
  HoldLength:
    | ResolversTypes["HoldLengthIndefinite"]
    | ResolversTypes["HoldLengthNextEvent"]
    | ResolversTypes["HoldLengthHours"]
    | ResolversTypes["HoldLengthDate"];
  CancelHoldInput: CancelHoldInput;
  CancelHoldSuccess: ResolverTypeWrapper<
    Omit<CancelHoldSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  CancelHoldResult:
    | ResolversTypes["CancelHoldSuccess"]
    | ResolversTypes["NotFound"];
  ChangeScheduleEventTimeInput: ChangeScheduleEventTimeInput;
  ChangeScheduleEventTimeSuccess: ResolverTypeWrapper<ChangeScheduleEventTimeSuccess>;
  ChangeScheduleEventTimeResult:
    | ResolversTypes["ChangeScheduleEventTimeSuccess"]
    | ResolversTypes["NotFound"];
  ChangeScheduleEventTemperaturePresetInput: ChangeScheduleEventTemperaturePresetInput;
  ChangeScheduleEventTemperaturePresetSuccess: ResolverTypeWrapper<ChangeScheduleEventTemperaturePresetSuccess>;
  ChangeScheduleEventTemperaturePresetResult:
    | ResolversTypes["ChangeScheduleEventTemperaturePresetSuccess"]
    | ResolversTypes["NotFound"];
  AddScheduleEventInput: AddScheduleEventInput;
  AddScheduleEventSuccess: ResolverTypeWrapper<
    Omit<AddScheduleEventSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  ScheduleFull: ResolverTypeWrapper<ScheduleFull>;
  AddScheduleEventResult:
    | ResolversTypes["AddScheduleEventSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"]
    | ResolversTypes["ScheduleFull"];
  CopyScheduleInput: CopyScheduleInput;
  CopyScheduleSuccess: ResolverTypeWrapper<
    Omit<CopyScheduleSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  CopyScheduleResult:
    | ResolversTypes["CopyScheduleSuccess"]
    | ResolversTypes["NotFound"];
  RemoveScheduleEventInput: RemoveScheduleEventInput;
  RemoveScheduleEventSuccess: ResolverTypeWrapper<
    Omit<RemoveScheduleEventSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  RemoveScheduleEventResult:
    | ResolversTypes["RemoveScheduleEventSuccess"]
    | ResolversTypes["NotFound"];
  SingleSetpointInput: SingleSetpointInput;
  DualSetpointInput: DualSetpointInput;
  ChangeSetpointInput: ChangeSetpointInput;
  SingleSetpoint: ResolverTypeWrapper<SingleSetpointMapper>;
  DualSetpoint: ResolverTypeWrapper<DualSetpointMapper>;
  Setpoint: ResolversTypes["SingleSetpoint"] | ResolversTypes["DualSetpoint"];
  SetpointRange: ResolverTypeWrapper<SetpointRange>;
  ChangeSetpointSuccess: ResolverTypeWrapper<
    Omit<ChangeSetpointSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  AwayActive: ResolverTypeWrapper<AwayActive>;
  ChangeSetpointResult:
    | ResolversTypes["ChangeSetpointSuccess"]
    | ResolversTypes["AwayActive"]
    | ResolversTypes["NotSupported"]
    | ResolversTypes["NotFound"];
  DefaultHoldLengthFeature: DefaultHoldLengthFeature;
  ChangeDefaultHoldLengthIndefiniteInput: ChangeDefaultHoldLengthIndefiniteInput;
  ChangeDefaultHoldLengthNextEventInput: ChangeDefaultHoldLengthNextEventInput;
  ChangeDefaultHoldLengthHoursInput: ChangeDefaultHoldLengthHoursInput;
  ChangeDefaultHoldLengthDateInput: ChangeDefaultHoldLengthDateInput;
  ChangeDefaultHoldLengthInput: ChangeDefaultHoldLengthInput;
  ChangeDefaultControllerHoldLengthSuccess: ResolverTypeWrapper<
    Omit<ChangeDefaultControllerHoldLengthSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  ChangeDefaultControllerHoldLengthResult:
    | ResolversTypes["ChangeDefaultControllerHoldLengthSuccess"]
    | ResolversTypes["NotSupported"]
    | ResolversTypes["NotFound"];
  ChangeDefaultLocationHoldLengthSuccess: ResolverTypeWrapper<
    Omit<ChangeDefaultLocationHoldLengthSuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  ChangeDefaultLocationHoldLengthResult:
    | ResolversTypes["ChangeDefaultLocationHoldLengthSuccess"]
    | ResolversTypes["NotSupported"]
    | ResolversTypes["NotFound"];
  Error:
    | ResolversTypes["EmailInvalid"]
    | ResolversTypes["EmailTaken"]
    | ResolversTypes["InvalidMode"]
    | ResolversTypes["InvalidModeTransition"]
    | ResolversTypes["ScheduleFull"]
    | ResolversTypes["AwayActive"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"]
    | ResolversTypes["TokenInvalid"]
    | ResolversTypes["DeviceStateInvalid"];
  NotFound: ResolverTypeWrapper<NotFound>;
  NotSupported: ResolverTypeWrapper<NotSupported>;
  TokenInvalid: ResolverTypeWrapper<TokenInvalid>;
  FanMode: FanMode;
  FaultLogsFeature: FaultLogsFeature;
  Log:
    | ResolversTypes["FaultLogLabel"]
    | ResolversTypes["FaultLogLabelAndDescription"];
  FaultLogLabel: ResolverTypeWrapper<FaultLogLabel>;
  FaultLogLabelAndDescription: ResolverTypeWrapper<FaultLogLabelAndDescription>;
  FaultLog:
    | ResolversTypes["FaultLogLabel"]
    | ResolversTypes["FaultLogLabelAndDescription"];
  ConnectionStatus: ConnectionStatus;
  RemoveLocationInput: RemoveLocationInput;
  RemoveLocationSuccess: ResolverTypeWrapper<RemoveLocationSuccess>;
  RemoveLocationResult:
    | ResolversTypes["RemoveLocationSuccess"]
    | ResolversTypes["NotFound"];
  ChangeLocationAwayInput: ChangeLocationAwayInput;
  ChangeLocationAwaySuccess: ResolverTypeWrapper<
    Omit<ChangeLocationAwaySuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  ChangeLocationAwayResult:
    | ResolversTypes["ChangeLocationAwaySuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ConnectFeature: ConnectFeature;
  ConnectAylaDisplayInput: ConnectAylaDisplayInput;
  ConnectAylaDisplaySuccess: ResolverTypeWrapper<
    Omit<ConnectAylaDisplaySuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  DeviceStateInvalid: ResolverTypeWrapper<DeviceStateInvalid>;
  ConnectAylaDisplayResult:
    | ResolversTypes["ConnectAylaDisplaySuccess"]
    | ResolversTypes["TokenInvalid"]
    | ResolversTypes["DeviceStateInvalid"]
    | ResolversTypes["NotSupported"];
  TemperatureUnit: TemperatureUnit;
  ChangeTemperatureUnitFeature: ChangeTemperatureUnitFeature;
  ChangeTemperatureUnitInput: ChangeTemperatureUnitInput;
  ChangeTemperatureUnitSuccess: ResolverTypeWrapper<
    Omit<ChangeTemperatureUnitSuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  ChangeTemperatureUnitResult:
    | ResolversTypes["ChangeTemperatureUnitSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  Manufacturer: ResolverTypeWrapper<Manufacturer>;
  Contact: ResolverTypeWrapper<Contact>;
  NotificationsFeature: NotificationsFeature;
  Notification:
    | ResolversTypes["HumidityNotification"]
    | ResolversTypes["TemperatureNotification"]
    | ResolversTypes["BasicNotification"];
  HumidityNotification: ResolverTypeWrapper<HumidityNotification>;
  TemperatureNotification: ResolverTypeWrapper<
    Omit<TemperatureNotification, "lower" | "upper"> & {
      lower: ResolversTypes["SingleSetpoint"];
      upper: ResolversTypes["SingleSetpoint"];
    }
  >;
  BasicNotification: ResolverTypeWrapper<BasicNotification>;
  PushTokenStatus: PushTokenStatus;
  PushToken: ResolverTypeWrapper<PushTokenMapper>;
  User: ResolverTypeWrapper<UserMapper>;
  SubscribeToNotificationsInput: SubscribeToNotificationsInput;
  SubscribeToNotificationsSuccess: ResolverTypeWrapper<
    Omit<SubscribeToNotificationsSuccess, "pushToken"> & {
      pushToken: ResolversTypes["PushToken"];
    }
  >;
  SubscribeToNotificationsResult:
    | ResolversTypes["SubscribeToNotificationsSuccess"]
    | ResolversTypes["NotSupported"];
  UnsubscribeFromNotificationsInput: UnsubscribeFromNotificationsInput;
  UnsubscribeFromNotificationsSuccess: ResolverTypeWrapper<UnsubscribeFromNotificationsSuccess>;
  UnsubscribeFromNotificationsResult:
    | ResolversTypes["UnsubscribeFromNotificationsSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ToggleNotificationInput: ToggleNotificationInput;
  AdjustNotificationThresholdInput: AdjustNotificationThresholdInput;
  ToggleControllerTemperatureNotificationSuccess: ResolverTypeWrapper<
    Omit<ToggleControllerTemperatureNotificationSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  ToggleControllerTemperatureNotificationResult:
    | ResolversTypes["ToggleControllerTemperatureNotificationSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  AdjustControllerTemperatureNotificationThresholdSuccess: ResolverTypeWrapper<
    Omit<
      AdjustControllerTemperatureNotificationThresholdSuccess,
      "controller"
    > & { controller: ResolversTypes["Controller"] }
  >;
  AdjustControllerTemperatureNotificationThresholdResult:
    | ResolversTypes["AdjustControllerTemperatureNotificationThresholdSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ToggleControllerHumidityNotificationSuccess: ResolverTypeWrapper<
    Omit<ToggleControllerHumidityNotificationSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  ToggleControllerHumidityNotificationResult:
    | ResolversTypes["ToggleControllerHumidityNotificationSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  AdjustControllerHumidityNotificationThresholdSuccess: ResolverTypeWrapper<
    Omit<AdjustControllerHumidityNotificationThresholdSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  AdjustControllerHumidityNotificationThresholdResult:
    | ResolversTypes["AdjustControllerHumidityNotificationThresholdSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ToggleLocationFaultNotificationSuccess: ResolverTypeWrapper<
    Omit<ToggleLocationFaultNotificationSuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  ToggleLocationFaultNotificationResult:
    | ResolversTypes["ToggleLocationFaultNotificationSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ToggleLocationTemperatureNotificationSuccess: ResolverTypeWrapper<
    Omit<ToggleLocationTemperatureNotificationSuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  ToggleLocationTemperatureNotificationResult:
    | ResolversTypes["ToggleLocationTemperatureNotificationSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ToggleLocationHumidityNotificationSuccess: ResolverTypeWrapper<
    Omit<ToggleLocationHumidityNotificationSuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  ToggleLocationHumidityNotificationResult:
    | ResolversTypes["ToggleLocationHumidityNotificationSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  AdjustLocationTemperatureNotificationThresholdSuccess: ResolverTypeWrapper<
    Omit<AdjustLocationTemperatureNotificationThresholdSuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  AdjustLocationTemperatureNotificationThresholdResult:
    | ResolversTypes["AdjustLocationTemperatureNotificationThresholdSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  AdjustLocationHumidityNotificationThresholdSuccess: ResolverTypeWrapper<
    Omit<AdjustLocationHumidityNotificationThresholdSuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  AdjustLocationHumidityNotificationThresholdResult:
    | ResolversTypes["AdjustLocationHumidityNotificationThresholdSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  RenameFeature: RenameFeature;
  RenameInput: RenameInput;
  RenameControllerSuccess: ResolverTypeWrapper<
    Omit<RenameControllerSuccess, "controller"> & {
      controller: ResolversTypes["Controller"];
    }
  >;
  RenameControllerResult:
    | ResolversTypes["RenameControllerSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  RenameLocationSuccess: ResolverTypeWrapper<
    Omit<RenameLocationSuccess, "location"> & {
      location: ResolversTypes["Location"];
    }
  >;
  RenameLocationResult:
    | ResolversTypes["RenameLocationSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  TemperaturePresetsFeature: TemperaturePresetsFeature;
  Slot: Slot;
  TemperaturePreset: ResolverTypeWrapper<
    Omit<TemperaturePreset, "setpoint"> & {
      setpoint: ResolversTypes["Setpoint"];
    }
  >;
  AddTemperaturePresetInput: AddTemperaturePresetInput;
  AddTemperaturePresetSuccess: ResolverTypeWrapper<AddTemperaturePresetSuccess>;
  AddTemperaturePresetResult:
    | ResolversTypes["AddTemperaturePresetSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ChangeTemperaturePresetNameInput: ChangeTemperaturePresetNameInput;
  ChangeTemperaturePresetNameSuccess: ResolverTypeWrapper<ChangeTemperaturePresetNameSuccess>;
  ChangeTemperaturePresetNameResult:
    | ResolversTypes["ChangeTemperaturePresetNameSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ChangeTemperaturePresetSetpointInput: ChangeTemperaturePresetSetpointInput;
  ChangeTemperaturePresetSetpointSuccess: ResolverTypeWrapper<ChangeTemperaturePresetSetpointSuccess>;
  ChangeTemperaturePresetSetpointResult:
    | ResolversTypes["ChangeTemperaturePresetSetpointSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  ChangeTemperaturePresetFanModeInput: ChangeTemperaturePresetFanModeInput;
  ChangeTemperaturePresetFanModeSuccess: ResolverTypeWrapper<ChangeTemperaturePresetFanModeSuccess>;
  ChangeTemperaturePresetFanModeResult:
    | ResolversTypes["ChangeTemperaturePresetFanModeSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
  RemoveTemperaturePresetInput: RemoveTemperaturePresetInput;
  RemoveTemperaturePresetSuccess: ResolverTypeWrapper<RemoveTemperaturePresetSuccess>;
  RemoveTemperaturePresetResult:
    | ResolversTypes["RemoveTemperaturePresetSuccess"]
    | ResolversTypes["NotFound"]
    | ResolversTypes["NotSupported"];
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Boolean: Scalars["Boolean"];
  ID: Scalars["ID"];
  Mutation: {};
  RequestSurveySessionResult: RequestSurveySessionResult;
  String: Scalars["String"];
  RequestRatingInput: RequestRatingInput;
  RequestSurveyFeedbackInput: RequestSurveyFeedbackInput;
  UpdateRequiredInput: UpdateRequiredInput;
  FeatureMap: FeatureMapMapper;
  SetAppActiveInput: SetAppActiveInput;
  SetAppActiveSuccess: SetAppActiveSuccess;
  SetAppActiveResult:
    | ResolversParentTypes["SetAppActiveSuccess"]
    | ResolversParentTypes["NotSupported"]
    | ResolversParentTypes["NotFound"];
  CheckEmailInput: CheckEmailInput;
  CheckEmailResult: CheckEmailResult;
  SendTokenInput: SendTokenInput;
  SendTokenSuccess: SendTokenSuccess;
  SendTokenResult:
    | ResolversParentTypes["SendTokenSuccess"]
    | ResolversParentTypes["EmailInvalid"];
  SignInInput: SignInInput;
  SignInSuccess: Omit<SignInSuccess, "user"> & {
    user: ResolversParentTypes["User"];
  };
  Int: Scalars["Int"];
  EmailInvalid: EmailInvalid;
  SignInResult:
    | ResolversParentTypes["SignInSuccess"]
    | ResolversParentTypes["TokenInvalid"]
    | ResolversParentTypes["EmailInvalid"];
  RefreshTokenInput: RefreshTokenInput;
  RefreshTokenSuccess: RefreshTokenSuccess;
  RefreshTokenResult:
    | ResolversParentTypes["RefreshTokenSuccess"]
    | ResolversParentTypes["TokenInvalid"];
  SignUpInput: SignUpInput;
  SignUpSuccess: SignUpSuccess;
  EmailTaken: EmailTaken;
  SignUpResult:
    | ResolversParentTypes["SignUpSuccess"]
    | ResolversParentTypes["EmailInvalid"]
    | ResolversParentTypes["EmailTaken"];
  RemoveAccountInput: RemoveAccountInput;
  RemoveAccountSuccess: RemoveAccountSuccess;
  RemoveAccountResult:
    | ResolversParentTypes["RemoveAccountSuccess"]
    | ResolversParentTypes["TokenInvalid"];
  GenerateAccountSharingQrCodeInput: GenerateAccountSharingQrCodeInput;
  AccountSharingQrCode: AccountSharingQrCode;
  GenerateAccountSharingQrCodeSuccess: GenerateAccountSharingQrCodeSuccess;
  GenerateAccountSharingQrCodeResult:
    | ResolversParentTypes["GenerateAccountSharingQrCodeSuccess"]
    | ResolversParentTypes["NotSupported"];
  Away: Omit<Away, "setpoint"> & { setpoint: ResolversParentTypes["Setpoint"] };
  Controller: ControllerMapper;
  Float: Scalars["Float"];
  Location: LocationMapper;
  ToggleAwayInput: ToggleAwayInput;
  ToggleControllerAwaySuccess: Omit<
    ToggleControllerAwaySuccess,
    "controller"
  > & { controller: ResolversParentTypes["Controller"] };
  ToggleControllerAwayResult:
    | ResolversParentTypes["ToggleControllerAwaySuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ToggleLocationAwaySuccess: Omit<ToggleLocationAwaySuccess, "location"> & {
    location: ResolversParentTypes["Location"];
  };
  ToggleLocationAwayResult:
    | ResolversParentTypes["ToggleLocationAwaySuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ChangeAwaySetpointInput: ChangeAwaySetpointInput;
  ChangeControllerAwaySetpointSuccess: Omit<
    ChangeControllerAwaySetpointSuccess,
    "controller"
  > & { controller: ResolversParentTypes["Controller"] };
  ChangeControllerAwaySetpointResult:
    | ResolversParentTypes["ChangeControllerAwaySetpointSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ChangeLocationAwaySetpointSuccess: Omit<
    ChangeLocationAwaySetpointSuccess,
    "location"
  > & { location: ResolversParentTypes["Location"] };
  ChangeLocationAwaySetpointResult:
    | ResolversParentTypes["ChangeLocationAwaySetpointSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  RangeValue:
    | ResolversParentTypes["PercentageRangeValue"]
    | ResolversParentTypes["SingleSetpoint"];
  DualRangeValue:
    | ResolversParentTypes["DualSetpoint"]
    | ResolversParentTypes["HumidityNotification"]
    | ResolversParentTypes["TemperatureNotification"];
  PercentageRangeValue: PercentageRangeValue;
  Range: ResolversParentTypes["SetpointRange"];
  File: ResolversParentTypes["AccountSharingQrCode"];
  FanRunning:
    | ResolversParentTypes["SpeedNameFan"]
    | ResolversParentTypes["PercentageFan"];
  SpeedNameFan: FanMapper;
  PercentageFan: PercentageFan;
  Fan:
    | ResolversParentTypes["PercentageFan"]
    | ResolversParentTypes["SpeedNameFan"];
  Mode: ModeMapper;
  ChangeModeInput: ChangeModeInput;
  ChangeModeSuccess: Omit<ChangeModeSuccess, "controller"> & {
    controller: ResolversParentTypes["Controller"];
  };
  InvalidMode: InvalidMode;
  InvalidModeTransition: InvalidModeTransition;
  ChangeModeResult:
    | ResolversParentTypes["ChangeModeSuccess"]
    | ResolversParentTypes["InvalidMode"]
    | ResolversParentTypes["InvalidModeTransition"]
    | ResolversParentTypes["NotFound"];
  ScheduleTime: ScheduleTime;
  ScheduleTimeInput: ScheduleTimeInput;
  ScheduleEvent: ScheduleEvent;
  ScheduleDay: ScheduleDay;
  Schedule: Schedule;
  HoldLengthIndefinite: HoldLengthIndefinite;
  HoldLengthNextEvent: HoldLengthNextEvent;
  HoldLengthHours: HoldLengthHours;
  HoldLengthDate: HoldLengthDate;
  HoldLength:
    | ResolversParentTypes["HoldLengthIndefinite"]
    | ResolversParentTypes["HoldLengthNextEvent"]
    | ResolversParentTypes["HoldLengthHours"]
    | ResolversParentTypes["HoldLengthDate"];
  CancelHoldInput: CancelHoldInput;
  CancelHoldSuccess: Omit<CancelHoldSuccess, "controller"> & {
    controller: ResolversParentTypes["Controller"];
  };
  CancelHoldResult:
    | ResolversParentTypes["CancelHoldSuccess"]
    | ResolversParentTypes["NotFound"];
  ChangeScheduleEventTimeInput: ChangeScheduleEventTimeInput;
  ChangeScheduleEventTimeSuccess: ChangeScheduleEventTimeSuccess;
  ChangeScheduleEventTimeResult:
    | ResolversParentTypes["ChangeScheduleEventTimeSuccess"]
    | ResolversParentTypes["NotFound"];
  ChangeScheduleEventTemperaturePresetInput: ChangeScheduleEventTemperaturePresetInput;
  ChangeScheduleEventTemperaturePresetSuccess: ChangeScheduleEventTemperaturePresetSuccess;
  ChangeScheduleEventTemperaturePresetResult:
    | ResolversParentTypes["ChangeScheduleEventTemperaturePresetSuccess"]
    | ResolversParentTypes["NotFound"];
  AddScheduleEventInput: AddScheduleEventInput;
  AddScheduleEventSuccess: Omit<AddScheduleEventSuccess, "controller"> & {
    controller: ResolversParentTypes["Controller"];
  };
  ScheduleFull: ScheduleFull;
  AddScheduleEventResult:
    | ResolversParentTypes["AddScheduleEventSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"]
    | ResolversParentTypes["ScheduleFull"];
  CopyScheduleInput: CopyScheduleInput;
  CopyScheduleSuccess: Omit<CopyScheduleSuccess, "controller"> & {
    controller: ResolversParentTypes["Controller"];
  };
  CopyScheduleResult:
    | ResolversParentTypes["CopyScheduleSuccess"]
    | ResolversParentTypes["NotFound"];
  RemoveScheduleEventInput: RemoveScheduleEventInput;
  RemoveScheduleEventSuccess: Omit<RemoveScheduleEventSuccess, "controller"> & {
    controller: ResolversParentTypes["Controller"];
  };
  RemoveScheduleEventResult:
    | ResolversParentTypes["RemoveScheduleEventSuccess"]
    | ResolversParentTypes["NotFound"];
  SingleSetpointInput: SingleSetpointInput;
  DualSetpointInput: DualSetpointInput;
  ChangeSetpointInput: ChangeSetpointInput;
  SingleSetpoint: SingleSetpointMapper;
  DualSetpoint: DualSetpointMapper;
  Setpoint:
    | ResolversParentTypes["SingleSetpoint"]
    | ResolversParentTypes["DualSetpoint"];
  SetpointRange: SetpointRange;
  ChangeSetpointSuccess: Omit<ChangeSetpointSuccess, "controller"> & {
    controller: ResolversParentTypes["Controller"];
  };
  AwayActive: AwayActive;
  ChangeSetpointResult:
    | ResolversParentTypes["ChangeSetpointSuccess"]
    | ResolversParentTypes["AwayActive"]
    | ResolversParentTypes["NotSupported"]
    | ResolversParentTypes["NotFound"];
  ChangeDefaultHoldLengthIndefiniteInput: ChangeDefaultHoldLengthIndefiniteInput;
  ChangeDefaultHoldLengthNextEventInput: ChangeDefaultHoldLengthNextEventInput;
  ChangeDefaultHoldLengthHoursInput: ChangeDefaultHoldLengthHoursInput;
  ChangeDefaultHoldLengthDateInput: ChangeDefaultHoldLengthDateInput;
  ChangeDefaultHoldLengthInput: ChangeDefaultHoldLengthInput;
  ChangeDefaultControllerHoldLengthSuccess: Omit<
    ChangeDefaultControllerHoldLengthSuccess,
    "controller"
  > & { controller: ResolversParentTypes["Controller"] };
  ChangeDefaultControllerHoldLengthResult:
    | ResolversParentTypes["ChangeDefaultControllerHoldLengthSuccess"]
    | ResolversParentTypes["NotSupported"]
    | ResolversParentTypes["NotFound"];
  ChangeDefaultLocationHoldLengthSuccess: Omit<
    ChangeDefaultLocationHoldLengthSuccess,
    "location"
  > & { location: ResolversParentTypes["Location"] };
  ChangeDefaultLocationHoldLengthResult:
    | ResolversParentTypes["ChangeDefaultLocationHoldLengthSuccess"]
    | ResolversParentTypes["NotSupported"]
    | ResolversParentTypes["NotFound"];
  Error:
    | ResolversParentTypes["EmailInvalid"]
    | ResolversParentTypes["EmailTaken"]
    | ResolversParentTypes["InvalidMode"]
    | ResolversParentTypes["InvalidModeTransition"]
    | ResolversParentTypes["ScheduleFull"]
    | ResolversParentTypes["AwayActive"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"]
    | ResolversParentTypes["TokenInvalid"]
    | ResolversParentTypes["DeviceStateInvalid"];
  NotFound: NotFound;
  NotSupported: NotSupported;
  TokenInvalid: TokenInvalid;
  Log:
    | ResolversParentTypes["FaultLogLabel"]
    | ResolversParentTypes["FaultLogLabelAndDescription"];
  FaultLogLabel: FaultLogLabel;
  FaultLogLabelAndDescription: FaultLogLabelAndDescription;
  FaultLog:
    | ResolversParentTypes["FaultLogLabel"]
    | ResolversParentTypes["FaultLogLabelAndDescription"];
  RemoveLocationInput: RemoveLocationInput;
  RemoveLocationSuccess: RemoveLocationSuccess;
  RemoveLocationResult:
    | ResolversParentTypes["RemoveLocationSuccess"]
    | ResolversParentTypes["NotFound"];
  ChangeLocationAwayInput: ChangeLocationAwayInput;
  ChangeLocationAwaySuccess: Omit<ChangeLocationAwaySuccess, "location"> & {
    location: ResolversParentTypes["Location"];
  };
  ChangeLocationAwayResult:
    | ResolversParentTypes["ChangeLocationAwaySuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ConnectAylaDisplayInput: ConnectAylaDisplayInput;
  ConnectAylaDisplaySuccess: Omit<ConnectAylaDisplaySuccess, "location"> & {
    location: ResolversParentTypes["Location"];
  };
  DeviceStateInvalid: DeviceStateInvalid;
  ConnectAylaDisplayResult:
    | ResolversParentTypes["ConnectAylaDisplaySuccess"]
    | ResolversParentTypes["TokenInvalid"]
    | ResolversParentTypes["DeviceStateInvalid"]
    | ResolversParentTypes["NotSupported"];
  ChangeTemperatureUnitInput: ChangeTemperatureUnitInput;
  ChangeTemperatureUnitSuccess: Omit<
    ChangeTemperatureUnitSuccess,
    "location"
  > & { location: ResolversParentTypes["Location"] };
  ChangeTemperatureUnitResult:
    | ResolversParentTypes["ChangeTemperatureUnitSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  Manufacturer: Manufacturer;
  Contact: Contact;
  Notification:
    | ResolversParentTypes["HumidityNotification"]
    | ResolversParentTypes["TemperatureNotification"]
    | ResolversParentTypes["BasicNotification"];
  HumidityNotification: HumidityNotification;
  TemperatureNotification: Omit<TemperatureNotification, "lower" | "upper"> & {
    lower: ResolversParentTypes["SingleSetpoint"];
    upper: ResolversParentTypes["SingleSetpoint"];
  };
  BasicNotification: BasicNotification;
  PushToken: PushTokenMapper;
  User: UserMapper;
  SubscribeToNotificationsInput: SubscribeToNotificationsInput;
  SubscribeToNotificationsSuccess: Omit<
    SubscribeToNotificationsSuccess,
    "pushToken"
  > & { pushToken: ResolversParentTypes["PushToken"] };
  SubscribeToNotificationsResult:
    | ResolversParentTypes["SubscribeToNotificationsSuccess"]
    | ResolversParentTypes["NotSupported"];
  UnsubscribeFromNotificationsInput: UnsubscribeFromNotificationsInput;
  UnsubscribeFromNotificationsSuccess: UnsubscribeFromNotificationsSuccess;
  UnsubscribeFromNotificationsResult:
    | ResolversParentTypes["UnsubscribeFromNotificationsSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ToggleNotificationInput: ToggleNotificationInput;
  AdjustNotificationThresholdInput: AdjustNotificationThresholdInput;
  ToggleControllerTemperatureNotificationSuccess: Omit<
    ToggleControllerTemperatureNotificationSuccess,
    "controller"
  > & { controller: ResolversParentTypes["Controller"] };
  ToggleControllerTemperatureNotificationResult:
    | ResolversParentTypes["ToggleControllerTemperatureNotificationSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  AdjustControllerTemperatureNotificationThresholdSuccess: Omit<
    AdjustControllerTemperatureNotificationThresholdSuccess,
    "controller"
  > & { controller: ResolversParentTypes["Controller"] };
  AdjustControllerTemperatureNotificationThresholdResult:
    | ResolversParentTypes["AdjustControllerTemperatureNotificationThresholdSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ToggleControllerHumidityNotificationSuccess: Omit<
    ToggleControllerHumidityNotificationSuccess,
    "controller"
  > & { controller: ResolversParentTypes["Controller"] };
  ToggleControllerHumidityNotificationResult:
    | ResolversParentTypes["ToggleControllerHumidityNotificationSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  AdjustControllerHumidityNotificationThresholdSuccess: Omit<
    AdjustControllerHumidityNotificationThresholdSuccess,
    "controller"
  > & { controller: ResolversParentTypes["Controller"] };
  AdjustControllerHumidityNotificationThresholdResult:
    | ResolversParentTypes["AdjustControllerHumidityNotificationThresholdSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ToggleLocationFaultNotificationSuccess: Omit<
    ToggleLocationFaultNotificationSuccess,
    "location"
  > & { location: ResolversParentTypes["Location"] };
  ToggleLocationFaultNotificationResult:
    | ResolversParentTypes["ToggleLocationFaultNotificationSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ToggleLocationTemperatureNotificationSuccess: Omit<
    ToggleLocationTemperatureNotificationSuccess,
    "location"
  > & { location: ResolversParentTypes["Location"] };
  ToggleLocationTemperatureNotificationResult:
    | ResolversParentTypes["ToggleLocationTemperatureNotificationSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ToggleLocationHumidityNotificationSuccess: Omit<
    ToggleLocationHumidityNotificationSuccess,
    "location"
  > & { location: ResolversParentTypes["Location"] };
  ToggleLocationHumidityNotificationResult:
    | ResolversParentTypes["ToggleLocationHumidityNotificationSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  AdjustLocationTemperatureNotificationThresholdSuccess: Omit<
    AdjustLocationTemperatureNotificationThresholdSuccess,
    "location"
  > & { location: ResolversParentTypes["Location"] };
  AdjustLocationTemperatureNotificationThresholdResult:
    | ResolversParentTypes["AdjustLocationTemperatureNotificationThresholdSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  AdjustLocationHumidityNotificationThresholdSuccess: Omit<
    AdjustLocationHumidityNotificationThresholdSuccess,
    "location"
  > & { location: ResolversParentTypes["Location"] };
  AdjustLocationHumidityNotificationThresholdResult:
    | ResolversParentTypes["AdjustLocationHumidityNotificationThresholdSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  RenameInput: RenameInput;
  RenameControllerSuccess: Omit<RenameControllerSuccess, "controller"> & {
    controller: ResolversParentTypes["Controller"];
  };
  RenameControllerResult:
    | ResolversParentTypes["RenameControllerSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  RenameLocationSuccess: Omit<RenameLocationSuccess, "location"> & {
    location: ResolversParentTypes["Location"];
  };
  RenameLocationResult:
    | ResolversParentTypes["RenameLocationSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  TemperaturePreset: Omit<TemperaturePreset, "setpoint"> & {
    setpoint: ResolversParentTypes["Setpoint"];
  };
  AddTemperaturePresetInput: AddTemperaturePresetInput;
  AddTemperaturePresetSuccess: AddTemperaturePresetSuccess;
  AddTemperaturePresetResult:
    | ResolversParentTypes["AddTemperaturePresetSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ChangeTemperaturePresetNameInput: ChangeTemperaturePresetNameInput;
  ChangeTemperaturePresetNameSuccess: ChangeTemperaturePresetNameSuccess;
  ChangeTemperaturePresetNameResult:
    | ResolversParentTypes["ChangeTemperaturePresetNameSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ChangeTemperaturePresetSetpointInput: ChangeTemperaturePresetSetpointInput;
  ChangeTemperaturePresetSetpointSuccess: ChangeTemperaturePresetSetpointSuccess;
  ChangeTemperaturePresetSetpointResult:
    | ResolversParentTypes["ChangeTemperaturePresetSetpointSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  ChangeTemperaturePresetFanModeInput: ChangeTemperaturePresetFanModeInput;
  ChangeTemperaturePresetFanModeSuccess: ChangeTemperaturePresetFanModeSuccess;
  ChangeTemperaturePresetFanModeResult:
    | ResolversParentTypes["ChangeTemperaturePresetFanModeSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
  RemoveTemperaturePresetInput: RemoveTemperaturePresetInput;
  RemoveTemperaturePresetSuccess: RemoveTemperaturePresetSuccess;
  RemoveTemperaturePresetResult:
    | ResolversParentTypes["RemoveTemperaturePresetSuccess"]
    | ResolversParentTypes["NotFound"]
    | ResolversParentTypes["NotSupported"];
}>;

export type QueryResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  controller?: Resolver<
    Maybe<ResolversTypes["Controller"]>,
    ParentType,
    ContextType,
    RequireFields<QueryControllerArgs, "id">
  >;
  controllers?: Resolver<
    Array<ResolversTypes["Controller"]>,
    ParentType,
    ContextType
  >;
  features?: Resolver<ResolversTypes["FeatureMap"], ParentType, ContextType>;
  location?: Resolver<
    Maybe<ResolversTypes["Location"]>,
    ParentType,
    ContextType,
    RequireFields<QueryLocationArgs, "id">
  >;
  locations?: Resolver<
    Array<ResolversTypes["Location"]>,
    ParentType,
    ContextType
  >;
  manufacturer?: Resolver<
    ResolversTypes["Manufacturer"],
    ParentType,
    ContextType
  >;
  me?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  requestRating?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<QueryRequestRatingArgs, never>
  >;
  requestSurveyFeedback?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<QueryRequestSurveyFeedbackArgs, "input">
  >;
  scheduleEvent?: Resolver<
    Maybe<ResolversTypes["ScheduleEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QueryScheduleEventArgs, "id">
  >;
  scheduleEvents?: Resolver<
    Array<ResolversTypes["ScheduleEvent"]>,
    ParentType,
    ContextType
  >;
  temperaturePreset?: Resolver<
    Maybe<ResolversTypes["TemperaturePreset"]>,
    ParentType,
    ContextType,
    RequireFields<QueryTemperaturePresetArgs, "id">
  >;
  temperaturePresets?: Resolver<
    Maybe<Array<ResolversTypes["TemperaturePreset"]>>,
    ParentType,
    ContextType
  >;
  updateRequired?: Resolver<
    Maybe<ResolversTypes["UpdateMechanism"]>,
    ParentType,
    ContextType,
    RequireFields<QueryUpdateRequiredArgs, "input">
  >;
}>;

export type MutationResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  addScheduleEvent?: Resolver<
    ResolversTypes["AddScheduleEventResult"],
    ParentType,
    ContextType,
    RequireFields<MutationAddScheduleEventArgs, "input">
  >;
  addTemperaturePreset?: Resolver<
    ResolversTypes["AddTemperaturePresetResult"],
    ParentType,
    ContextType,
    RequireFields<MutationAddTemperaturePresetArgs, "input">
  >;
  adjustControllerHumidityNotificationThreshold?: Resolver<
    ResolversTypes["AdjustControllerHumidityNotificationThresholdResult"],
    ParentType,
    ContextType,
    RequireFields<
      MutationAdjustControllerHumidityNotificationThresholdArgs,
      "input"
    >
  >;
  adjustControllerTemperatureNotificationThreshold?: Resolver<
    ResolversTypes["AdjustControllerTemperatureNotificationThresholdResult"],
    ParentType,
    ContextType,
    RequireFields<
      MutationAdjustControllerTemperatureNotificationThresholdArgs,
      "input"
    >
  >;
  adjustLocationHumidityNotificationThreshold?: Resolver<
    ResolversTypes["AdjustLocationHumidityNotificationThresholdResult"],
    ParentType,
    ContextType,
    RequireFields<
      MutationAdjustLocationHumidityNotificationThresholdArgs,
      "input"
    >
  >;
  adjustLocationTemperatureNotificationThreshold?: Resolver<
    ResolversTypes["AdjustLocationTemperatureNotificationThresholdResult"],
    ParentType,
    ContextType,
    RequireFields<
      MutationAdjustLocationTemperatureNotificationThresholdArgs,
      "input"
    >
  >;
  cancelHold?: Resolver<
    ResolversTypes["CancelHoldResult"],
    ParentType,
    ContextType,
    RequireFields<MutationCancelHoldArgs, "input">
  >;
  changeControllerAwaySetpoint?: Resolver<
    ResolversTypes["ChangeControllerAwaySetpointResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeControllerAwaySetpointArgs, "input">
  >;
  changeDefaultControllerHoldLength?: Resolver<
    ResolversTypes["ChangeDefaultControllerHoldLengthResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeDefaultControllerHoldLengthArgs, "input">
  >;
  changeDefaultLocationHoldLength?: Resolver<
    ResolversTypes["ChangeDefaultLocationHoldLengthResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeDefaultLocationHoldLengthArgs, "input">
  >;
  changeLocationAway?: Resolver<
    ResolversTypes["ChangeLocationAwayResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeLocationAwayArgs, "input">
  >;
  changeLocationAwaySetpoint?: Resolver<
    ResolversTypes["ChangeLocationAwaySetpointResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeLocationAwaySetpointArgs, "input">
  >;
  changeMode?: Resolver<
    ResolversTypes["ChangeModeResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeModeArgs, "input">
  >;
  changeScheduleEventTemperaturePreset?: Resolver<
    ResolversTypes["ChangeScheduleEventTemperaturePresetResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeScheduleEventTemperaturePresetArgs, "input">
  >;
  changeScheduleEventTime?: Resolver<
    ResolversTypes["ChangeScheduleEventTimeResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeScheduleEventTimeArgs, "input">
  >;
  changeSetpoint?: Resolver<
    ResolversTypes["ChangeSetpointResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeSetpointArgs, "input">
  >;
  changeTemperaturePresetFanMode?: Resolver<
    ResolversTypes["ChangeTemperaturePresetFanModeResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeTemperaturePresetFanModeArgs, "input">
  >;
  changeTemperaturePresetName?: Resolver<
    ResolversTypes["ChangeTemperaturePresetNameResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeTemperaturePresetNameArgs, "input">
  >;
  changeTemperaturePresetSetpoint?: Resolver<
    ResolversTypes["ChangeTemperaturePresetSetpointResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeTemperaturePresetSetpointArgs, "input">
  >;
  changeTemperatureUnit?: Resolver<
    ResolversTypes["ChangeTemperatureUnitResult"],
    ParentType,
    ContextType,
    RequireFields<MutationChangeTemperatureUnitArgs, "input">
  >;
  checkEmail?: Resolver<
    ResolversTypes["CheckEmailResult"],
    ParentType,
    ContextType,
    RequireFields<MutationCheckEmailArgs, "input">
  >;
  connectAylaDisplay?: Resolver<
    ResolversTypes["ConnectAylaDisplayResult"],
    ParentType,
    ContextType,
    RequireFields<MutationConnectAylaDisplayArgs, "input">
  >;
  copySchedule?: Resolver<
    ResolversTypes["CopyScheduleResult"],
    ParentType,
    ContextType,
    RequireFields<MutationCopyScheduleArgs, "input">
  >;
  generateAccountSharingQrCode?: Resolver<
    ResolversTypes["GenerateAccountSharingQrCodeResult"],
    ParentType,
    ContextType,
    RequireFields<MutationGenerateAccountSharingQrCodeArgs, "input">
  >;
  refreshToken?: Resolver<
    ResolversTypes["RefreshTokenResult"],
    ParentType,
    ContextType,
    RequireFields<MutationRefreshTokenArgs, "input">
  >;
  removeAccount?: Resolver<
    ResolversTypes["RemoveAccountResult"],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveAccountArgs, "input">
  >;
  removeLocation?: Resolver<
    ResolversTypes["RemoveLocationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveLocationArgs, "input">
  >;
  removeScheduleEvent?: Resolver<
    ResolversTypes["RemoveScheduleEventResult"],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveScheduleEventArgs, "input">
  >;
  removeTemperaturePreset?: Resolver<
    ResolversTypes["RemoveTemperaturePresetResult"],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveTemperaturePresetArgs, "input">
  >;
  renameController?: Resolver<
    ResolversTypes["RenameControllerResult"],
    ParentType,
    ContextType,
    RequireFields<MutationRenameControllerArgs, "input">
  >;
  renameLocation?: Resolver<
    ResolversTypes["RenameLocationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationRenameLocationArgs, "input">
  >;
  requestSurveySession?: Resolver<
    ResolversTypes["RequestSurveySessionResult"],
    ParentType,
    ContextType
  >;
  sendToken?: Resolver<
    ResolversTypes["SendTokenResult"],
    ParentType,
    ContextType,
    RequireFields<MutationSendTokenArgs, "input">
  >;
  setAppActive?: Resolver<
    ResolversTypes["SetAppActiveResult"],
    ParentType,
    ContextType,
    RequireFields<MutationSetAppActiveArgs, "input">
  >;
  signIn?: Resolver<
    ResolversTypes["SignInResult"],
    ParentType,
    ContextType,
    RequireFields<MutationSignInArgs, "input">
  >;
  signUp?: Resolver<
    ResolversTypes["SignUpResult"],
    ParentType,
    ContextType,
    RequireFields<MutationSignUpArgs, "input">
  >;
  subscribeToNotifications?: Resolver<
    ResolversTypes["SubscribeToNotificationsResult"],
    ParentType,
    ContextType,
    RequireFields<MutationSubscribeToNotificationsArgs, "input">
  >;
  toggleControllerAway?: Resolver<
    ResolversTypes["ToggleControllerAwayResult"],
    ParentType,
    ContextType,
    RequireFields<MutationToggleControllerAwayArgs, "input">
  >;
  toggleControllerHumidityNotification?: Resolver<
    ResolversTypes["ToggleControllerHumidityNotificationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationToggleControllerHumidityNotificationArgs, "input">
  >;
  toggleControllerTemperatureNotification?: Resolver<
    ResolversTypes["ToggleControllerTemperatureNotificationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationToggleControllerTemperatureNotificationArgs, "input">
  >;
  toggleLocationAway?: Resolver<
    ResolversTypes["ToggleLocationAwayResult"],
    ParentType,
    ContextType,
    RequireFields<MutationToggleLocationAwayArgs, "input">
  >;
  toggleLocationFaultNotification?: Resolver<
    ResolversTypes["ToggleLocationFaultNotificationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationToggleLocationFaultNotificationArgs, "input">
  >;
  toggleLocationHumidityNotification?: Resolver<
    ResolversTypes["ToggleLocationHumidityNotificationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationToggleLocationHumidityNotificationArgs, "input">
  >;
  toggleLocationTemperatureNotification?: Resolver<
    ResolversTypes["ToggleLocationTemperatureNotificationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationToggleLocationTemperatureNotificationArgs, "input">
  >;
  unsubscribeFromNotifications?: Resolver<
    ResolversTypes["UnsubscribeFromNotificationsResult"],
    ParentType,
    ContextType,
    RequireFields<MutationUnsubscribeFromNotificationsArgs, "input">
  >;
}>;

export type RequestSurveySessionResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RequestSurveySessionResult"] = ResolversParentTypes["RequestSurveySessionResult"]
> = ResolversObject<{
  userId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  userName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  sessionToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  sessionExpiresAt?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FeatureMapResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["FeatureMap"] = ResolversParentTypes["FeatureMap"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  accountSharing?: Resolver<
    Maybe<ResolversTypes["AccountSharingFeature"]>,
    ParentType,
    ContextType
  >;
  appActiveTracking?: Resolver<
    Maybe<Array<ResolversTypes["AppActiveTrackingFeature"]>>,
    ParentType,
    ContextType
  >;
  away?: Resolver<
    Maybe<Array<ResolversTypes["AwayFeature"]>>,
    ParentType,
    ContextType
  >;
  changeDefaultHoldLengthController?: Resolver<
    Maybe<Array<ResolversTypes["DefaultHoldLengthFeature"]>>,
    ParentType,
    ContextType
  >;
  changeDefaultHoldLengthLocation?: Resolver<
    Maybe<Array<ResolversTypes["DefaultHoldLengthFeature"]>>,
    ParentType,
    ContextType
  >;
  changeTemperatureUnit?: Resolver<
    Maybe<ResolversTypes["ChangeTemperatureUnitFeature"]>,
    ParentType,
    ContextType
  >;
  connect?: Resolver<
    Maybe<ResolversTypes["ConnectFeature"]>,
    ParentType,
    ContextType
  >;
  faultLogsController?: Resolver<
    Maybe<ResolversTypes["FaultLogsFeature"]>,
    ParentType,
    ContextType
  >;
  faultLogsLocation?: Resolver<
    Maybe<ResolversTypes["FaultLogsFeature"]>,
    ParentType,
    ContextType
  >;
  notifications?: Resolver<
    Maybe<Array<ResolversTypes["NotificationsFeature"]>>,
    ParentType,
    ContextType
  >;
  rename?: Resolver<
    Maybe<Array<ResolversTypes["RenameFeature"]>>,
    ParentType,
    ContextType
  >;
  schedule?: Resolver<
    Maybe<ResolversTypes["ScheduleFeature"]>,
    ParentType,
    ContextType
  >;
  signIn?: Resolver<ResolversTypes["SignInFeature"], ParentType, ContextType>;
  temperaturePresets?: Resolver<
    Maybe<Array<ResolversTypes["TemperaturePresetsFeature"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SetAppActiveSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SetAppActiveSuccess"] = ResolversParentTypes["SetAppActiveSuccess"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SetAppActiveResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SetAppActiveResult"] = ResolversParentTypes["SetAppActiveResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "SetAppActiveSuccess" | "NotSupported" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type CheckEmailResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["CheckEmailResult"] = ResolversParentTypes["CheckEmailResult"]
> = ResolversObject<{
  available?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SendTokenSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SendTokenSuccess"] = ResolversParentTypes["SendTokenSuccess"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SendTokenResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SendTokenResult"] = ResolversParentTypes["SendTokenResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "SendTokenSuccess" | "EmailInvalid",
    ParentType,
    ContextType
  >;
}>;

export type SignInSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SignInSuccess"] = ResolversParentTypes["SignInSuccess"]
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ttl?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailInvalidResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["EmailInvalid"] = ResolversParentTypes["EmailInvalid"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignInResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SignInResult"] = ResolversParentTypes["SignInResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "SignInSuccess" | "TokenInvalid" | "EmailInvalid",
    ParentType,
    ContextType
  >;
}>;

export type RefreshTokenSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RefreshTokenSuccess"] = ResolversParentTypes["RefreshTokenSuccess"]
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ttl?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RefreshTokenResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RefreshTokenResult"] = ResolversParentTypes["RefreshTokenResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "RefreshTokenSuccess" | "TokenInvalid",
    ParentType,
    ContextType
  >;
}>;

export type SignUpSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SignUpSuccess"] = ResolversParentTypes["SignUpSuccess"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailTakenResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["EmailTaken"] = ResolversParentTypes["EmailTaken"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignUpResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SignUpResult"] = ResolversParentTypes["SignUpResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "SignUpSuccess" | "EmailInvalid" | "EmailTaken",
    ParentType,
    ContextType
  >;
}>;

export type RemoveAccountSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RemoveAccountSuccess"] = ResolversParentTypes["RemoveAccountSuccess"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RemoveAccountResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RemoveAccountResult"] = ResolversParentTypes["RemoveAccountResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "RemoveAccountSuccess" | "TokenInvalid",
    ParentType,
    ContextType
  >;
}>;

export type AccountSharingQrCodeResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AccountSharingQrCode"] = ResolversParentTypes["AccountSharingQrCode"]
> = ResolversObject<{
  dataUrl?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  data?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ttl?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenerateAccountSharingQrCodeSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["GenerateAccountSharingQrCodeSuccess"] = ResolversParentTypes["GenerateAccountSharingQrCodeSuccess"]
> = ResolversObject<{
  code?: Resolver<
    ResolversTypes["AccountSharingQrCode"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenerateAccountSharingQrCodeResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["GenerateAccountSharingQrCodeResult"] = ResolversParentTypes["GenerateAccountSharingQrCodeResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "GenerateAccountSharingQrCodeSuccess" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type AwayResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Away"] = ResolversParentTypes["Away"]
> = ResolversObject<{
  active?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  setpoint?: Resolver<ResolversTypes["Setpoint"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ControllerResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Controller"] = ResolversParentTypes["Controller"]
> = ResolversObject<{
  activeHold?: Resolver<
    Maybe<ResolversTypes["HoldLength"]>,
    ParentType,
    ContextType
  >;
  away?: Resolver<Maybe<ResolversTypes["Away"]>, ParentType, ContextType>;
  call?: Resolver<Maybe<ResolversTypes["Call"]>, ParentType, ContextType>;
  defaultHoldLength?: Resolver<
    Maybe<ResolversTypes["HoldLength"]>,
    ParentType,
    ContextType
  >;
  fan?: Resolver<Maybe<ResolversTypes["Fan"]>, ParentType, ContextType>;
  faultActive?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  faultLogs?: Resolver<
    Maybe<Array<ResolversTypes["FaultLog"]>>,
    ParentType,
    ContextType
  >;
  humidityAmbient?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  humidityNotification?: Resolver<
    Maybe<ResolversTypes["HumidityNotification"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  mode?: Resolver<ResolversTypes["Mode"], ParentType, ContextType>;
  modes?: Resolver<Array<ResolversTypes["Mode"]>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  schedule?: Resolver<
    Maybe<ResolversTypes["Schedule"]>,
    ParentType,
    ContextType
  >;
  setpoint?: Resolver<ResolversTypes["Setpoint"], ParentType, ContextType>;
  setpointRange?: Resolver<
    ResolversTypes["SetpointRange"],
    ParentType,
    ContextType
  >;
  temperatureAmbient?: Resolver<
    ResolversTypes["Float"],
    ParentType,
    ContextType
  >;
  temperatureNotification?: Resolver<
    Maybe<ResolversTypes["TemperatureNotification"]>,
    ParentType,
    ContextType
  >;
  zoning?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LocationResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Location"] = ResolversParentTypes["Location"]
> = ResolversObject<{
  away?: Resolver<Maybe<ResolversTypes["Away"]>, ParentType, ContextType>;
  awayActive?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  connectionStatus?: Resolver<
    ResolversTypes["ConnectionStatus"],
    ParentType,
    ContextType
  >;
  controller?: Resolver<
    Maybe<ResolversTypes["Controller"]>,
    ParentType,
    ContextType
  >;
  controllers?: Resolver<
    Array<ResolversTypes["Controller"]>,
    ParentType,
    ContextType
  >;
  defaultHoldLength?: Resolver<
    Maybe<ResolversTypes["HoldLength"]>,
    ParentType,
    ContextType
  >;
  faultActive?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  faultLogs?: Resolver<
    Maybe<Array<ResolversTypes["FaultLog"]>>,
    ParentType,
    ContextType
  >;
  faultNotification?: Resolver<
    Maybe<ResolversTypes["BasicNotification"]>,
    ParentType,
    ContextType
  >;
  humidityNotification?: Resolver<
    Maybe<ResolversTypes["HumidityNotification"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  lat?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  lng?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  temperatureNotification?: Resolver<
    Maybe<ResolversTypes["TemperatureNotification"]>,
    ParentType,
    ContextType
  >;
  temperatureOutdoor?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  temperaturePreset?: Resolver<
    Maybe<ResolversTypes["TemperaturePreset"]>,
    ParentType,
    ContextType,
    RequireFields<LocationTemperaturePresetArgs, "id">
  >;
  temperaturePresets?: Resolver<
    Maybe<Array<ResolversTypes["TemperaturePreset"]>>,
    ParentType,
    ContextType
  >;
  temperatureUnit?: Resolver<
    ResolversTypes["TemperatureUnit"],
    ParentType,
    ContextType
  >;
  zoning?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ToggleControllerAwaySuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleControllerAwaySuccess"] = ResolversParentTypes["ToggleControllerAwaySuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ToggleControllerAwayResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleControllerAwayResult"] = ResolversParentTypes["ToggleControllerAwayResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ToggleControllerAwaySuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ToggleLocationAwaySuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleLocationAwaySuccess"] = ResolversParentTypes["ToggleLocationAwaySuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ToggleLocationAwayResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleLocationAwayResult"] = ResolversParentTypes["ToggleLocationAwayResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ToggleLocationAwaySuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ChangeControllerAwaySetpointSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeControllerAwaySetpointSuccess"] = ResolversParentTypes["ChangeControllerAwaySetpointSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeControllerAwaySetpointResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeControllerAwaySetpointResult"] = ResolversParentTypes["ChangeControllerAwaySetpointResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeControllerAwaySetpointSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ChangeLocationAwaySetpointSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeLocationAwaySetpointSuccess"] = ResolversParentTypes["ChangeLocationAwaySetpointSuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeLocationAwaySetpointResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeLocationAwaySetpointResult"] = ResolversParentTypes["ChangeLocationAwaySetpointResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeLocationAwaySetpointSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type RangeValueResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RangeValue"] = ResolversParentTypes["RangeValue"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "PercentageRangeValue" | "SingleSetpoint",
    ParentType,
    ContextType
  >;
  value?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  min?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  max?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  step?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
}>;

export type DualRangeValueResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["DualRangeValue"] = ResolversParentTypes["DualRangeValue"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "DualSetpoint" | "HumidityNotification" | "TemperatureNotification",
    ParentType,
    ContextType
  >;
  lower?: Resolver<ResolversTypes["RangeValue"], ParentType, ContextType>;
  upper?: Resolver<ResolversTypes["RangeValue"], ParentType, ContextType>;
  minInterval?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
}>;

export type PercentageRangeValueResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["PercentageRangeValue"] = ResolversParentTypes["PercentageRangeValue"]
> = ResolversObject<{
  value?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  min?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  max?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  step?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RangeResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Range"] = ResolversParentTypes["Range"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<"SetpointRange", ParentType, ContextType>;
  min?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  max?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
}>;

export type FileResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["File"] = ResolversParentTypes["File"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<"AccountSharingQrCode", ParentType, ContextType>;
  dataUrl?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  data?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type FanRunningResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["FanRunning"] = ResolversParentTypes["FanRunning"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "SpeedNameFan" | "PercentageFan",
    ParentType,
    ContextType
  >;
  running?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
}>;

export type SpeedNameFanResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SpeedNameFan"] = ResolversParentTypes["SpeedNameFan"]
> = ResolversObject<{
  activeSpeedName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  running?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PercentageFanResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["PercentageFan"] = ResolversParentTypes["PercentageFan"]
> = ResolversObject<{
  activeSpeedPercent?: Resolver<
    ResolversTypes["Float"],
    ParentType,
    ContextType
  >;
  running?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FanResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Fan"] = ResolversParentTypes["Fan"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "PercentageFan" | "SpeedNameFan",
    ParentType,
    ContextType
  >;
}>;

export type ModeResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Mode"] = ResolversParentTypes["Mode"]
> = ResolversObject<{
  effectiveMode?: Resolver<
    ResolversTypes["EffectiveMode"],
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  placement?: Resolver<ResolversTypes["Placement"], ParentType, ContextType>;
  transitionFrom?: Resolver<
    Array<ResolversTypes["Mode"]>,
    ParentType,
    ContextType
  >;
  transitionTo?: Resolver<
    Array<ResolversTypes["Mode"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeModeSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeModeSuccess"] = ResolversParentTypes["ChangeModeSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InvalidModeResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["InvalidMode"] = ResolversParentTypes["InvalidMode"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InvalidModeTransitionResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["InvalidModeTransition"] = ResolversParentTypes["InvalidModeTransition"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeModeResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeModeResult"] = ResolversParentTypes["ChangeModeResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeModeSuccess" | "InvalidMode" | "InvalidModeTransition" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type ScheduleTimeResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ScheduleTime"] = ResolversParentTypes["ScheduleTime"]
> = ResolversObject<{
  day?: Resolver<ResolversTypes["Day"], ParentType, ContextType>;
  hour?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  minute?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduleEventResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ScheduleEvent"] = ResolversParentTypes["ScheduleEvent"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  day?: Resolver<ResolversTypes["Day"], ParentType, ContextType>;
  removable?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  start?: Resolver<ResolversTypes["ScheduleTime"], ParentType, ContextType>;
  end?: Resolver<ResolversTypes["ScheduleTime"], ParentType, ContextType>;
  nextEvent?: Resolver<
    ResolversTypes["ScheduleEvent"],
    ParentType,
    ContextType
  >;
  prevEvent?: Resolver<
    ResolversTypes["ScheduleEvent"],
    ParentType,
    ContextType
  >;
  temperaturePreset?: Resolver<
    ResolversTypes["TemperaturePreset"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduleDayResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ScheduleDay"] = ResolversParentTypes["ScheduleDay"]
> = ResolversObject<{
  day?: Resolver<ResolversTypes["Day"], ParentType, ContextType>;
  events?: Resolver<
    Array<ResolversTypes["ScheduleEvent"]>,
    ParentType,
    ContextType
  >;
  full?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduleResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Schedule"] = ResolversParentTypes["Schedule"]
> = ResolversObject<{
  days?: Resolver<
    Array<ResolversTypes["ScheduleDay"]>,
    ParentType,
    ContextType
  >;
  monday?: Resolver<ResolversTypes["ScheduleDay"], ParentType, ContextType>;
  tuesday?: Resolver<ResolversTypes["ScheduleDay"], ParentType, ContextType>;
  wednesday?: Resolver<ResolversTypes["ScheduleDay"], ParentType, ContextType>;
  thursday?: Resolver<ResolversTypes["ScheduleDay"], ParentType, ContextType>;
  friday?: Resolver<ResolversTypes["ScheduleDay"], ParentType, ContextType>;
  saturday?: Resolver<ResolversTypes["ScheduleDay"], ParentType, ContextType>;
  sunday?: Resolver<ResolversTypes["ScheduleDay"], ParentType, ContextType>;
  maxEvents?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  minEvents?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  minEventInterval?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HoldLengthIndefiniteResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["HoldLengthIndefinite"] = ResolversParentTypes["HoldLengthIndefinite"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HoldLengthNextEventResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["HoldLengthNextEvent"] = ResolversParentTypes["HoldLengthNextEvent"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HoldLengthHoursResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["HoldLengthHours"] = ResolversParentTypes["HoldLengthHours"]
> = ResolversObject<{
  hours?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HoldLengthDateResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["HoldLengthDate"] = ResolversParentTypes["HoldLengthDate"]
> = ResolversObject<{
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HoldLengthResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["HoldLength"] = ResolversParentTypes["HoldLength"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "HoldLengthIndefinite"
    | "HoldLengthNextEvent"
    | "HoldLengthHours"
    | "HoldLengthDate",
    ParentType,
    ContextType
  >;
}>;

export type CancelHoldSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["CancelHoldSuccess"] = ResolversParentTypes["CancelHoldSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CancelHoldResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["CancelHoldResult"] = ResolversParentTypes["CancelHoldResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "CancelHoldSuccess" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type ChangeScheduleEventTimeSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeScheduleEventTimeSuccess"] = ResolversParentTypes["ChangeScheduleEventTimeSuccess"]
> = ResolversObject<{
  scheduleEvent?: Resolver<
    ResolversTypes["ScheduleEvent"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeScheduleEventTimeResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeScheduleEventTimeResult"] = ResolversParentTypes["ChangeScheduleEventTimeResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeScheduleEventTimeSuccess" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type ChangeScheduleEventTemperaturePresetSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeScheduleEventTemperaturePresetSuccess"] = ResolversParentTypes["ChangeScheduleEventTemperaturePresetSuccess"]
> = ResolversObject<{
  scheduleEvent?: Resolver<
    ResolversTypes["ScheduleEvent"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeScheduleEventTemperaturePresetResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeScheduleEventTemperaturePresetResult"] = ResolversParentTypes["ChangeScheduleEventTemperaturePresetResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeScheduleEventTemperaturePresetSuccess" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type AddScheduleEventSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AddScheduleEventSuccess"] = ResolversParentTypes["AddScheduleEventSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  scheduleEvent?: Resolver<
    ResolversTypes["ScheduleEvent"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduleFullResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ScheduleFull"] = ResolversParentTypes["ScheduleFull"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddScheduleEventResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AddScheduleEventResult"] = ResolversParentTypes["AddScheduleEventResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "AddScheduleEventSuccess" | "NotFound" | "NotSupported" | "ScheduleFull",
    ParentType,
    ContextType
  >;
}>;

export type CopyScheduleSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["CopyScheduleSuccess"] = ResolversParentTypes["CopyScheduleSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CopyScheduleResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["CopyScheduleResult"] = ResolversParentTypes["CopyScheduleResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "CopyScheduleSuccess" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type RemoveScheduleEventSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RemoveScheduleEventSuccess"] = ResolversParentTypes["RemoveScheduleEventSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RemoveScheduleEventResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RemoveScheduleEventResult"] = ResolversParentTypes["RemoveScheduleEventResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "RemoveScheduleEventSuccess" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type SingleSetpointResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SingleSetpoint"] = ResolversParentTypes["SingleSetpoint"]
> = ResolversObject<{
  value?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  min?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  max?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  step?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DualSetpointResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["DualSetpoint"] = ResolversParentTypes["DualSetpoint"]
> = ResolversObject<{
  lower?: Resolver<ResolversTypes["SingleSetpoint"], ParentType, ContextType>;
  upper?: Resolver<ResolversTypes["SingleSetpoint"], ParentType, ContextType>;
  minInterval?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SetpointResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Setpoint"] = ResolversParentTypes["Setpoint"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "SingleSetpoint" | "DualSetpoint",
    ParentType,
    ContextType
  >;
}>;

export type SetpointRangeResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SetpointRange"] = ResolversParentTypes["SetpointRange"]
> = ResolversObject<{
  min?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  max?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeSetpointSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeSetpointSuccess"] = ResolversParentTypes["ChangeSetpointSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AwayActiveResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AwayActive"] = ResolversParentTypes["AwayActive"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeSetpointResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeSetpointResult"] = ResolversParentTypes["ChangeSetpointResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeSetpointSuccess" | "AwayActive" | "NotSupported" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type ChangeDefaultControllerHoldLengthSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeDefaultControllerHoldLengthSuccess"] = ResolversParentTypes["ChangeDefaultControllerHoldLengthSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeDefaultControllerHoldLengthResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeDefaultControllerHoldLengthResult"] = ResolversParentTypes["ChangeDefaultControllerHoldLengthResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeDefaultControllerHoldLengthSuccess" | "NotSupported" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type ChangeDefaultLocationHoldLengthSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeDefaultLocationHoldLengthSuccess"] = ResolversParentTypes["ChangeDefaultLocationHoldLengthSuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeDefaultLocationHoldLengthResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeDefaultLocationHoldLengthResult"] = ResolversParentTypes["ChangeDefaultLocationHoldLengthResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeDefaultLocationHoldLengthSuccess" | "NotSupported" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type ErrorResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Error"] = ResolversParentTypes["Error"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "EmailInvalid"
    | "EmailTaken"
    | "InvalidMode"
    | "InvalidModeTransition"
    | "ScheduleFull"
    | "AwayActive"
    | "NotFound"
    | "NotSupported"
    | "TokenInvalid"
    | "DeviceStateInvalid",
    ParentType,
    ContextType
  >;
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
}>;

export type NotFoundResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["NotFound"] = ResolversParentTypes["NotFound"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotSupportedResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["NotSupported"] = ResolversParentTypes["NotSupported"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenInvalidResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["TokenInvalid"] = ResolversParentTypes["TokenInvalid"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LogResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Log"] = ResolversParentTypes["Log"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "FaultLogLabel" | "FaultLogLabelAndDescription",
    ParentType,
    ContextType
  >;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type FaultLogLabelResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["FaultLogLabel"] = ResolversParentTypes["FaultLogLabel"]
> = ResolversObject<{
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  label?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FaultLogLabelAndDescriptionResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["FaultLogLabelAndDescription"] = ResolversParentTypes["FaultLogLabelAndDescription"]
> = ResolversObject<{
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  label?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FaultLogResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["FaultLog"] = ResolversParentTypes["FaultLog"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "FaultLogLabel" | "FaultLogLabelAndDescription",
    ParentType,
    ContextType
  >;
}>;

export type RemoveLocationSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RemoveLocationSuccess"] = ResolversParentTypes["RemoveLocationSuccess"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RemoveLocationResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RemoveLocationResult"] = ResolversParentTypes["RemoveLocationResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "RemoveLocationSuccess" | "NotFound",
    ParentType,
    ContextType
  >;
}>;

export type ChangeLocationAwaySuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeLocationAwaySuccess"] = ResolversParentTypes["ChangeLocationAwaySuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeLocationAwayResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeLocationAwayResult"] = ResolversParentTypes["ChangeLocationAwayResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeLocationAwaySuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ConnectAylaDisplaySuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ConnectAylaDisplaySuccess"] = ResolversParentTypes["ConnectAylaDisplaySuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeviceStateInvalidResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["DeviceStateInvalid"] = ResolversParentTypes["DeviceStateInvalid"]
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConnectAylaDisplayResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ConnectAylaDisplayResult"] = ResolversParentTypes["ConnectAylaDisplayResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "ConnectAylaDisplaySuccess"
    | "TokenInvalid"
    | "DeviceStateInvalid"
    | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ChangeTemperatureUnitSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeTemperatureUnitSuccess"] = ResolversParentTypes["ChangeTemperatureUnitSuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeTemperatureUnitResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeTemperatureUnitResult"] = ResolversParentTypes["ChangeTemperatureUnitResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeTemperatureUnitSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ManufacturerResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Manufacturer"] = ResolversParentTypes["Manufacturer"]
> = ResolversObject<{
  support?: Resolver<Maybe<ResolversTypes["Contact"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContactResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Contact"] = ResolversParentTypes["Contact"]
> = ResolversObject<{
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotificationResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Notification"] = ResolversParentTypes["Notification"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "HumidityNotification" | "TemperatureNotification" | "BasicNotification",
    ParentType,
    ContextType
  >;
  enabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
}>;

export type HumidityNotificationResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["HumidityNotification"] = ResolversParentTypes["HumidityNotification"]
> = ResolversObject<{
  enabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  lower?: Resolver<
    ResolversTypes["PercentageRangeValue"],
    ParentType,
    ContextType
  >;
  upper?: Resolver<
    ResolversTypes["PercentageRangeValue"],
    ParentType,
    ContextType
  >;
  minInterval?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TemperatureNotificationResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["TemperatureNotification"] = ResolversParentTypes["TemperatureNotification"]
> = ResolversObject<{
  enabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  lower?: Resolver<ResolversTypes["SingleSetpoint"], ParentType, ContextType>;
  upper?: Resolver<ResolversTypes["SingleSetpoint"], ParentType, ContextType>;
  minInterval?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BasicNotificationResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["BasicNotification"] = ResolversParentTypes["BasicNotification"]
> = ResolversObject<{
  enabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PushTokenResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["PushToken"] = ResolversParentTypes["PushToken"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  platform?: Resolver<ResolversTypes["Platform"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["PushTokenStatus"], ParentType, ContextType>;
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = ResolversObject<{
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  pushTokens?: Resolver<
    Maybe<Array<ResolversTypes["PushToken"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscribeToNotificationsSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SubscribeToNotificationsSuccess"] = ResolversParentTypes["SubscribeToNotificationsSuccess"]
> = ResolversObject<{
  pushToken?: Resolver<ResolversTypes["PushToken"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscribeToNotificationsResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["SubscribeToNotificationsResult"] = ResolversParentTypes["SubscribeToNotificationsResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "SubscribeToNotificationsSuccess" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type UnsubscribeFromNotificationsSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["UnsubscribeFromNotificationsSuccess"] = ResolversParentTypes["UnsubscribeFromNotificationsSuccess"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnsubscribeFromNotificationsResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["UnsubscribeFromNotificationsResult"] = ResolversParentTypes["UnsubscribeFromNotificationsResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "UnsubscribeFromNotificationsSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ToggleControllerTemperatureNotificationSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleControllerTemperatureNotificationSuccess"] = ResolversParentTypes["ToggleControllerTemperatureNotificationSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ToggleControllerTemperatureNotificationResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleControllerTemperatureNotificationResult"] = ResolversParentTypes["ToggleControllerTemperatureNotificationResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "ToggleControllerTemperatureNotificationSuccess"
    | "NotFound"
    | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type AdjustControllerTemperatureNotificationThresholdSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AdjustControllerTemperatureNotificationThresholdSuccess"] = ResolversParentTypes["AdjustControllerTemperatureNotificationThresholdSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdjustControllerTemperatureNotificationThresholdResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AdjustControllerTemperatureNotificationThresholdResult"] = ResolversParentTypes["AdjustControllerTemperatureNotificationThresholdResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AdjustControllerTemperatureNotificationThresholdSuccess"
    | "NotFound"
    | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ToggleControllerHumidityNotificationSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleControllerHumidityNotificationSuccess"] = ResolversParentTypes["ToggleControllerHumidityNotificationSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ToggleControllerHumidityNotificationResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleControllerHumidityNotificationResult"] = ResolversParentTypes["ToggleControllerHumidityNotificationResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ToggleControllerHumidityNotificationSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type AdjustControllerHumidityNotificationThresholdSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AdjustControllerHumidityNotificationThresholdSuccess"] = ResolversParentTypes["AdjustControllerHumidityNotificationThresholdSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdjustControllerHumidityNotificationThresholdResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AdjustControllerHumidityNotificationThresholdResult"] = ResolversParentTypes["AdjustControllerHumidityNotificationThresholdResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AdjustControllerHumidityNotificationThresholdSuccess"
    | "NotFound"
    | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ToggleLocationFaultNotificationSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleLocationFaultNotificationSuccess"] = ResolversParentTypes["ToggleLocationFaultNotificationSuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ToggleLocationFaultNotificationResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleLocationFaultNotificationResult"] = ResolversParentTypes["ToggleLocationFaultNotificationResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ToggleLocationFaultNotificationSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ToggleLocationTemperatureNotificationSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleLocationTemperatureNotificationSuccess"] = ResolversParentTypes["ToggleLocationTemperatureNotificationSuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ToggleLocationTemperatureNotificationResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleLocationTemperatureNotificationResult"] = ResolversParentTypes["ToggleLocationTemperatureNotificationResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "ToggleLocationTemperatureNotificationSuccess"
    | "NotFound"
    | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ToggleLocationHumidityNotificationSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleLocationHumidityNotificationSuccess"] = ResolversParentTypes["ToggleLocationHumidityNotificationSuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ToggleLocationHumidityNotificationResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ToggleLocationHumidityNotificationResult"] = ResolversParentTypes["ToggleLocationHumidityNotificationResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ToggleLocationHumidityNotificationSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type AdjustLocationTemperatureNotificationThresholdSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AdjustLocationTemperatureNotificationThresholdSuccess"] = ResolversParentTypes["AdjustLocationTemperatureNotificationThresholdSuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdjustLocationTemperatureNotificationThresholdResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AdjustLocationTemperatureNotificationThresholdResult"] = ResolversParentTypes["AdjustLocationTemperatureNotificationThresholdResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AdjustLocationTemperatureNotificationThresholdSuccess"
    | "NotFound"
    | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type AdjustLocationHumidityNotificationThresholdSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AdjustLocationHumidityNotificationThresholdSuccess"] = ResolversParentTypes["AdjustLocationHumidityNotificationThresholdSuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdjustLocationHumidityNotificationThresholdResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AdjustLocationHumidityNotificationThresholdResult"] = ResolversParentTypes["AdjustLocationHumidityNotificationThresholdResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AdjustLocationHumidityNotificationThresholdSuccess"
    | "NotFound"
    | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type RenameControllerSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RenameControllerSuccess"] = ResolversParentTypes["RenameControllerSuccess"]
> = ResolversObject<{
  controller?: Resolver<ResolversTypes["Controller"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RenameControllerResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RenameControllerResult"] = ResolversParentTypes["RenameControllerResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "RenameControllerSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type RenameLocationSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RenameLocationSuccess"] = ResolversParentTypes["RenameLocationSuccess"]
> = ResolversObject<{
  location?: Resolver<ResolversTypes["Location"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RenameLocationResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RenameLocationResult"] = ResolversParentTypes["RenameLocationResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "RenameLocationSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type TemperaturePresetResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["TemperaturePreset"] = ResolversParentTypes["TemperaturePreset"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  slot?: Resolver<Maybe<ResolversTypes["Slot"]>, ParentType, ContextType>;
  setpoint?: Resolver<ResolversTypes["Setpoint"], ParentType, ContextType>;
  fanMode?: Resolver<Maybe<ResolversTypes["FanMode"]>, ParentType, ContextType>;
  removable?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddTemperaturePresetSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AddTemperaturePresetSuccess"] = ResolversParentTypes["AddTemperaturePresetSuccess"]
> = ResolversObject<{
  temperaturePreset?: Resolver<
    ResolversTypes["TemperaturePreset"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddTemperaturePresetResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["AddTemperaturePresetResult"] = ResolversParentTypes["AddTemperaturePresetResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "AddTemperaturePresetSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ChangeTemperaturePresetNameSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeTemperaturePresetNameSuccess"] = ResolversParentTypes["ChangeTemperaturePresetNameSuccess"]
> = ResolversObject<{
  temperaturePreset?: Resolver<
    ResolversTypes["TemperaturePreset"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeTemperaturePresetNameResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeTemperaturePresetNameResult"] = ResolversParentTypes["ChangeTemperaturePresetNameResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeTemperaturePresetNameSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ChangeTemperaturePresetSetpointSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeTemperaturePresetSetpointSuccess"] = ResolversParentTypes["ChangeTemperaturePresetSetpointSuccess"]
> = ResolversObject<{
  temperaturePreset?: Resolver<
    ResolversTypes["TemperaturePreset"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeTemperaturePresetSetpointResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeTemperaturePresetSetpointResult"] = ResolversParentTypes["ChangeTemperaturePresetSetpointResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeTemperaturePresetSetpointSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type ChangeTemperaturePresetFanModeSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeTemperaturePresetFanModeSuccess"] = ResolversParentTypes["ChangeTemperaturePresetFanModeSuccess"]
> = ResolversObject<{
  temperaturePreset?: Resolver<
    ResolversTypes["TemperaturePreset"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeTemperaturePresetFanModeResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["ChangeTemperaturePresetFanModeResult"] = ResolversParentTypes["ChangeTemperaturePresetFanModeResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ChangeTemperaturePresetFanModeSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type RemoveTemperaturePresetSuccessResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RemoveTemperaturePresetSuccess"] = ResolversParentTypes["RemoveTemperaturePresetSuccess"]
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RemoveTemperaturePresetResultResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["RemoveTemperaturePresetResult"] = ResolversParentTypes["RemoveTemperaturePresetResult"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "RemoveTemperaturePresetSuccess" | "NotFound" | "NotSupported",
    ParentType,
    ContextType
  >;
}>;

export type Resolvers<ContextType = AppContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  RequestSurveySessionResult?: RequestSurveySessionResultResolvers<ContextType>;
  FeatureMap?: FeatureMapResolvers<ContextType>;
  SetAppActiveSuccess?: SetAppActiveSuccessResolvers<ContextType>;
  SetAppActiveResult?: SetAppActiveResultResolvers<ContextType>;
  CheckEmailResult?: CheckEmailResultResolvers<ContextType>;
  SendTokenSuccess?: SendTokenSuccessResolvers<ContextType>;
  SendTokenResult?: SendTokenResultResolvers<ContextType>;
  SignInSuccess?: SignInSuccessResolvers<ContextType>;
  EmailInvalid?: EmailInvalidResolvers<ContextType>;
  SignInResult?: SignInResultResolvers<ContextType>;
  RefreshTokenSuccess?: RefreshTokenSuccessResolvers<ContextType>;
  RefreshTokenResult?: RefreshTokenResultResolvers<ContextType>;
  SignUpSuccess?: SignUpSuccessResolvers<ContextType>;
  EmailTaken?: EmailTakenResolvers<ContextType>;
  SignUpResult?: SignUpResultResolvers<ContextType>;
  RemoveAccountSuccess?: RemoveAccountSuccessResolvers<ContextType>;
  RemoveAccountResult?: RemoveAccountResultResolvers<ContextType>;
  AccountSharingQrCode?: AccountSharingQrCodeResolvers<ContextType>;
  GenerateAccountSharingQrCodeSuccess?: GenerateAccountSharingQrCodeSuccessResolvers<ContextType>;
  GenerateAccountSharingQrCodeResult?: GenerateAccountSharingQrCodeResultResolvers<ContextType>;
  Away?: AwayResolvers<ContextType>;
  Controller?: ControllerResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  ToggleControllerAwaySuccess?: ToggleControllerAwaySuccessResolvers<ContextType>;
  ToggleControllerAwayResult?: ToggleControllerAwayResultResolvers<ContextType>;
  ToggleLocationAwaySuccess?: ToggleLocationAwaySuccessResolvers<ContextType>;
  ToggleLocationAwayResult?: ToggleLocationAwayResultResolvers<ContextType>;
  ChangeControllerAwaySetpointSuccess?: ChangeControllerAwaySetpointSuccessResolvers<ContextType>;
  ChangeControllerAwaySetpointResult?: ChangeControllerAwaySetpointResultResolvers<ContextType>;
  ChangeLocationAwaySetpointSuccess?: ChangeLocationAwaySetpointSuccessResolvers<ContextType>;
  ChangeLocationAwaySetpointResult?: ChangeLocationAwaySetpointResultResolvers<ContextType>;
  RangeValue?: RangeValueResolvers<ContextType>;
  DualRangeValue?: DualRangeValueResolvers<ContextType>;
  PercentageRangeValue?: PercentageRangeValueResolvers<ContextType>;
  Range?: RangeResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  FanRunning?: FanRunningResolvers<ContextType>;
  SpeedNameFan?: SpeedNameFanResolvers<ContextType>;
  PercentageFan?: PercentageFanResolvers<ContextType>;
  Fan?: FanResolvers<ContextType>;
  Mode?: ModeResolvers<ContextType>;
  ChangeModeSuccess?: ChangeModeSuccessResolvers<ContextType>;
  InvalidMode?: InvalidModeResolvers<ContextType>;
  InvalidModeTransition?: InvalidModeTransitionResolvers<ContextType>;
  ChangeModeResult?: ChangeModeResultResolvers<ContextType>;
  ScheduleTime?: ScheduleTimeResolvers<ContextType>;
  ScheduleEvent?: ScheduleEventResolvers<ContextType>;
  ScheduleDay?: ScheduleDayResolvers<ContextType>;
  Schedule?: ScheduleResolvers<ContextType>;
  HoldLengthIndefinite?: HoldLengthIndefiniteResolvers<ContextType>;
  HoldLengthNextEvent?: HoldLengthNextEventResolvers<ContextType>;
  HoldLengthHours?: HoldLengthHoursResolvers<ContextType>;
  HoldLengthDate?: HoldLengthDateResolvers<ContextType>;
  HoldLength?: HoldLengthResolvers<ContextType>;
  CancelHoldSuccess?: CancelHoldSuccessResolvers<ContextType>;
  CancelHoldResult?: CancelHoldResultResolvers<ContextType>;
  ChangeScheduleEventTimeSuccess?: ChangeScheduleEventTimeSuccessResolvers<ContextType>;
  ChangeScheduleEventTimeResult?: ChangeScheduleEventTimeResultResolvers<ContextType>;
  ChangeScheduleEventTemperaturePresetSuccess?: ChangeScheduleEventTemperaturePresetSuccessResolvers<ContextType>;
  ChangeScheduleEventTemperaturePresetResult?: ChangeScheduleEventTemperaturePresetResultResolvers<ContextType>;
  AddScheduleEventSuccess?: AddScheduleEventSuccessResolvers<ContextType>;
  ScheduleFull?: ScheduleFullResolvers<ContextType>;
  AddScheduleEventResult?: AddScheduleEventResultResolvers<ContextType>;
  CopyScheduleSuccess?: CopyScheduleSuccessResolvers<ContextType>;
  CopyScheduleResult?: CopyScheduleResultResolvers<ContextType>;
  RemoveScheduleEventSuccess?: RemoveScheduleEventSuccessResolvers<ContextType>;
  RemoveScheduleEventResult?: RemoveScheduleEventResultResolvers<ContextType>;
  SingleSetpoint?: SingleSetpointResolvers<ContextType>;
  DualSetpoint?: DualSetpointResolvers<ContextType>;
  Setpoint?: SetpointResolvers<ContextType>;
  SetpointRange?: SetpointRangeResolvers<ContextType>;
  ChangeSetpointSuccess?: ChangeSetpointSuccessResolvers<ContextType>;
  AwayActive?: AwayActiveResolvers<ContextType>;
  ChangeSetpointResult?: ChangeSetpointResultResolvers<ContextType>;
  ChangeDefaultControllerHoldLengthSuccess?: ChangeDefaultControllerHoldLengthSuccessResolvers<ContextType>;
  ChangeDefaultControllerHoldLengthResult?: ChangeDefaultControllerHoldLengthResultResolvers<ContextType>;
  ChangeDefaultLocationHoldLengthSuccess?: ChangeDefaultLocationHoldLengthSuccessResolvers<ContextType>;
  ChangeDefaultLocationHoldLengthResult?: ChangeDefaultLocationHoldLengthResultResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  NotFound?: NotFoundResolvers<ContextType>;
  NotSupported?: NotSupportedResolvers<ContextType>;
  TokenInvalid?: TokenInvalidResolvers<ContextType>;
  Log?: LogResolvers<ContextType>;
  FaultLogLabel?: FaultLogLabelResolvers<ContextType>;
  FaultLogLabelAndDescription?: FaultLogLabelAndDescriptionResolvers<ContextType>;
  FaultLog?: FaultLogResolvers<ContextType>;
  RemoveLocationSuccess?: RemoveLocationSuccessResolvers<ContextType>;
  RemoveLocationResult?: RemoveLocationResultResolvers<ContextType>;
  ChangeLocationAwaySuccess?: ChangeLocationAwaySuccessResolvers<ContextType>;
  ChangeLocationAwayResult?: ChangeLocationAwayResultResolvers<ContextType>;
  ConnectAylaDisplaySuccess?: ConnectAylaDisplaySuccessResolvers<ContextType>;
  DeviceStateInvalid?: DeviceStateInvalidResolvers<ContextType>;
  ConnectAylaDisplayResult?: ConnectAylaDisplayResultResolvers<ContextType>;
  ChangeTemperatureUnitSuccess?: ChangeTemperatureUnitSuccessResolvers<ContextType>;
  ChangeTemperatureUnitResult?: ChangeTemperatureUnitResultResolvers<ContextType>;
  Manufacturer?: ManufacturerResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  HumidityNotification?: HumidityNotificationResolvers<ContextType>;
  TemperatureNotification?: TemperatureNotificationResolvers<ContextType>;
  BasicNotification?: BasicNotificationResolvers<ContextType>;
  PushToken?: PushTokenResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  SubscribeToNotificationsSuccess?: SubscribeToNotificationsSuccessResolvers<ContextType>;
  SubscribeToNotificationsResult?: SubscribeToNotificationsResultResolvers<ContextType>;
  UnsubscribeFromNotificationsSuccess?: UnsubscribeFromNotificationsSuccessResolvers<ContextType>;
  UnsubscribeFromNotificationsResult?: UnsubscribeFromNotificationsResultResolvers<ContextType>;
  ToggleControllerTemperatureNotificationSuccess?: ToggleControllerTemperatureNotificationSuccessResolvers<ContextType>;
  ToggleControllerTemperatureNotificationResult?: ToggleControllerTemperatureNotificationResultResolvers<ContextType>;
  AdjustControllerTemperatureNotificationThresholdSuccess?: AdjustControllerTemperatureNotificationThresholdSuccessResolvers<ContextType>;
  AdjustControllerTemperatureNotificationThresholdResult?: AdjustControllerTemperatureNotificationThresholdResultResolvers<ContextType>;
  ToggleControllerHumidityNotificationSuccess?: ToggleControllerHumidityNotificationSuccessResolvers<ContextType>;
  ToggleControllerHumidityNotificationResult?: ToggleControllerHumidityNotificationResultResolvers<ContextType>;
  AdjustControllerHumidityNotificationThresholdSuccess?: AdjustControllerHumidityNotificationThresholdSuccessResolvers<ContextType>;
  AdjustControllerHumidityNotificationThresholdResult?: AdjustControllerHumidityNotificationThresholdResultResolvers<ContextType>;
  ToggleLocationFaultNotificationSuccess?: ToggleLocationFaultNotificationSuccessResolvers<ContextType>;
  ToggleLocationFaultNotificationResult?: ToggleLocationFaultNotificationResultResolvers<ContextType>;
  ToggleLocationTemperatureNotificationSuccess?: ToggleLocationTemperatureNotificationSuccessResolvers<ContextType>;
  ToggleLocationTemperatureNotificationResult?: ToggleLocationTemperatureNotificationResultResolvers<ContextType>;
  ToggleLocationHumidityNotificationSuccess?: ToggleLocationHumidityNotificationSuccessResolvers<ContextType>;
  ToggleLocationHumidityNotificationResult?: ToggleLocationHumidityNotificationResultResolvers<ContextType>;
  AdjustLocationTemperatureNotificationThresholdSuccess?: AdjustLocationTemperatureNotificationThresholdSuccessResolvers<ContextType>;
  AdjustLocationTemperatureNotificationThresholdResult?: AdjustLocationTemperatureNotificationThresholdResultResolvers<ContextType>;
  AdjustLocationHumidityNotificationThresholdSuccess?: AdjustLocationHumidityNotificationThresholdSuccessResolvers<ContextType>;
  AdjustLocationHumidityNotificationThresholdResult?: AdjustLocationHumidityNotificationThresholdResultResolvers<ContextType>;
  RenameControllerSuccess?: RenameControllerSuccessResolvers<ContextType>;
  RenameControllerResult?: RenameControllerResultResolvers<ContextType>;
  RenameLocationSuccess?: RenameLocationSuccessResolvers<ContextType>;
  RenameLocationResult?: RenameLocationResultResolvers<ContextType>;
  TemperaturePreset?: TemperaturePresetResolvers<ContextType>;
  AddTemperaturePresetSuccess?: AddTemperaturePresetSuccessResolvers<ContextType>;
  AddTemperaturePresetResult?: AddTemperaturePresetResultResolvers<ContextType>;
  ChangeTemperaturePresetNameSuccess?: ChangeTemperaturePresetNameSuccessResolvers<ContextType>;
  ChangeTemperaturePresetNameResult?: ChangeTemperaturePresetNameResultResolvers<ContextType>;
  ChangeTemperaturePresetSetpointSuccess?: ChangeTemperaturePresetSetpointSuccessResolvers<ContextType>;
  ChangeTemperaturePresetSetpointResult?: ChangeTemperaturePresetSetpointResultResolvers<ContextType>;
  ChangeTemperaturePresetFanModeSuccess?: ChangeTemperaturePresetFanModeSuccessResolvers<ContextType>;
  ChangeTemperaturePresetFanModeResult?: ChangeTemperaturePresetFanModeResultResolvers<ContextType>;
  RemoveTemperaturePresetSuccess?: RemoveTemperaturePresetSuccessResolvers<ContextType>;
  RemoveTemperaturePresetResult?: RemoveTemperaturePresetResultResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = AppContext> = Resolvers<ContextType>;
