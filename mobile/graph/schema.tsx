import * as ApolloReactCommon from "@apollo/client";
import * as ApolloReactHooks from "@apollo/client";
import gql from "graphql-tag";

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Platform = "IOS" | "ANDROID";

export type UpdateMechanism = "NATIVE" | "OTA";

export type Query = {
  __typename?: "Query";
  _: Maybe<Scalars["Boolean"]>;
  controller: Maybe<Controller>;
  controllers: Array<Controller>;
  features: FeatureMap;
  location: Maybe<Location>;
  locations: Array<Location>;
  manufacturer: Manufacturer;
  me: Maybe<User>;
  requestRating: Scalars["Boolean"];
  requestSurveyFeedback: Scalars["Boolean"];
  scheduleEvent: Maybe<ScheduleEvent>;
  scheduleEvents: Array<ScheduleEvent>;
  temperaturePreset: Maybe<TemperaturePreset>;
  temperaturePresets: Maybe<Array<TemperaturePreset>>;
  updateRequired: Maybe<UpdateMechanism>;
};

export type QueryControllerArgs = {
  id: Scalars["ID"];
};

export type QueryLocationArgs = {
  id: Scalars["ID"];
};

export type QueryRequestRatingArgs = {
  input: Maybe<RequestRatingInput>;
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
  _: Maybe<Scalars["Boolean"]>;
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
  lastDisplayedAt: Maybe<Scalars["String"]>;
  platform: Platform;
  version: Scalars["String"];
};

export type RequestSurveyFeedbackInput = {
  build: Scalars["String"];
  installedAt: Scalars["String"];
  lastDisplayedAt: Maybe<Scalars["String"]>;
  lastResponseAt: Maybe<Scalars["String"]>;
  platform: Platform;
  version: Scalars["String"];
};

export type UpdateRequiredInput = {
  platform: Platform;
  version: Scalars["String"];
  build: Scalars["String"];
};

export type AppActiveTrackingFeature = "INTERVAL_60";

export type FeatureMap = {
  __typename?: "FeatureMap";
  _: Maybe<Scalars["Boolean"]>;
  accountSharing: Maybe<AccountSharingFeature>;
  appActiveTracking: Maybe<Array<AppActiveTrackingFeature>>;
  away: Maybe<Array<AwayFeature>>;
  changeDefaultHoldLengthController: Maybe<Array<DefaultHoldLengthFeature>>;
  changeDefaultHoldLengthLocation: Maybe<Array<DefaultHoldLengthFeature>>;
  changeTemperatureUnit: Maybe<ChangeTemperatureUnitFeature>;
  connect: Maybe<ConnectFeature>;
  faultLogsController: Maybe<FaultLogsFeature>;
  faultLogsLocation: Maybe<FaultLogsFeature>;
  notifications: Maybe<Array<NotificationsFeature>>;
  rename: Maybe<Array<RenameFeature>>;
  schedule: Maybe<ScheduleFeature>;
  signIn: SignInFeature;
  temperaturePresets: Maybe<Array<TemperaturePresetsFeature>>;
};

export type AppState = "FOREGROUND" | "BACKGROUND" | "UNKNOWN";

export type SetAppActiveInput = {
  appState: AppState;
  controllerId: Maybe<Scalars["ID"]>;
  locationId: Maybe<Scalars["ID"]>;
};

export type SetAppActiveSuccess = {
  __typename?: "SetAppActiveSuccess";
  _: Maybe<Scalars["Boolean"]>;
};

export type SetAppActiveResult = SetAppActiveSuccess | NotSupported | NotFound;

export type AccountSharingFeature = "QR_CODE";

export type SignInFeature = "TOKEN";

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
  _: Maybe<Scalars["Boolean"]>;
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
  message: Maybe<Scalars["String"]>;
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
  _: Maybe<Scalars["Boolean"]>;
};

export type EmailTaken = Error & {
  __typename?: "EmailTaken";
  message: Maybe<Scalars["String"]>;
};

export type SignUpResult = SignUpSuccess | EmailInvalid | EmailTaken;

export type RemoveAccountInput = {
  token: Scalars["String"];
};

export type RemoveAccountSuccess = {
  __typename?: "RemoveAccountSuccess";
  _: Maybe<Scalars["Boolean"]>;
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
  ttl: Maybe<Scalars["Int"]>;
};

export type GenerateAccountSharingQrCodeSuccess = {
  __typename?: "GenerateAccountSharingQrCodeSuccess";
  code: AccountSharingQrCode;
};

export type GenerateAccountSharingQrCodeResult =
  | GenerateAccountSharingQrCodeSuccess
  | NotSupported;

export type AwayFeature = "AWAY_CONTROLLER" | "AWAY_LOCATION";

export type Away = {
  __typename?: "Away";
  active: Scalars["Boolean"];
  setpoint: Setpoint;
};

export type Controller = {
  __typename?: "Controller";
  activeHold: Maybe<HoldLength>;
  away: Maybe<Away>;
  call: Maybe<Call>;
  defaultHoldLength: Maybe<HoldLength>;
  fan: Maybe<Fan>;
  faultActive: Maybe<Scalars["Boolean"]>;
  faultLogs: Maybe<Array<FaultLog>>;
  humidityAmbient: Maybe<Scalars["Float"]>;
  humidityNotification: Maybe<HumidityNotification>;
  id: Scalars["ID"];
  location: Location;
  mode: Mode;
  modes: Array<Mode>;
  name: Scalars["String"];
  schedule: Maybe<Schedule>;
  setpoint: Setpoint;
  setpointRange: SetpointRange;
  temperatureAmbient: Scalars["Float"];
  temperatureNotification: Maybe<TemperatureNotification>;
  zoning: Scalars["Boolean"];
};

export type Location = {
  __typename?: "Location";
  away: Maybe<Away>;
  awayActive: Scalars["Boolean"];
  connectionStatus: ConnectionStatus;
  controller: Maybe<Controller>;
  controllers: Array<Controller>;
  defaultHoldLength: Maybe<HoldLength>;
  faultActive: Maybe<Scalars["Boolean"]>;
  faultLogs: Maybe<Array<FaultLog>>;
  faultNotification: Maybe<BasicNotification>;
  humidityNotification: Maybe<HumidityNotification>;
  id: Scalars["ID"];
  lat: Maybe<Scalars["Float"]>;
  lng: Maybe<Scalars["Float"]>;
  name: Scalars["String"];
  temperatureNotification: Maybe<TemperatureNotification>;
  temperatureOutdoor: Maybe<Scalars["Float"]>;
  temperaturePreset: Maybe<TemperaturePreset>;
  temperaturePresets: Maybe<Array<TemperaturePreset>>;
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
  single: Maybe<SingleSetpointInput>;
  dual: Maybe<DualSetpointInput>;
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

export type Placement = "PRIMARY" | "SECONDARY" | "TERTIARY";

export type RangeValue = {
  value: Scalars["Float"];
  min: Scalars["Float"];
  max: Scalars["Float"];
  step: Scalars["Float"];
};

export type DualRangeValue = {
  lower: RangeValue;
  upper: RangeValue;
  minInterval: Maybe<Scalars["Float"]>;
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

export type Call = "HEAT" | "COOL";

export type FanRunning = {
  running: Scalars["Boolean"];
};

export type SpeedNameFan = FanRunning & {
  __typename?: "SpeedNameFan";
  activeSpeedName: Maybe<Scalars["String"]>;
  running: Scalars["Boolean"];
};

export type PercentageFan = FanRunning & {
  __typename?: "PercentageFan";
  activeSpeedPercent: Scalars["Float"];
  running: Scalars["Boolean"];
};

export type Fan = PercentageFan | SpeedNameFan;

export type EffectiveMode = "COOL" | "HEAT" | "HEATCOOL" | "OFF";

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
  message: Maybe<Scalars["String"]>;
};

export type InvalidModeTransition = Error & {
  __typename?: "InvalidModeTransition";
  message: Maybe<Scalars["String"]>;
};

export type ChangeModeResult =
  | ChangeModeSuccess
  | InvalidMode
  | InvalidModeTransition
  | NotFound;

export type ScheduleFeature =
  | "SCHEDULE_TEMPERATURE"
  | "SCHEDULE_TEMPERATURE_FAN";

export type Day = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

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
  _: Maybe<Scalars["Boolean"]>;
};

export type HoldLengthNextEvent = {
  __typename?: "HoldLengthNextEvent";
  _: Maybe<Scalars["Boolean"]>;
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
  temperaturePresetId: Maybe<Scalars["ID"]>;
};

export type AddScheduleEventSuccess = {
  __typename?: "AddScheduleEventSuccess";
  controller: Controller;
  scheduleEvent: ScheduleEvent;
};

export type ScheduleFull = Error & {
  __typename?: "ScheduleFull";
  message: Maybe<Scalars["String"]>;
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
  single: Maybe<SingleSetpointInput>;
  dual: Maybe<DualSetpointInput>;
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
  message: Maybe<Scalars["String"]>;
};

export type ChangeSetpointResult =
  | ChangeSetpointSuccess
  | AwayActive
  | NotSupported
  | NotFound;

export type DefaultHoldLengthFeature =
  | "INDEFINITE"
  | "NEXT_EVENT"
  | "HOURS_12"
  | "HOURS_24"
  | "DATE";

export type ChangeDefaultHoldLengthIndefiniteInput = {
  _: Maybe<Scalars["Boolean"]>;
};

export type ChangeDefaultHoldLengthNextEventInput = {
  _: Maybe<Scalars["Boolean"]>;
};

export type ChangeDefaultHoldLengthHoursInput = {
  hours: Scalars["Int"];
};

export type ChangeDefaultHoldLengthDateInput = {
  date: Scalars["String"];
};

export type ChangeDefaultHoldLengthInput = {
  id: Scalars["ID"];
  indefinite: Maybe<ChangeDefaultHoldLengthIndefiniteInput>;
  nextEvent: Maybe<ChangeDefaultHoldLengthNextEventInput>;
  hours: Maybe<ChangeDefaultHoldLengthHoursInput>;
  date: Maybe<ChangeDefaultHoldLengthDateInput>;
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
  message: Maybe<Scalars["String"]>;
};

export type NotFound = Error & {
  __typename?: "NotFound";
  message: Maybe<Scalars["String"]>;
};

export type NotSupported = Error & {
  __typename?: "NotSupported";
  message: Maybe<Scalars["String"]>;
};

export type TokenInvalid = Error & {
  __typename?: "TokenInvalid";
  message: Maybe<Scalars["String"]>;
};

export type FanMode = "AUTO" | "FIFTEEN" | "THIRTY" | "FORTYFIVE" | "ALWAYS";

export type FaultLogsFeature =
  | "LOG_WITH_LABEL"
  | "LOG_WITH_LABEL_AND_DESCRIPTION";

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

export type ConnectionStatus = "ONLINE" | "OFFLINE";

export type RemoveLocationInput = {
  id: Scalars["ID"];
};

export type RemoveLocationSuccess = {
  __typename?: "RemoveLocationSuccess";
  _: Maybe<Scalars["Boolean"]>;
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

export type ConnectFeature = "AYLA_DISPLAY";

export type ConnectAylaDisplayInput = {
  token: Scalars["String"];
};

export type ConnectAylaDisplaySuccess = {
  __typename?: "ConnectAylaDisplaySuccess";
  location: Location;
};

export type DeviceStateInvalid = Error & {
  __typename?: "DeviceStateInvalid";
  message: Maybe<Scalars["String"]>;
};

export type ConnectAylaDisplayResult =
  | ConnectAylaDisplaySuccess
  | TokenInvalid
  | DeviceStateInvalid
  | NotSupported;

export type TemperatureUnit = "F" | "C";

export type ChangeTemperatureUnitFeature = "APP_ONLY";

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
  support: Maybe<Contact>;
};

export type Contact = {
  __typename?: "Contact";
  name: Scalars["String"];
  email: Maybe<Scalars["String"]>;
  phone: Maybe<Scalars["String"]>;
  website: Maybe<Scalars["String"]>;
};

export type NotificationsFeature =
  | "CONTROLLER_TEMPERATURE"
  | "CONTROLLER_HUMIDITY"
  | "LOCATION_TEMPERATURE"
  | "LOCATION_HUMIDITY"
  | "LOCATION_FAULTS";

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

export type PushTokenStatus = "ENABLED" | "DISABLED";

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
  pushTokens: Maybe<Array<PushToken>>;
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
  _: Maybe<Scalars["Boolean"]>;
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

export type RenameFeature = "CONTROLLER" | "LOCATION";

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

export type TemperaturePresetsFeature = "BUILT_IN" | "CUSTOM";

export type Slot = "HOME" | "AWAY" | "SLEEP" | "CUSTOM";

export type TemperaturePreset = {
  __typename?: "TemperaturePreset";
  id: Scalars["ID"];
  name: Scalars["String"];
  slot: Maybe<Slot>;
  setpoint: Setpoint;
  fanMode: Maybe<FanMode>;
  removable: Scalars["Boolean"];
};

export type AddTemperaturePresetInput = {
  id: Scalars["ID"];
  single: Maybe<SingleSetpointInput>;
  dual: Maybe<DualSetpointInput>;
  name: Scalars["String"];
  fanMode: Maybe<FanMode>;
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
  single: Maybe<SingleSetpointInput>;
  dual: Maybe<DualSetpointInput>;
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
  _: Maybe<Scalars["Boolean"]>;
};

export type RemoveTemperaturePresetResult =
  | RemoveTemperaturePresetSuccess
  | NotFound
  | NotSupported;

export type SetAppActiveMutationVariables = Exact<{
  appState: AppState;
  controllerId: Scalars["ID"];
  locationId: Scalars["ID"];
}>;

export type SetAppActiveMutation = { __typename?: "Mutation" } & {
  setAppActive:
    | { __typename: "SetAppActiveSuccess" }
    | { __typename: "NotSupported" }
    | { __typename: "NotFound" };
};

export type Component_SelectControllerModal_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id" | "name" | "temperatureAmbient"> & {
    mode: { __typename?: "Mode" } & Pick<Mode, "effectiveMode">;
  };

export type Component_SelectControllerModal_LocationFragment = {
  __typename: "Location";
} & Pick<
  Location,
  "id" | "name" | "zoning" | "connectionStatus" | "temperatureUnit"
> & {
    controllers: Array<
      {
        __typename?: "Controller";
      } & Component_SelectControllerModal_ControllerFragment
    >;
  };

export type SelectControllerQueryVariables = Exact<{ [key: string]: never }>;

export type SelectControllerQuery = { __typename?: "Query" } & {
  locations: Array<
    {
      __typename?: "Location";
    } & Component_SelectControllerModal_LocationFragment
  >;
};

export type Component_SelectModeModal_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id" | "name"> & {
    mode: { __typename?: "Mode" } & Component_SelectModeModal_ModeFragment;
    modes: Array<
      { __typename?: "Mode" } & Component_SelectModeModal_ModeFragment
    >;
    setpoint:
      | ({
          __typename?: "SingleSetpoint";
        } & SetpointFields_SingleSetpoint_Fragment)
      | ({
          __typename?: "DualSetpoint";
        } & SetpointFields_DualSetpoint_Fragment);
  };

export type Component_SelectModeModal_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id" | "name"> & {
    away: Maybe<{ __typename?: "Away" } & Pick<Away, "active">>;
  };

export type Component_SelectModeModal_ModeFragment = {
  __typename?: "Mode";
} & Pick<Mode, "effectiveMode" | "name" | "placement"> & {
    transitionTo: Array<{ __typename?: "Mode" } & Pick<Mode, "name">>;
  };

export type SelectModeQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type SelectModeQuery = { __typename?: "Query" } & {
  controller: Maybe<
    { __typename?: "Controller" } & {
      location: {
        __typename?: "Location";
      } & Component_SelectModeModal_LocationFragment;
    } & Component_SelectModeModal_ControllerFragment
  >;
};

export type ChangeModeMutationVariables = Exact<{
  id: Scalars["ID"];
  mode: Scalars["String"];
}>;

export type ChangeModeMutation = { __typename?: "Mutation" } & {
  changeMode:
    | ({ __typename?: "ChangeModeSuccess" } & {
        controller: {
          __typename?: "Controller";
        } & Component_SelectModeModal_ControllerFragment;
      })
    | { __typename?: "InvalidMode" }
    | { __typename?: "InvalidModeTransition" }
    | { __typename?: "NotFound" };
};

export type ToggleLocationAwayMutationVariables = Exact<{
  input: ToggleAwayInput;
}>;

export type ToggleLocationAwayMutation = { __typename?: "Mutation" } & {
  toggleLocationAway:
    | ({ __typename?: "ToggleLocationAwaySuccess" } & {
        location: { __typename?: "Location" } & {
          controllers: Array<
            {
              __typename?: "Controller";
            } & Component_SelectModeModal_ControllerFragment
          >;
        } & Component_SelectModeModal_LocationFragment;
      })
    | { __typename?: "NotFound" }
    | { __typename?: "NotSupported" };
};

export type Component_SurveyChatModal_UserFragment = {
  __typename?: "User";
} & Pick<User, "id" | "email">;

export type SurveyChatModalQueryVariables = Exact<{ [key: string]: never }>;

export type SurveyChatModalQuery = { __typename?: "Query" } & {
  me: Maybe<{ __typename?: "User" } & Component_SurveyChatModal_UserFragment>;
};

export type Component_Controlled_Dial_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id" | "call" | "temperatureAmbient"> & {
    activeHold: Maybe<
      | { __typename: "HoldLengthIndefinite" }
      | { __typename: "HoldLengthNextEvent" }
      | { __typename: "HoldLengthHours" }
      | { __typename: "HoldLengthDate" }
    >;
    away: Maybe<{ __typename?: "Away" } & Pick<Away, "active">>;
    mode: { __typename?: "Mode" } & Pick<Mode, "effectiveMode">;
    location: {
      __typename?: "Location";
    } & Component_Controlled_Dial_LocationFragment;
    setpoint:
      | ({
          __typename?: "SingleSetpoint";
        } & SetpointFields_SingleSetpoint_Fragment)
      | ({
          __typename?: "DualSetpoint";
        } & SetpointFields_DualSetpoint_Fragment);
    setpointRange: { __typename?: "SetpointRange" } & Pick<
      SetpointRange,
      "min" | "max"
    >;
  };

export type Component_Controlled_Dial_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id" | "connectionStatus" | "temperatureUnit"> & {
    away: Maybe<{ __typename?: "Away" } & Pick<Away, "active">>;
  };

export type ControlledDialQueryVariables = Exact<{
  controllerId: Scalars["ID"];
}>;

export type ControlledDialQuery = { __typename?: "Query" } & {
  controller: Maybe<
    { __typename?: "Controller" } & Component_Controlled_Dial_ControllerFragment
  >;
};

export type ChangeSetpointMutationVariables = Exact<{
  id: Scalars["ID"];
  single: Maybe<SingleSetpointInput>;
  dual: Maybe<DualSetpointInput>;
}>;

export type ChangeSetpointMutation = { __typename?: "Mutation" } & {
  changeSetpoint:
    | ({ __typename: "ChangeSetpointSuccess" } & {
        controller: { __typename?: "Controller" } & {
          setpoint:
            | ({
                __typename?: "SingleSetpoint";
              } & SetpointFields_SingleSetpoint_Fragment)
            | ({
                __typename?: "DualSetpoint";
              } & SetpointFields_DualSetpoint_Fragment);
        };
      })
    | { __typename: "AwayActive" }
    | { __typename: "NotSupported" }
    | { __typename: "NotFound" };
};

export type RemoveAccountMutationVariables = Exact<{ [key: string]: never }>;

export type RemoveAccountMutation = { __typename?: "Mutation" } & {
  removeAccount:
    | { __typename: "RemoveAccountSuccess" }
    | { __typename: "TokenInvalid" };
};

export type RemoveLocationMutationVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type RemoveLocationMutation = { __typename?: "Mutation" } & {
  removeLocation:
    | { __typename: "RemoveLocationSuccess" }
    | { __typename: "NotFound" };
};

export type Context_Controllers_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id"> & {
    location: { __typename: "Location" } & Pick<
      Location,
      "id" | "temperatureUnit"
    >;
  };

export type ControllersContextQueryVariables = Exact<{ [key: string]: never }>;

export type ControllersContextQuery = { __typename?: "Query" } & {
  controllers: Array<
    { __typename?: "Controller" } & Context_Controllers_ControllerFragment
  >;
};

export type FeatureFlagContextQueryVariables = Exact<{ [key: string]: never }>;

export type FeatureFlagContextQuery = { __typename?: "Query" } & {
  features: { __typename?: "FeatureMap" } & FeatureMapFieldsFragment;
};

export type BootstrapQueryVariables = Exact<{
  platform: Platform;
  version: Scalars["String"];
  build: Scalars["String"];
}>;

export type BootstrapQuery = { __typename?: "Query" } & Pick<
  Query,
  "updateRequired"
> & {
    controllers: Array<
      { __typename?: "Controller" } & BootstrapControllerFieldsFragment
    >;
    features: { __typename?: "FeatureMap" } & FeatureMapFieldsFragment;
    locations: Array<
      { __typename?: "Location" } & BootstrapLocationFieldsFragment
    >;
    me: Maybe<{ __typename?: "User" } & UserBootstrapFieldsFragment>;
  };

export type LoadQueryVariables = Exact<{ [key: string]: never }>;

export type LoadQuery = { __typename?: "Query" } & {
  controllers: Array<{ __typename?: "Controller" } & ControllerFieldsFragment>;
  locations: Array<{ __typename?: "Location" } & LocationFieldsFragment>;
  manufacturer: { __typename?: "Manufacturer" } & ManufacturerFieldsFragment;
  me: Maybe<{ __typename?: "User" } & UserFieldsFragment>;
};

export type AwayFieldsFragment = { __typename?: "Away" } & Pick<
  Away,
  "active"
> & {
    setpoint:
      | ({
          __typename?: "SingleSetpoint";
        } & SetpointFields_SingleSetpoint_Fragment)
      | ({
          __typename?: "DualSetpoint";
        } & SetpointFields_DualSetpoint_Fragment);
  };

type HoldLengthFields_HoldLengthIndefinite_Fragment = {
  __typename: "HoldLengthIndefinite";
} & Pick<HoldLengthIndefinite, "_">;

type HoldLengthFields_HoldLengthNextEvent_Fragment = {
  __typename: "HoldLengthNextEvent";
} & Pick<HoldLengthNextEvent, "_">;

type HoldLengthFields_HoldLengthHours_Fragment = {
  __typename: "HoldLengthHours";
} & Pick<HoldLengthHours, "hours">;

type HoldLengthFields_HoldLengthDate_Fragment = {
  __typename: "HoldLengthDate";
} & Pick<HoldLengthDate, "date">;

export type HoldLengthFieldsFragment =
  | HoldLengthFields_HoldLengthIndefinite_Fragment
  | HoldLengthFields_HoldLengthNextEvent_Fragment
  | HoldLengthFields_HoldLengthHours_Fragment
  | HoldLengthFields_HoldLengthDate_Fragment;

type RangeValueFields_PercentageRangeValue_Fragment = {
  __typename?: "PercentageRangeValue";
} & Pick<PercentageRangeValue, "min" | "max" | "value" | "step">;

type RangeValueFields_SingleSetpoint_Fragment = {
  __typename?: "SingleSetpoint";
} & Pick<SingleSetpoint, "min" | "max" | "value" | "step">;

export type RangeValueFieldsFragment =
  | RangeValueFields_PercentageRangeValue_Fragment
  | RangeValueFields_SingleSetpoint_Fragment;

type DualRangeValueFields_DualSetpoint_Fragment = {
  __typename?: "DualSetpoint";
} & Pick<DualSetpoint, "minInterval"> & {
    lower: {
      __typename?: "SingleSetpoint";
    } & RangeValueFields_SingleSetpoint_Fragment;
    upper: {
      __typename?: "SingleSetpoint";
    } & RangeValueFields_SingleSetpoint_Fragment;
  };

type DualRangeValueFields_HumidityNotification_Fragment = {
  __typename?: "HumidityNotification";
} & Pick<HumidityNotification, "minInterval"> & {
    lower: {
      __typename?: "PercentageRangeValue";
    } & RangeValueFields_PercentageRangeValue_Fragment;
    upper: {
      __typename?: "PercentageRangeValue";
    } & RangeValueFields_PercentageRangeValue_Fragment;
  };

type DualRangeValueFields_TemperatureNotification_Fragment = {
  __typename?: "TemperatureNotification";
} & Pick<TemperatureNotification, "minInterval"> & {
    lower: {
      __typename?: "SingleSetpoint";
    } & RangeValueFields_SingleSetpoint_Fragment;
    upper: {
      __typename?: "SingleSetpoint";
    } & RangeValueFields_SingleSetpoint_Fragment;
  };

export type DualRangeValueFieldsFragment =
  | DualRangeValueFields_DualSetpoint_Fragment
  | DualRangeValueFields_HumidityNotification_Fragment
  | DualRangeValueFields_TemperatureNotification_Fragment;

type SetpointFields_SingleSetpoint_Fragment = {
  __typename?: "SingleSetpoint";
} & RangeValueFields_SingleSetpoint_Fragment;

type SetpointFields_DualSetpoint_Fragment = {
  __typename?: "DualSetpoint";
} & DualRangeValueFields_DualSetpoint_Fragment;

export type SetpointFieldsFragment =
  | SetpointFields_SingleSetpoint_Fragment
  | SetpointFields_DualSetpoint_Fragment;

export type BootstrapControllerFieldsFragment = {
  __typename: "Controller";
} & Pick<Controller, "id"> &
  Context_Controllers_ControllerFragment &
  Screen_Home_ControllerFragment;

export type ControllerFieldsFragment = { __typename: "Controller" } & Pick<
  Controller,
  "id"
> &
  Context_Controllers_ControllerFragment &
  Screen_Home_ControllerFragment &
  Screen_Settings_Away_ControllerFragment &
  Screen_Settings_HoldLength_ControllerFragment &
  Screen_Settings_Notifications_ControllerFragment &
  Screen_Schedules_ControllerFragment &
  Screen_Manage_Schedule_ControllerFragment &
  Screen_Copy_Schedule_ControllerFragment;

export type FeatureMapFieldsFragment = { __typename?: "FeatureMap" } & Pick<
  FeatureMap,
  | "accountSharing"
  | "appActiveTracking"
  | "away"
  | "changeDefaultHoldLengthLocation"
  | "changeTemperatureUnit"
  | "connect"
  | "faultLogsLocation"
  | "notifications"
  | "rename"
  | "schedule"
  | "signIn"
>;

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;

export type RefreshTokenMutation = { __typename?: "Mutation" } & {
  refreshToken:
    | ({ __typename: "RefreshTokenSuccess" } & Pick<
        RefreshTokenSuccess,
        "accessToken" | "refreshToken" | "ttl"
      >)
    | { __typename: "TokenInvalid" };
};

export type BootstrapLocationFieldsFragment = { __typename: "Location" } & Pick<
  Location,
  "id"
>;

export type LocationFieldsFragment = { __typename: "Location" } & Pick<
  Location,
  "id" | "temperatureUnit"
> &
  Screen_Home_LocationFragment &
  Screen_Settings_LocationFragment &
  Screen_Settings_Away_LocationFragment &
  Screen_Settings_HoldLength_LocationFragment &
  Background_AwayActiveStatus_LocationFragment &
  Screen_Settings_Notifications_LocationFragment &
  Screen_Select_Fan_ModeFragment &
  Screen_Settings_List_Temperature_Presets_LocationFragment &
  Screen_Manage_Temperature_Preset_LocationFragment;

export type ManufacturerFieldsFragment = {
  __typename: "Manufacturer";
} & Screen_Settings_ManufacturerFragment &
  Screen_Support_ManufacturerFragment;

export type SubscribeToNotificationsMutationVariables = Exact<{
  input: SubscribeToNotificationsInput;
}>;

export type SubscribeToNotificationsMutation = { __typename?: "Mutation" } & {
  subscribeToNotifications:
    | ({ __typename: "SubscribeToNotificationsSuccess" } & {
        pushToken: { __typename?: "PushToken" } & Pick<PushToken, "id">;
      })
    | { __typename: "NotSupported" };
};

export type UnsubscribeFromNotificationsMutationVariables = Exact<{
  input: UnsubscribeFromNotificationsInput;
}>;

export type UnsubscribeFromNotificationsMutation = {
  __typename?: "Mutation";
} & {
  unsubscribeFromNotifications:
    | { __typename: "UnsubscribeFromNotificationsSuccess" }
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type ScheduleTimeFieldsFragment = { __typename?: "ScheduleTime" } & Pick<
  ScheduleTime,
  "day" | "hour" | "minute"
>;

export type BaseScheduleEventFieldsFragment = {
  __typename: "ScheduleEvent";
} & Pick<ScheduleEvent, "id" | "day" | "removable"> & {
    start: { __typename?: "ScheduleTime" } & ScheduleTimeFieldsFragment;
    end: { __typename?: "ScheduleTime" } & ScheduleTimeFieldsFragment;
    temperaturePreset: {
      __typename?: "TemperaturePreset";
    } & TemperaturePresetsFieldsFragment;
  };

export type ScheduleEventFieldsFragment = { __typename?: "ScheduleEvent" } & {
  nextEvent: { __typename?: "ScheduleEvent" } & BaseScheduleEventFieldsFragment;
  prevEvent: { __typename?: "ScheduleEvent" } & BaseScheduleEventFieldsFragment;
  temperaturePreset: {
    __typename?: "TemperaturePreset";
  } & TemperaturePresetsFieldsFragment;
} & BaseScheduleEventFieldsFragment;

export type ScheduleDayFieldsFragment = { __typename?: "ScheduleDay" } & Pick<
  ScheduleDay,
  "day" | "full"
> & {
    events: Array<
      { __typename?: "ScheduleEvent" } & ScheduleEventFieldsFragment
    >;
  };

export type ScheduleFieldsFragment = { __typename?: "Schedule" } & Pick<
  Schedule,
  "maxEvents" | "minEvents" | "minEventInterval"
> & {
    days: Array<{ __typename?: "ScheduleDay" } & ScheduleDayFieldsFragment>;
    monday: { __typename?: "ScheduleDay" } & ScheduleDayFieldsFragment;
    tuesday: { __typename?: "ScheduleDay" } & ScheduleDayFieldsFragment;
    wednesday: { __typename?: "ScheduleDay" } & ScheduleDayFieldsFragment;
    thursday: { __typename?: "ScheduleDay" } & ScheduleDayFieldsFragment;
    friday: { __typename?: "ScheduleDay" } & ScheduleDayFieldsFragment;
    saturday: { __typename?: "ScheduleDay" } & ScheduleDayFieldsFragment;
    sunday: { __typename?: "ScheduleDay" } & ScheduleDayFieldsFragment;
  };

export type TemperaturePresetsFieldsFragment = {
  __typename?: "TemperaturePreset";
} & Pick<
  TemperaturePreset,
  "id" | "name" | "slot" | "fanMode" | "removable"
> & {
    setpoint:
      | ({
          __typename?: "SingleSetpoint";
        } & SetpointFields_SingleSetpoint_Fragment)
      | ({
          __typename?: "DualSetpoint";
        } & SetpointFields_DualSetpoint_Fragment);
  };

export type UserBootstrapFieldsFragment = { __typename: "User" } & Pick<
  User,
  "id"
>;

export type UserFieldsFragment = { __typename: "User" } & Pick<User, "id"> &
  Screen_ManageAccount_UserFragment &
  Screen_Settings_UserFragment;

export type RequestRatingQueryVariables = Exact<{
  build: Scalars["String"];
  installedAt: Scalars["String"];
  lastDisplayedAt: Maybe<Scalars["String"]>;
  platform: Platform;
  version: Scalars["String"];
}>;

export type RequestRatingQuery = { __typename?: "Query" } & Pick<
  Query,
  "requestRating"
>;

export type RequestSurveyFeedbackQueryVariables = Exact<{
  build: Scalars["String"];
  installedAt: Scalars["String"];
  lastDisplayedAt: Maybe<Scalars["String"]>;
  lastResponseAt: Maybe<Scalars["String"]>;
  platform: Platform;
  version: Scalars["String"];
}>;

export type RequestSurveyFeedbackQuery = { __typename?: "Query" } & Pick<
  Query,
  "requestSurveyFeedback"
>;

export type RequestSurveySessionMutationVariables = Exact<{
  [key: string]: never;
}>;

export type RequestSurveySessionMutation = { __typename?: "Mutation" } & {
  requestSurveySession: { __typename: "RequestSurveySessionResult" } & Pick<
    RequestSurveySessionResult,
    "userId" | "userName" | "sessionToken" | "sessionExpiresAt"
  >;
};

export type ChangeTemperatureUnitMutationVariables = Exact<{
  input: ChangeTemperatureUnitInput;
}>;

export type ChangeTemperatureUnitMutation = { __typename?: "Mutation" } & {
  changeTemperatureUnit:
    | ({ __typename: "ChangeTemperatureUnitSuccess" } & {
        location: { __typename: "Location" } & Pick<
          Location,
          "id" | "temperatureUnit"
        >;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type Screen_Home_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id" | "call" | "humidityAmbient" | "name"> & {
    activeHold: Maybe<
      | { __typename: "HoldLengthIndefinite" }
      | { __typename: "HoldLengthNextEvent" }
      | { __typename: "HoldLengthHours" }
      | { __typename: "HoldLengthDate" }
    >;
    away: Maybe<{ __typename?: "Away" } & Pick<Away, "active">>;
    fan: Maybe<
      | ({ __typename: "PercentageFan" } & Pick<
          PercentageFan,
          "activeSpeedPercent"
        >)
      | ({ __typename: "SpeedNameFan" } & Pick<SpeedNameFan, "activeSpeedName">)
    >;
    location: { __typename?: "Location" } & Screen_Home_LocationFragment;
    mode: { __typename?: "Mode" } & Pick<Mode, "name" | "effectiveMode">;
  } & Component_Controlled_Dial_ControllerFragment &
  Component_SelectModeModal_ControllerFragment &
  Component_SelectControllerModal_ControllerFragment;

export type Screen_Home_LocationFragment = { __typename: "Location" } & Pick<
  Location,
  "id" | "name" | "temperatureOutdoor" | "temperatureUnit" | "faultActive"
> & {
    away: Maybe<{ __typename?: "Away" } & Pick<Away, "active">>;
  } & Component_Controlled_Dial_LocationFragment &
  Component_SelectControllerModal_LocationFragment &
  Component_SelectModeModal_LocationFragment;

export type Screen_Home_UserFragment = {
  __typename: "User";
} & Component_SurveyChatModal_UserFragment;

export type HomeQueryVariables = Exact<{
  controllerId: Scalars["ID"];
}>;

export type HomeQuery = { __typename?: "Query" } & {
  controller: Maybe<
    { __typename?: "Controller" } & Screen_Home_ControllerFragment
  >;
  locations: Array<{ __typename?: "Location" } & Screen_Home_LocationFragment>;
  me: Maybe<{ __typename?: "User" } & Screen_Home_UserFragment>;
};

export type CancelHoldMutationVariables = Exact<{
  controllerId: Scalars["ID"];
}>;

export type CancelHoldMutation = { __typename?: "Mutation" } & {
  cancelHold:
    | ({ __typename?: "CancelHoldSuccess" } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Home_ControllerFragment;
      })
    | { __typename?: "NotFound" };
};

export type Screen_Settings_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id" | "name" | "faultActive" | "temperatureUnit"> & {
    away: Maybe<
      { __typename?: "Away" } & Pick<Away, "active"> & {
          setpoint:
            | ({
                __typename?: "SingleSetpoint";
              } & SetpointFields_SingleSetpoint_Fragment)
            | ({
                __typename?: "DualSetpoint";
              } & SetpointFields_DualSetpoint_Fragment);
        }
    >;
    controllers: Array<
      { __typename: "Controller" } & Pick<Controller, "id" | "name"> & {
          temperatureNotification: Maybe<
            {
              __typename?: "TemperatureNotification";
            } & TemperatureNotificationFragment
          >;
          humidityNotification: Maybe<
            {
              __typename?: "HumidityNotification";
            } & HumidityNotificationFragment
          >;
        }
    >;
    temperatureNotification: Maybe<
      {
        __typename?: "TemperatureNotification";
      } & TemperatureNotificationFragment
    >;
    humidityNotification: Maybe<
      { __typename?: "HumidityNotification" } & HumidityNotificationFragment
    >;
    defaultHoldLength: Maybe<
      | ({
          __typename?: "HoldLengthIndefinite";
        } & HoldLengthFields_HoldLengthIndefinite_Fragment)
      | ({
          __typename?: "HoldLengthNextEvent";
        } & HoldLengthFields_HoldLengthNextEvent_Fragment)
      | ({
          __typename?: "HoldLengthHours";
        } & HoldLengthFields_HoldLengthHours_Fragment)
      | ({
          __typename?: "HoldLengthDate";
        } & HoldLengthFields_HoldLengthDate_Fragment)
    >;
  };

export type Screen_Settings_ManufacturerFragment = {
  __typename?: "Manufacturer";
} & { support: Maybe<{ __typename?: "Contact" } & Pick<Contact, "name">> };

export type Screen_Settings_UserFragment = { __typename: "User" } & Pick<
  User,
  "id" | "email"
>;

export type SettingsQueryVariables = Exact<{ [key: string]: never }>;

export type SettingsQuery = { __typename?: "Query" } & {
  locations: Array<
    { __typename?: "Location" } & Screen_Settings_LocationFragment
  >;
  manufacturer: {
    __typename?: "Manufacturer";
  } & Screen_Settings_ManufacturerFragment;
  me: Maybe<{ __typename?: "User" } & Screen_Settings_UserFragment>;
};

export type SettingsLocationQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type SettingsLocationQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & Screen_Settings_LocationFragment
  >;
};

export type GenerateAccountSharingQrCodeMutationVariables = Exact<{
  width: Scalars["Int"];
}>;

export type GenerateAccountSharingQrCodeMutation = {
  __typename?: "Mutation";
} & {
  generateAccountSharingQrCode:
    | ({ __typename?: "GenerateAccountSharingQrCodeSuccess" } & {
        code: { __typename?: "AccountSharingQrCode" } & Pick<
          AccountSharingQrCode,
          "dataUrl" | "ttl"
        >;
      })
    | { __typename?: "NotSupported" };
};

export type Screen_ManageAccount_UserFragment = { __typename: "User" } & Pick<
  User,
  "id" | "email"
>;

export type ManageAccountQueryVariables = Exact<{ [key: string]: never }>;

export type ManageAccountQuery = { __typename?: "Query" } & {
  me: Maybe<{ __typename?: "User" } & Screen_ManageAccount_UserFragment>;
};

export type Screen_Settings_Away_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id" | "name"> & {
    away: Maybe<{ __typename?: "Away" } & AwayFieldsFragment>;
    location: { __typename?: "Location" } & Pick<Location, "temperatureUnit">;
  };

export type Screen_Settings_Away_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id" | "name" | "lat" | "lng" | "temperatureUnit"> & {
    away: Maybe<{ __typename?: "Away" } & AwayFieldsFragment>;
    controllers: Array<
      { __typename?: "Controller" } & Screen_Settings_Away_ControllerFragment
    >;
  };

export type AwayControllerQueryVariables = Exact<{
  controllerId: Scalars["ID"];
}>;

export type AwayControllerQuery = { __typename?: "Query" } & {
  controller: Maybe<
    { __typename?: "Controller" } & Screen_Settings_Away_ControllerFragment
  >;
};

export type AwayLocationQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type AwayLocationQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & Screen_Settings_Away_LocationFragment
  >;
};

export type ChangeControllerAwaySetpointMutationVariables = Exact<{
  input: ChangeAwaySetpointInput;
}>;

export type ChangeControllerAwaySetpointMutation = {
  __typename?: "Mutation";
} & {
  changeControllerAwaySetpoint:
    | ({ __typename?: "ChangeControllerAwaySetpointSuccess" } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Settings_Away_ControllerFragment;
      })
    | { __typename?: "NotFound" }
    | { __typename?: "NotSupported" };
};

export type ChangeLocationAwaySetpointMutationVariables = Exact<{
  input: ChangeAwaySetpointInput;
}>;

export type ChangeLocationAwaySetpointMutation = { __typename?: "Mutation" } & {
  changeLocationAwaySetpoint:
    | ({ __typename?: "ChangeLocationAwaySetpointSuccess" } & {
        location: {
          __typename?: "Location";
        } & Screen_Settings_Away_LocationFragment;
      })
    | { __typename?: "NotFound" }
    | { __typename?: "NotSupported" };
};

export type Screen_Settings_DebugMenu_DebugUserFragment = {
  __typename: "User";
} & Pick<User, "id">;

export type SettingsDebugMenuDebugUserQueryVariables = Exact<{
  [key: string]: never;
}>;

export type SettingsDebugMenuDebugUserQuery = { __typename?: "Query" } & {
  me: Maybe<
    { __typename?: "User" } & Screen_Settings_DebugMenu_DebugUserFragment
  >;
};

export type Screen_Settings_FaultLogs_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id"> & {
    faultNotification: Maybe<
      { __typename?: "BasicNotification" } & Pick<BasicNotification, "enabled">
    >;
  };

export type ScreenSettingsFaultLogsLocationQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type ScreenSettingsFaultLogsLocationQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & Screen_Settings_FaultLogs_LocationFragment
  >;
};

export type Settings_FaultLogs_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id"> & {
    faultLogs: Maybe<
      Array<
        | ({ __typename: "FaultLogLabel" } & Pick<
            FaultLogLabel,
            "date" | "label"
          >)
        | ({ __typename: "FaultLogLabelAndDescription" } & Pick<
            FaultLogLabelAndDescription,
            "date" | "label" | "description"
          >)
      >
    >;
  };

export type SettingsFaultLogsLocationQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type SettingsFaultLogsLocationQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & Settings_FaultLogs_LocationFragment
  >;
};

export type Screen_Settings_HoldLength_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id">;

export type Screen_Settings_HoldLength_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id"> & {
    defaultHoldLength: Maybe<
      | ({
          __typename?: "HoldLengthIndefinite";
        } & HoldLengthFields_HoldLengthIndefinite_Fragment)
      | ({
          __typename?: "HoldLengthNextEvent";
        } & HoldLengthFields_HoldLengthNextEvent_Fragment)
      | ({
          __typename?: "HoldLengthHours";
        } & HoldLengthFields_HoldLengthHours_Fragment)
      | ({
          __typename?: "HoldLengthDate";
        } & HoldLengthFields_HoldLengthDate_Fragment)
    >;
  };

export type SettingsHoldLengthLocationQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type SettingsHoldLengthLocationQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & Screen_Settings_HoldLength_LocationFragment
  >;
};

export type ChangeLocationHoldLengthMutationVariables = Exact<{
  input: ChangeDefaultHoldLengthInput;
}>;

export type ChangeLocationHoldLengthMutation = { __typename?: "Mutation" } & {
  changeDefaultLocationHoldLength:
    | ({ __typename: "ChangeDefaultLocationHoldLengthSuccess" } & {
        location: {
          __typename?: "Location";
        } & Screen_Settings_HoldLength_LocationFragment;
      })
    | { __typename: "NotSupported" }
    | { __typename: "NotFound" };
};

export type Screen_Settings_Names_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id" | "name">;

export type Screen_Settings_Names_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id" | "name"> & {
    controllers: Array<
      { __typename?: "Controller" } & Screen_Settings_Names_ControllerFragment
    >;
  };

export type NamesQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type NamesQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & Screen_Settings_Names_LocationFragment
  >;
};

export type ControllerNameQueryVariables = Exact<{
  controllerId: Scalars["ID"];
}>;

export type ControllerNameQuery = { __typename?: "Query" } & {
  controller: Maybe<
    { __typename?: "Controller" } & Screen_Settings_Names_ControllerFragment
  >;
};

export type RenameControllerMutationVariables = Exact<{
  input: RenameInput;
}>;

export type RenameControllerMutation = { __typename?: "Mutation" } & {
  renameController:
    | ({ __typename: "RenameControllerSuccess" } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Settings_Names_ControllerFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type RenameLocationMutationVariables = Exact<{
  input: RenameInput;
}>;

export type RenameLocationMutation = { __typename?: "Mutation" } & {
  renameLocation:
    | ({ __typename: "RenameLocationSuccess" } & {
        location: {
          __typename?: "Location";
        } & Screen_Settings_Names_LocationFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type HumidityNotificationFragment = {
  __typename: "HumidityNotification";
} & Pick<HumidityNotification, "enabled"> &
  DualRangeValueFields_HumidityNotification_Fragment;

export type TemperatureNotificationFragment = {
  __typename: "TemperatureNotification";
} & Pick<TemperatureNotification, "enabled"> &
  DualRangeValueFields_TemperatureNotification_Fragment;

export type Screen_Settings_Notifications_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id" | "name"> & {
    temperatureNotification: Maybe<
      {
        __typename?: "TemperatureNotification";
      } & TemperatureNotificationFragment
    >;
    humidityNotification: Maybe<
      { __typename?: "HumidityNotification" } & HumidityNotificationFragment
    >;
  };

export type Screen_Settings_Notifications_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id" | "name" | "temperatureUnit"> & {
    controllers: Array<
      {
        __typename?: "Controller";
      } & Screen_Settings_Notifications_ControllerFragment
    >;
    temperatureNotification: Maybe<
      {
        __typename?: "TemperatureNotification";
      } & TemperatureNotificationFragment
    >;
    humidityNotification: Maybe<
      { __typename?: "HumidityNotification" } & HumidityNotificationFragment
    >;
    faultNotification: Maybe<
      { __typename?: "BasicNotification" } & Pick<BasicNotification, "enabled">
    >;
  };

export type LocationNotificationsQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type LocationNotificationsQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & Screen_Settings_Notifications_LocationFragment
  >;
};

export type ControllerNotificationsQueryVariables = Exact<{
  controllerId: Scalars["ID"];
}>;

export type ControllerNotificationsQuery = { __typename?: "Query" } & {
  controller: Maybe<
    {
      __typename?: "Controller";
    } & Screen_Settings_Notifications_ControllerFragment
  >;
};

export type ToggleControllerTemperatureNotificationMutationVariables = Exact<{
  input: ToggleNotificationInput;
}>;

export type ToggleControllerTemperatureNotificationMutation = {
  __typename?: "Mutation";
} & {
  toggleControllerTemperatureNotification:
    | ({ __typename: "ToggleControllerTemperatureNotificationSuccess" } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Settings_Notifications_ControllerFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type AdjustControllerTemperatureNotificationThresholdMutationVariables = Exact<{
  input: AdjustNotificationThresholdInput;
}>;

export type AdjustControllerTemperatureNotificationThresholdMutation = {
  __typename?: "Mutation";
} & {
  adjustControllerTemperatureNotificationThreshold:
    | ({
        __typename: "AdjustControllerTemperatureNotificationThresholdSuccess";
      } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Settings_Notifications_ControllerFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type ToggleControllerHumidityNotificationMutationVariables = Exact<{
  input: ToggleNotificationInput;
}>;

export type ToggleControllerHumidityNotificationMutation = {
  __typename?: "Mutation";
} & {
  toggleControllerHumidityNotification:
    | ({ __typename: "ToggleControllerHumidityNotificationSuccess" } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Settings_Notifications_ControllerFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type AdjustControllerHumidityNotificationThresholdMutationVariables = Exact<{
  input: AdjustNotificationThresholdInput;
}>;

export type AdjustControllerHumidityNotificationThresholdMutation = {
  __typename?: "Mutation";
} & {
  adjustControllerHumidityNotificationThreshold:
    | ({
        __typename: "AdjustControllerHumidityNotificationThresholdSuccess";
      } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Settings_Notifications_ControllerFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type ToggleLocationFaultNotificationMutationVariables = Exact<{
  input: ToggleNotificationInput;
}>;

export type ToggleLocationFaultNotificationMutation = {
  __typename?: "Mutation";
} & {
  toggleLocationFaultNotification:
    | ({ __typename: "ToggleLocationFaultNotificationSuccess" } & {
        location: {
          __typename?: "Location";
        } & Screen_Settings_Notifications_LocationFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type ToggleLocationTemperatureNotificationMutationVariables = Exact<{
  input: ToggleNotificationInput;
}>;

export type ToggleLocationTemperatureNotificationMutation = {
  __typename?: "Mutation";
} & {
  toggleLocationTemperatureNotification:
    | ({ __typename: "ToggleLocationTemperatureNotificationSuccess" } & {
        location: {
          __typename?: "Location";
        } & Screen_Settings_Notifications_LocationFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type AdjustLocationTemperatureNotificationThresholdMutationVariables = Exact<{
  input: AdjustNotificationThresholdInput;
}>;

export type AdjustLocationTemperatureNotificationThresholdMutation = {
  __typename?: "Mutation";
} & {
  adjustLocationTemperatureNotificationThreshold:
    | ({
        __typename: "AdjustLocationTemperatureNotificationThresholdSuccess";
      } & {
        location: {
          __typename?: "Location";
        } & Screen_Settings_Notifications_LocationFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type ToggleLocationHumidityNotificationMutationVariables = Exact<{
  input: ToggleNotificationInput;
}>;

export type ToggleLocationHumidityNotificationMutation = {
  __typename?: "Mutation";
} & {
  toggleLocationHumidityNotification:
    | ({ __typename: "ToggleLocationHumidityNotificationSuccess" } & {
        location: {
          __typename?: "Location";
        } & Screen_Settings_Notifications_LocationFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type AdjustLocationHumidityNotificationThresholdMutationVariables = Exact<{
  input: AdjustNotificationThresholdInput;
}>;

export type AdjustLocationHumidityNotificationThresholdMutation = {
  __typename?: "Mutation";
} & {
  adjustLocationHumidityNotificationThreshold:
    | ({ __typename: "AdjustLocationHumidityNotificationThresholdSuccess" } & {
        location: {
          __typename?: "Location";
        } & Screen_Settings_Notifications_LocationFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type Screen_Support_ManufacturerFragment = {
  __typename?: "Manufacturer";
} & {
  support: Maybe<
    { __typename?: "Contact" } & Pick<Contact, "email" | "phone" | "website">
  >;
};

export type SupportContactQueryVariables = Exact<{ [key: string]: never }>;

export type SupportContactQuery = { __typename?: "Query" } & {
  manufacturer: {
    __typename?: "Manufacturer";
  } & Screen_Support_ManufacturerFragment;
};

export type ConnectAylaDisplayMutationVariables = Exact<{
  token: Scalars["String"];
}>;

export type ConnectAylaDisplayMutation = { __typename?: "Mutation" } & {
  connectAylaDisplay:
    | ({ __typename: "ConnectAylaDisplaySuccess" } & {
        location: { __typename?: "Location" } & Pick<Location, "id">;
      })
    | { __typename: "TokenInvalid" }
    | { __typename: "DeviceStateInvalid" }
    | { __typename: "NotSupported" };
};

export type Screen_Copy_Schedule_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id"> & {
    schedule: Maybe<{ __typename?: "Schedule" } & ScheduleFieldsFragment>;
    location: { __typename?: "Location" } & Pick<Location, "temperatureUnit">;
  };

export type CopyScheduleQueryVariables = Exact<{
  controllerId: Scalars["ID"];
}>;

export type CopyScheduleQuery = { __typename?: "Query" } & {
  controller: Maybe<
    { __typename?: "Controller" } & Screen_Copy_Schedule_ControllerFragment
  >;
};

export type MakeScheduleCopyMutationVariables = Exact<{
  input: CopyScheduleInput;
}>;

export type MakeScheduleCopyMutation = { __typename?: "Mutation" } & {
  copySchedule:
    | ({ __typename: "CopyScheduleSuccess" } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Copy_Schedule_ControllerFragment;
      })
    | { __typename: "NotFound" };
};

export type Screen_Settings_List_Temperature_Presets_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id" | "temperatureUnit"> & {
    temperaturePresets: Maybe<
      Array<
        { __typename?: "TemperaturePreset" } & TemperaturePresetsFieldsFragment
      >
    >;
  };

export type ListTemperaturePresetsQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type ListTemperaturePresetsQuery = { __typename?: "Query" } & {
  location: Maybe<
    {
      __typename?: "Location";
    } & Screen_Settings_List_Temperature_Presets_LocationFragment
  >;
};

export type TemperaturePresetQueryVariables = Exact<{
  temperaturePresetId: Scalars["ID"];
}>;

export type TemperaturePresetQuery = { __typename?: "Query" } & {
  temperaturePreset: Maybe<
    { __typename?: "TemperaturePreset" } & TemperaturePresetsFieldsFragment
  >;
};

export type Screen_Manage_Schedule_ControllerFragment = {
  __typename?: "Controller";
} & Pick<Controller, "id"> & {
    schedule: Maybe<
      { __typename?: "Schedule" } & Pick<Schedule, "minEventInterval">
    >;
    location: { __typename?: "Location" } & Pick<
      Location,
      "id" | "temperatureUnit"
    > & {
        temperaturePresets: Maybe<
          Array<
            {
              __typename?: "TemperaturePreset";
            } & TemperaturePresetsFieldsFragment
          >
        >;
      };
  };

export type NewScheduleQueryVariables = Exact<{
  controllerId: Scalars["ID"];
}>;

export type NewScheduleQuery = { __typename?: "Query" } & {
  controller: Maybe<
    { __typename?: "Controller" } & Screen_Manage_Schedule_ControllerFragment
  >;
};

export type ManageScheduleQueryVariables = Exact<{
  controllerId: Scalars["ID"];
  scheduleEventId: Scalars["ID"];
}>;

export type ManageScheduleQuery = { __typename?: "Query" } & {
  controller: Maybe<
    { __typename?: "Controller" } & Screen_Manage_Schedule_ControllerFragment
  >;
  scheduleEvent: Maybe<
    { __typename?: "ScheduleEvent" } & ScheduleEventFieldsFragment
  >;
};

export type ChangeScheduleEventMutationVariables = Exact<{
  timeInput: ChangeScheduleEventTimeInput;
  temperaturePresetInput: ChangeScheduleEventTemperaturePresetInput;
}>;

export type ChangeScheduleEventMutation = { __typename?: "Mutation" } & {
  changeScheduleEventTime:
    | ({ __typename: "ChangeScheduleEventTimeSuccess" } & {
        scheduleEvent: {
          __typename?: "ScheduleEvent";
        } & ScheduleEventFieldsFragment;
      })
    | { __typename: "NotFound" };
  changeScheduleEventTemperaturePreset:
    | ({ __typename: "ChangeScheduleEventTemperaturePresetSuccess" } & {
        scheduleEvent: {
          __typename?: "ScheduleEvent";
        } & ScheduleEventFieldsFragment;
      })
    | { __typename: "NotFound" };
};

export type AddScheduleEventMutationVariables = Exact<{
  input: AddScheduleEventInput;
}>;

export type AddScheduleEventMutation = { __typename?: "Mutation" } & {
  addScheduleEvent:
    | ({ __typename: "AddScheduleEventSuccess" } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Schedules_ControllerFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" }
    | { __typename: "ScheduleFull" };
};

export type RemoveScheduleEventMutationVariables = Exact<{
  input: RemoveScheduleEventInput;
}>;

export type RemoveScheduleEventMutation = { __typename?: "Mutation" } & {
  removeScheduleEvent:
    | ({ __typename: "RemoveScheduleEventSuccess" } & {
        controller: {
          __typename?: "Controller";
        } & Screen_Schedules_ControllerFragment;
      })
    | { __typename: "NotFound" };
};

export type Screen_Manage_Temperature_Preset_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id" | "temperatureUnit"> & {
    temperaturePresets: Maybe<
      Array<
        { __typename?: "TemperaturePreset" } & TemperaturePresetsFieldsFragment
      >
    >;
  };

export type NewTemperaturePresetQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type NewTemperaturePresetQuery = { __typename?: "Query" } & {
  location: Maybe<
    {
      __typename?: "Location";
    } & Screen_Manage_Temperature_Preset_LocationFragment
  >;
};

export type ManageTemperaturePresetQueryVariables = Exact<{
  locationId: Scalars["ID"];
  temperaturePresetId: Scalars["ID"];
}>;

export type ManageTemperaturePresetQuery = { __typename?: "Query" } & {
  location: Maybe<
    {
      __typename?: "Location";
    } & Screen_Manage_Temperature_Preset_LocationFragment
  >;
  temperaturePreset: Maybe<
    { __typename?: "TemperaturePreset" } & TemperaturePresetsFieldsFragment
  >;
};

export type AddTemperaturePresetMutationVariables = Exact<{
  input: AddTemperaturePresetInput;
}>;

export type AddTemperaturePresetMutation = { __typename?: "Mutation" } & {
  addTemperaturePreset:
    | ({ __typename: "AddTemperaturePresetSuccess" } & {
        temperaturePreset: {
          __typename?: "TemperaturePreset";
        } & TemperaturePresetsFieldsFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type ChangeTemperaturePresetMutationVariables = Exact<{
  setpointInput: ChangeTemperaturePresetSetpointInput;
  nameInput: ChangeTemperaturePresetNameInput;
}>;

export type ChangeTemperaturePresetMutation = { __typename?: "Mutation" } & {
  changeTemperaturePresetSetpoint:
    | ({ __typename: "ChangeTemperaturePresetSetpointSuccess" } & {
        temperaturePreset: {
          __typename?: "TemperaturePreset";
        } & TemperaturePresetsFieldsFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
  changeTemperaturePresetName:
    | ({ __typename: "ChangeTemperaturePresetNameSuccess" } & {
        temperaturePreset: {
          __typename?: "TemperaturePreset";
        } & TemperaturePresetsFieldsFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type RemoveTemperaturePresetMutationVariables = Exact<{
  input: RemoveTemperaturePresetInput;
}>;

export type RemoveTemperaturePresetMutation = { __typename?: "Mutation" } & {
  removeTemperaturePreset:
    | ({ __typename: "RemoveTemperaturePresetSuccess" } & Pick<
        RemoveTemperaturePresetSuccess,
        "_"
      >)
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type Screen_Schedules_ControllerFragment = {
  __typename: "Controller";
} & Pick<Controller, "id"> & {
    schedule: Maybe<{ __typename?: "Schedule" } & ScheduleFieldsFragment>;
    location: { __typename?: "Location" } & Pick<Location, "temperatureUnit">;
  };

export type SchedulesQueryVariables = Exact<{
  controllerId: Scalars["ID"];
}>;

export type SchedulesQuery = { __typename?: "Query" } & {
  controller: Maybe<
    { __typename?: "Controller" } & Screen_Schedules_ControllerFragment
  >;
};

export type ScheduleEventQueryVariables = Exact<{
  scheduleEventId: Scalars["ID"];
}>;

export type ScheduleEventQuery = { __typename?: "Query" } & {
  scheduleEvent: Maybe<
    { __typename?: "ScheduleEvent" } & ScheduleEventFieldsFragment
  >;
};

export type Screen_Select_Fan_ModeFragment = { __typename: "Location" } & Pick<
  Location,
  "id"
>;

export type SelectFanModeQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type SelectFanModeQuery = { __typename?: "Query" } & {
  location: Maybe<{ __typename?: "Location" } & Screen_Select_Fan_ModeFragment>;
};

export type ChangeTemperaturePresetFanModeMutationVariables = Exact<{
  input: ChangeTemperaturePresetFanModeInput;
}>;

export type ChangeTemperaturePresetFanModeMutation = {
  __typename?: "Mutation";
} & {
  changeTemperaturePresetFanMode:
    | ({ __typename: "ChangeTemperaturePresetFanModeSuccess" } & {
        temperaturePreset: {
          __typename?: "TemperaturePreset";
        } & TemperaturePresetsFieldsFragment;
      })
    | { __typename: "NotFound" }
    | { __typename: "NotSupported" };
};

export type SendTokenMutationVariables = Exact<{
  input: SendTokenInput;
}>;

export type SendTokenMutation = { __typename?: "Mutation" } & {
  sendToken:
    | { __typename: "SendTokenSuccess" }
    | { __typename: "EmailInvalid" };
};

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;

export type SignInMutation = { __typename?: "Mutation" } & {
  signIn:
    | ({ __typename: "SignInSuccess" } & Pick<
        SignInSuccess,
        "accessToken" | "refreshToken" | "ttl"
      > & { user: { __typename?: "User" } & Pick<User, "id"> })
    | { __typename: "TokenInvalid" }
    | { __typename: "EmailInvalid" };
};

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;

export type SignUpMutation = { __typename?: "Mutation" } & {
  signUp:
    | { __typename: "SignUpSuccess" }
    | { __typename: "EmailInvalid" }
    | { __typename: "EmailTaken" };
};

export type Background_AwayActiveStatus_LocationFragment = {
  __typename: "Location";
} & Pick<Location, "id" | "awayActive">;

export type BackgroundAwayActiveStatusQueryVariables = Exact<{
  locationId: Scalars["ID"];
}>;

export type BackgroundAwayActiveStatusQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & Background_AwayActiveStatus_LocationFragment
  >;
};

export const Context_Controllers_ControllerFragmentDoc = gql`
  fragment Context_Controllers_Controller on Controller {
    __typename
    id
    location {
      __typename
      id
      temperatureUnit
    }
  }
`;
export const Component_Controlled_Dial_LocationFragmentDoc = gql`
  fragment Component_Controlled_Dial_Location on Location {
    __typename
    id
    away {
      active
    }
    connectionStatus
    temperatureUnit
  }
`;
export const Component_SelectControllerModal_ControllerFragmentDoc = gql`
  fragment Component_SelectControllerModal_Controller on Controller {
    __typename
    id
    name
    mode {
      effectiveMode
    }
    temperatureAmbient
  }
`;
export const Component_SelectControllerModal_LocationFragmentDoc = gql`
  fragment Component_SelectControllerModal_Location on Location {
    __typename
    id
    name
    zoning
    connectionStatus
    controllers {
      ...Component_SelectControllerModal_Controller
    }
    temperatureUnit
  }
  ${Component_SelectControllerModal_ControllerFragmentDoc}
`;
export const Component_SelectModeModal_LocationFragmentDoc = gql`
  fragment Component_SelectModeModal_Location on Location {
    __typename
    id
    name
    away {
      active
    }
  }
`;
export const Screen_Home_LocationFragmentDoc = gql`
  fragment Screen_Home_Location on Location {
    __typename
    id
    name
    temperatureOutdoor
    temperatureUnit
    away {
      active
    }
    faultActive
    ...Component_Controlled_Dial_Location
    ...Component_SelectControllerModal_Location
    ...Component_SelectModeModal_Location
  }
  ${Component_Controlled_Dial_LocationFragmentDoc}
  ${Component_SelectControllerModal_LocationFragmentDoc}
  ${Component_SelectModeModal_LocationFragmentDoc}
`;
export const RangeValueFieldsFragmentDoc = gql`
  fragment RangeValueFields on RangeValue {
    min
    max
    value
    step
  }
`;
export const DualRangeValueFieldsFragmentDoc = gql`
  fragment DualRangeValueFields on DualRangeValue {
    lower {
      ...RangeValueFields
    }
    upper {
      ...RangeValueFields
    }
    minInterval
  }
  ${RangeValueFieldsFragmentDoc}
`;
export const SetpointFieldsFragmentDoc = gql`
  fragment SetpointFields on Setpoint {
    ... on SingleSetpoint {
      ...RangeValueFields
    }
    ... on DualSetpoint {
      ...DualRangeValueFields
    }
  }
  ${RangeValueFieldsFragmentDoc}
  ${DualRangeValueFieldsFragmentDoc}
`;
export const Component_Controlled_Dial_ControllerFragmentDoc = gql`
  fragment Component_Controlled_Dial_Controller on Controller {
    __typename
    id
    call
    activeHold {
      __typename
    }
    away {
      active
    }
    mode {
      effectiveMode
    }
    location {
      ...Component_Controlled_Dial_Location
    }
    setpoint {
      ...SetpointFields
    }
    setpointRange {
      min
      max
    }
    temperatureAmbient
  }
  ${Component_Controlled_Dial_LocationFragmentDoc}
  ${SetpointFieldsFragmentDoc}
`;
export const Component_SelectModeModal_ModeFragmentDoc = gql`
  fragment Component_SelectModeModal_Mode on Mode {
    effectiveMode
    name
    placement
    transitionTo {
      name
    }
  }
`;
export const Component_SelectModeModal_ControllerFragmentDoc = gql`
  fragment Component_SelectModeModal_Controller on Controller {
    __typename
    id
    name
    mode {
      ...Component_SelectModeModal_Mode
    }
    modes {
      ...Component_SelectModeModal_Mode
    }
    setpoint {
      ...SetpointFields
    }
  }
  ${Component_SelectModeModal_ModeFragmentDoc}
  ${SetpointFieldsFragmentDoc}
`;
export const Screen_Home_ControllerFragmentDoc = gql`
  fragment Screen_Home_Controller on Controller {
    __typename
    id
    activeHold {
      __typename
    }
    away {
      active
    }
    call
    fan {
      __typename
      ... on SpeedNameFan {
        activeSpeedName
      }
      ... on PercentageFan {
        activeSpeedPercent
      }
    }
    humidityAmbient
    location {
      ...Screen_Home_Location
    }
    mode {
      name
      effectiveMode
    }
    name
    ...Component_Controlled_Dial_Controller
    ...Component_SelectModeModal_Controller
    ...Component_SelectControllerModal_Controller
  }
  ${Screen_Home_LocationFragmentDoc}
  ${Component_Controlled_Dial_ControllerFragmentDoc}
  ${Component_SelectModeModal_ControllerFragmentDoc}
  ${Component_SelectControllerModal_ControllerFragmentDoc}
`;
export const BootstrapControllerFieldsFragmentDoc = gql`
  fragment BootstrapControllerFields on Controller {
    __typename
    id
    ...Context_Controllers_Controller
    ...Screen_Home_Controller
  }
  ${Context_Controllers_ControllerFragmentDoc}
  ${Screen_Home_ControllerFragmentDoc}
`;
export const AwayFieldsFragmentDoc = gql`
  fragment AwayFields on Away {
    active
    setpoint {
      ...SetpointFields
    }
  }
  ${SetpointFieldsFragmentDoc}
`;
export const Screen_Settings_Away_ControllerFragmentDoc = gql`
  fragment Screen_Settings_Away_Controller on Controller {
    __typename
    id
    name
    away {
      ...AwayFields
    }
    location {
      temperatureUnit
    }
  }
  ${AwayFieldsFragmentDoc}
`;
export const Screen_Settings_HoldLength_ControllerFragmentDoc = gql`
  fragment Screen_Settings_HoldLength_Controller on Controller {
    __typename
    id
  }
`;
export const TemperatureNotificationFragmentDoc = gql`
  fragment TemperatureNotification on TemperatureNotification {
    __typename
    enabled
    ...DualRangeValueFields
  }
  ${DualRangeValueFieldsFragmentDoc}
`;
export const HumidityNotificationFragmentDoc = gql`
  fragment HumidityNotification on HumidityNotification {
    __typename
    enabled
    ...DualRangeValueFields
  }
  ${DualRangeValueFieldsFragmentDoc}
`;
export const Screen_Settings_Notifications_ControllerFragmentDoc = gql`
  fragment Screen_Settings_Notifications_Controller on Controller {
    __typename
    id
    name
    temperatureNotification {
      ...TemperatureNotification
    }
    humidityNotification {
      ...HumidityNotification
    }
  }
  ${TemperatureNotificationFragmentDoc}
  ${HumidityNotificationFragmentDoc}
`;
export const ScheduleTimeFieldsFragmentDoc = gql`
  fragment ScheduleTimeFields on ScheduleTime {
    day
    hour
    minute
  }
`;
export const TemperaturePresetsFieldsFragmentDoc = gql`
  fragment TemperaturePresetsFields on TemperaturePreset {
    id
    name
    slot
    fanMode
    removable
    setpoint {
      ...SetpointFields
    }
  }
  ${SetpointFieldsFragmentDoc}
`;
export const BaseScheduleEventFieldsFragmentDoc = gql`
  fragment BaseScheduleEventFields on ScheduleEvent {
    __typename
    id
    day
    removable
    start {
      ...ScheduleTimeFields
    }
    end {
      ...ScheduleTimeFields
    }
    temperaturePreset {
      ...TemperaturePresetsFields
    }
  }
  ${ScheduleTimeFieldsFragmentDoc}
  ${TemperaturePresetsFieldsFragmentDoc}
`;
export const ScheduleEventFieldsFragmentDoc = gql`
  fragment ScheduleEventFields on ScheduleEvent {
    ...BaseScheduleEventFields
    nextEvent {
      ...BaseScheduleEventFields
    }
    prevEvent {
      ...BaseScheduleEventFields
    }
    temperaturePreset {
      ...TemperaturePresetsFields
    }
  }
  ${BaseScheduleEventFieldsFragmentDoc}
  ${TemperaturePresetsFieldsFragmentDoc}
`;
export const ScheduleDayFieldsFragmentDoc = gql`
  fragment ScheduleDayFields on ScheduleDay {
    day
    events {
      ...ScheduleEventFields
    }
    full
  }
  ${ScheduleEventFieldsFragmentDoc}
`;
export const ScheduleFieldsFragmentDoc = gql`
  fragment ScheduleFields on Schedule {
    days {
      ...ScheduleDayFields
    }
    monday {
      ...ScheduleDayFields
    }
    tuesday {
      ...ScheduleDayFields
    }
    wednesday {
      ...ScheduleDayFields
    }
    thursday {
      ...ScheduleDayFields
    }
    friday {
      ...ScheduleDayFields
    }
    saturday {
      ...ScheduleDayFields
    }
    sunday {
      ...ScheduleDayFields
    }
    maxEvents
    minEvents
    minEventInterval
  }
  ${ScheduleDayFieldsFragmentDoc}
`;
export const Screen_Schedules_ControllerFragmentDoc = gql`
  fragment Screen_Schedules_Controller on Controller {
    __typename
    id
    schedule {
      ...ScheduleFields
    }
    location {
      temperatureUnit
    }
  }
  ${ScheduleFieldsFragmentDoc}
`;
export const Screen_Manage_Schedule_ControllerFragmentDoc = gql`
  fragment Screen_Manage_Schedule_Controller on Controller {
    id
    schedule {
      minEventInterval
    }
    location {
      id
      temperatureUnit
      temperaturePresets {
        ...TemperaturePresetsFields
      }
    }
  }
  ${TemperaturePresetsFieldsFragmentDoc}
`;
export const Screen_Copy_Schedule_ControllerFragmentDoc = gql`
  fragment Screen_Copy_Schedule_Controller on Controller {
    __typename
    id
    schedule {
      ...ScheduleFields
    }
    location {
      temperatureUnit
    }
  }
  ${ScheduleFieldsFragmentDoc}
`;
export const ControllerFieldsFragmentDoc = gql`
  fragment ControllerFields on Controller {
    __typename
    id
    ...Context_Controllers_Controller
    ...Screen_Home_Controller
    ...Screen_Settings_Away_Controller
    ...Screen_Settings_HoldLength_Controller
    ...Screen_Settings_Notifications_Controller
    ...Screen_Schedules_Controller
    ...Screen_Manage_Schedule_Controller
    ...Screen_Copy_Schedule_Controller
  }
  ${Context_Controllers_ControllerFragmentDoc}
  ${Screen_Home_ControllerFragmentDoc}
  ${Screen_Settings_Away_ControllerFragmentDoc}
  ${Screen_Settings_HoldLength_ControllerFragmentDoc}
  ${Screen_Settings_Notifications_ControllerFragmentDoc}
  ${Screen_Schedules_ControllerFragmentDoc}
  ${Screen_Manage_Schedule_ControllerFragmentDoc}
  ${Screen_Copy_Schedule_ControllerFragmentDoc}
`;
export const FeatureMapFieldsFragmentDoc = gql`
  fragment FeatureMapFields on FeatureMap {
    accountSharing
    appActiveTracking
    away
    changeDefaultHoldLengthLocation
    changeTemperatureUnit
    connect
    faultLogsLocation
    notifications
    rename
    schedule
    signIn
  }
`;
export const BootstrapLocationFieldsFragmentDoc = gql`
  fragment BootstrapLocationFields on Location {
    __typename
    id
  }
`;
export const HoldLengthFieldsFragmentDoc = gql`
  fragment HoldLengthFields on HoldLength {
    __typename
    ... on HoldLengthIndefinite {
      _
    }
    ... on HoldLengthNextEvent {
      _
    }
    ... on HoldLengthHours {
      hours
    }
    ... on HoldLengthDate {
      date
    }
  }
`;
export const Screen_Settings_LocationFragmentDoc = gql`
  fragment Screen_Settings_Location on Location {
    __typename
    id
    name
    away {
      active
      setpoint {
        ...SetpointFields
      }
    }
    controllers {
      __typename
      id
      name
      temperatureNotification {
        ...TemperatureNotification
      }
      humidityNotification {
        ...HumidityNotification
      }
    }
    temperatureNotification {
      ...TemperatureNotification
    }
    humidityNotification {
      ...HumidityNotification
    }
    defaultHoldLength {
      ...HoldLengthFields
    }
    faultActive
    temperatureUnit
  }
  ${SetpointFieldsFragmentDoc}
  ${TemperatureNotificationFragmentDoc}
  ${HumidityNotificationFragmentDoc}
  ${HoldLengthFieldsFragmentDoc}
`;
export const Screen_Settings_Away_LocationFragmentDoc = gql`
  fragment Screen_Settings_Away_Location on Location {
    __typename
    id
    name
    away {
      ...AwayFields
    }
    lat
    lng
    controllers {
      ...Screen_Settings_Away_Controller
    }
    temperatureUnit
  }
  ${AwayFieldsFragmentDoc}
  ${Screen_Settings_Away_ControllerFragmentDoc}
`;
export const Screen_Settings_HoldLength_LocationFragmentDoc = gql`
  fragment Screen_Settings_HoldLength_Location on Location {
    __typename
    id
    defaultHoldLength {
      ...HoldLengthFields
    }
  }
  ${HoldLengthFieldsFragmentDoc}
`;
export const Background_AwayActiveStatus_LocationFragmentDoc = gql`
  fragment Background_AwayActiveStatus_Location on Location {
    __typename
    id
    awayActive
  }
`;
export const Screen_Settings_Notifications_LocationFragmentDoc = gql`
  fragment Screen_Settings_Notifications_Location on Location {
    __typename
    id
    name
    controllers {
      ...Screen_Settings_Notifications_Controller
    }
    temperatureNotification {
      ...TemperatureNotification
    }
    humidityNotification {
      ...HumidityNotification
    }
    faultNotification {
      enabled
    }
    temperatureUnit
  }
  ${Screen_Settings_Notifications_ControllerFragmentDoc}
  ${TemperatureNotificationFragmentDoc}
  ${HumidityNotificationFragmentDoc}
`;
export const Screen_Select_Fan_ModeFragmentDoc = gql`
  fragment Screen_Select_Fan_Mode on Location {
    __typename
    id
  }
`;
export const Screen_Settings_List_Temperature_Presets_LocationFragmentDoc = gql`
  fragment Screen_Settings_List_Temperature_Presets_Location on Location {
    __typename
    id
    temperaturePresets {
      ...TemperaturePresetsFields
    }
    temperatureUnit
  }
  ${TemperaturePresetsFieldsFragmentDoc}
`;
export const Screen_Manage_Temperature_Preset_LocationFragmentDoc = gql`
  fragment Screen_Manage_Temperature_Preset_Location on Location {
    __typename
    id
    temperaturePresets {
      ...TemperaturePresetsFields
    }
    temperatureUnit
  }
  ${TemperaturePresetsFieldsFragmentDoc}
`;
export const LocationFieldsFragmentDoc = gql`
  fragment LocationFields on Location {
    __typename
    id
    temperatureUnit
    ...Screen_Home_Location
    ...Screen_Settings_Location
    ...Screen_Settings_Away_Location
    ...Screen_Settings_HoldLength_Location
    ...Background_AwayActiveStatus_Location
    ...Screen_Settings_Notifications_Location
    ...Screen_Select_Fan_Mode
    ...Screen_Settings_List_Temperature_Presets_Location
    ...Screen_Manage_Temperature_Preset_Location
  }
  ${Screen_Home_LocationFragmentDoc}
  ${Screen_Settings_LocationFragmentDoc}
  ${Screen_Settings_Away_LocationFragmentDoc}
  ${Screen_Settings_HoldLength_LocationFragmentDoc}
  ${Background_AwayActiveStatus_LocationFragmentDoc}
  ${Screen_Settings_Notifications_LocationFragmentDoc}
  ${Screen_Select_Fan_ModeFragmentDoc}
  ${Screen_Settings_List_Temperature_Presets_LocationFragmentDoc}
  ${Screen_Manage_Temperature_Preset_LocationFragmentDoc}
`;
export const Screen_Settings_ManufacturerFragmentDoc = gql`
  fragment Screen_Settings_Manufacturer on Manufacturer {
    support {
      name
    }
  }
`;
export const Screen_Support_ManufacturerFragmentDoc = gql`
  fragment Screen_Support_Manufacturer on Manufacturer {
    support {
      email
      phone
      website
    }
  }
`;
export const ManufacturerFieldsFragmentDoc = gql`
  fragment ManufacturerFields on Manufacturer {
    __typename
    ...Screen_Settings_Manufacturer
    ...Screen_Support_Manufacturer
  }
  ${Screen_Settings_ManufacturerFragmentDoc}
  ${Screen_Support_ManufacturerFragmentDoc}
`;
export const UserBootstrapFieldsFragmentDoc = gql`
  fragment UserBootstrapFields on User {
    __typename
    id
  }
`;
export const Screen_ManageAccount_UserFragmentDoc = gql`
  fragment Screen_ManageAccount_User on User {
    __typename
    id
    email
  }
`;
export const Screen_Settings_UserFragmentDoc = gql`
  fragment Screen_Settings_User on User {
    __typename
    id
    email
  }
`;
export const UserFieldsFragmentDoc = gql`
  fragment UserFields on User {
    __typename
    id
    ...Screen_ManageAccount_User
    ...Screen_Settings_User
  }
  ${Screen_ManageAccount_UserFragmentDoc}
  ${Screen_Settings_UserFragmentDoc}
`;
export const Component_SurveyChatModal_UserFragmentDoc = gql`
  fragment Component_SurveyChatModal_User on User {
    id
    email
  }
`;
export const Screen_Home_UserFragmentDoc = gql`
  fragment Screen_Home_User on User {
    __typename
    ...Component_SurveyChatModal_User
  }
  ${Component_SurveyChatModal_UserFragmentDoc}
`;
export const Screen_Settings_DebugMenu_DebugUserFragmentDoc = gql`
  fragment Screen_Settings_DebugMenu_DebugUser on User {
    __typename
    id
  }
`;
export const Screen_Settings_FaultLogs_LocationFragmentDoc = gql`
  fragment Screen_Settings_FaultLogs_Location on Location {
    __typename
    id
    faultNotification {
      enabled
    }
  }
`;
export const Settings_FaultLogs_LocationFragmentDoc = gql`
  fragment Settings_FaultLogs_Location on Location {
    __typename
    id
    faultLogs {
      __typename
      ... on FaultLogLabel {
        date
        label
      }
      ... on FaultLogLabelAndDescription {
        date
        label
        description
      }
    }
  }
`;
export const Screen_Settings_Names_ControllerFragmentDoc = gql`
  fragment Screen_Settings_Names_Controller on Controller {
    __typename
    id
    name
  }
`;
export const Screen_Settings_Names_LocationFragmentDoc = gql`
  fragment Screen_Settings_Names_Location on Location {
    __typename
    id
    name
    controllers {
      ...Screen_Settings_Names_Controller
    }
  }
  ${Screen_Settings_Names_ControllerFragmentDoc}
`;
export const SetAppActiveDocument = gql`
  mutation SetAppActive(
    $appState: AppState!
    $controllerId: ID!
    $locationId: ID!
  ) {
    setAppActive(
      input: {
        appState: $appState
        controllerId: $controllerId
        locationId: $locationId
      }
    ) {
      __typename
    }
  }
`;
export type SetAppActiveMutationFn = ApolloReactCommon.MutationFunction<
  SetAppActiveMutation,
  SetAppActiveMutationVariables
>;

/**
 * __useSetAppActiveMutation__
 *
 * To run a mutation, you first call `useSetAppActiveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAppActiveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAppActiveMutation, { data, loading, error }] = useSetAppActiveMutation({
 *   variables: {
 *      appState: // value for 'appState'
 *      controllerId: // value for 'controllerId'
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useSetAppActiveMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetAppActiveMutation,
    SetAppActiveMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SetAppActiveMutation,
    SetAppActiveMutationVariables
  >(SetAppActiveDocument, baseOptions);
}
export type SetAppActiveMutationHookResult = ReturnType<
  typeof useSetAppActiveMutation
>;
export type SetAppActiveMutationResult = ApolloReactCommon.MutationResult<SetAppActiveMutation>;
export const SelectControllerDocument = gql`
  query SelectController {
    locations {
      ...Component_SelectControllerModal_Location
    }
  }
  ${Component_SelectControllerModal_LocationFragmentDoc}
`;

/**
 * __useSelectControllerQuery__
 *
 * To run a query within a React component, call `useSelectControllerQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelectControllerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelectControllerQuery({
 *   variables: {
 *   },
 * });
 */
export function useSelectControllerQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SelectControllerQuery,
    SelectControllerQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SelectControllerQuery,
    SelectControllerQueryVariables
  >(SelectControllerDocument, baseOptions);
}
export function useSelectControllerLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SelectControllerQuery,
    SelectControllerQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SelectControllerQuery,
    SelectControllerQueryVariables
  >(SelectControllerDocument, baseOptions);
}
export type SelectControllerQueryHookResult = ReturnType<
  typeof useSelectControllerQuery
>;
export type SelectControllerLazyQueryHookResult = ReturnType<
  typeof useSelectControllerLazyQuery
>;
export type SelectControllerQueryResult = ApolloReactCommon.QueryResult<
  SelectControllerQuery,
  SelectControllerQueryVariables
>;
export const SelectModeDocument = gql`
  query SelectMode($id: ID!) {
    controller(id: $id) {
      ...Component_SelectModeModal_Controller
      location {
        ...Component_SelectModeModal_Location
      }
    }
  }
  ${Component_SelectModeModal_ControllerFragmentDoc}
  ${Component_SelectModeModal_LocationFragmentDoc}
`;

/**
 * __useSelectModeQuery__
 *
 * To run a query within a React component, call `useSelectModeQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelectModeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelectModeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSelectModeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SelectModeQuery,
    SelectModeQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<SelectModeQuery, SelectModeQueryVariables>(
    SelectModeDocument,
    baseOptions
  );
}
export function useSelectModeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SelectModeQuery,
    SelectModeQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SelectModeQuery,
    SelectModeQueryVariables
  >(SelectModeDocument, baseOptions);
}
export type SelectModeQueryHookResult = ReturnType<typeof useSelectModeQuery>;
export type SelectModeLazyQueryHookResult = ReturnType<
  typeof useSelectModeLazyQuery
>;
export type SelectModeQueryResult = ApolloReactCommon.QueryResult<
  SelectModeQuery,
  SelectModeQueryVariables
>;
export const ChangeModeDocument = gql`
  mutation ChangeMode($id: ID!, $mode: String!) {
    changeMode(input: { id: $id, mode: $mode }) {
      ... on ChangeModeSuccess {
        controller {
          ...Component_SelectModeModal_Controller
        }
      }
    }
  }
  ${Component_SelectModeModal_ControllerFragmentDoc}
`;
export type ChangeModeMutationFn = ApolloReactCommon.MutationFunction<
  ChangeModeMutation,
  ChangeModeMutationVariables
>;

/**
 * __useChangeModeMutation__
 *
 * To run a mutation, you first call `useChangeModeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeModeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeModeMutation, { data, loading, error }] = useChangeModeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      mode: // value for 'mode'
 *   },
 * });
 */
export function useChangeModeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeModeMutation,
    ChangeModeMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ChangeModeMutation,
    ChangeModeMutationVariables
  >(ChangeModeDocument, baseOptions);
}
export type ChangeModeMutationHookResult = ReturnType<
  typeof useChangeModeMutation
>;
export type ChangeModeMutationResult = ApolloReactCommon.MutationResult<ChangeModeMutation>;
export const ToggleLocationAwayDocument = gql`
  mutation ToggleLocationAway($input: ToggleAwayInput!) {
    toggleLocationAway(input: $input) {
      ... on ToggleLocationAwaySuccess {
        location {
          ...Component_SelectModeModal_Location
          controllers {
            ...Component_SelectModeModal_Controller
          }
        }
      }
    }
  }
  ${Component_SelectModeModal_LocationFragmentDoc}
  ${Component_SelectModeModal_ControllerFragmentDoc}
`;
export type ToggleLocationAwayMutationFn = ApolloReactCommon.MutationFunction<
  ToggleLocationAwayMutation,
  ToggleLocationAwayMutationVariables
>;

/**
 * __useToggleLocationAwayMutation__
 *
 * To run a mutation, you first call `useToggleLocationAwayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLocationAwayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLocationAwayMutation, { data, loading, error }] = useToggleLocationAwayMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleLocationAwayMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ToggleLocationAwayMutation,
    ToggleLocationAwayMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ToggleLocationAwayMutation,
    ToggleLocationAwayMutationVariables
  >(ToggleLocationAwayDocument, baseOptions);
}
export type ToggleLocationAwayMutationHookResult = ReturnType<
  typeof useToggleLocationAwayMutation
>;
export type ToggleLocationAwayMutationResult = ApolloReactCommon.MutationResult<ToggleLocationAwayMutation>;
export const SurveyChatModalDocument = gql`
  query SurveyChatModal {
    me {
      ...Component_SurveyChatModal_User
    }
  }
  ${Component_SurveyChatModal_UserFragmentDoc}
`;

/**
 * __useSurveyChatModalQuery__
 *
 * To run a query within a React component, call `useSurveyChatModalQuery` and pass it any options that fit your needs.
 * When your component renders, `useSurveyChatModalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSurveyChatModalQuery({
 *   variables: {
 *   },
 * });
 */
export function useSurveyChatModalQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SurveyChatModalQuery,
    SurveyChatModalQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SurveyChatModalQuery,
    SurveyChatModalQueryVariables
  >(SurveyChatModalDocument, baseOptions);
}
export function useSurveyChatModalLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SurveyChatModalQuery,
    SurveyChatModalQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SurveyChatModalQuery,
    SurveyChatModalQueryVariables
  >(SurveyChatModalDocument, baseOptions);
}
export type SurveyChatModalQueryHookResult = ReturnType<
  typeof useSurveyChatModalQuery
>;
export type SurveyChatModalLazyQueryHookResult = ReturnType<
  typeof useSurveyChatModalLazyQuery
>;
export type SurveyChatModalQueryResult = ApolloReactCommon.QueryResult<
  SurveyChatModalQuery,
  SurveyChatModalQueryVariables
>;
export const ControlledDialDocument = gql`
  query ControlledDial($controllerId: ID!) {
    controller(id: $controllerId) {
      ...Component_Controlled_Dial_Controller
    }
  }
  ${Component_Controlled_Dial_ControllerFragmentDoc}
`;

/**
 * __useControlledDialQuery__
 *
 * To run a query within a React component, call `useControlledDialQuery` and pass it any options that fit your needs.
 * When your component renders, `useControlledDialQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useControlledDialQuery({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *   },
 * });
 */
export function useControlledDialQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ControlledDialQuery,
    ControlledDialQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ControlledDialQuery,
    ControlledDialQueryVariables
  >(ControlledDialDocument, baseOptions);
}
export function useControlledDialLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ControlledDialQuery,
    ControlledDialQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ControlledDialQuery,
    ControlledDialQueryVariables
  >(ControlledDialDocument, baseOptions);
}
export type ControlledDialQueryHookResult = ReturnType<
  typeof useControlledDialQuery
>;
export type ControlledDialLazyQueryHookResult = ReturnType<
  typeof useControlledDialLazyQuery
>;
export type ControlledDialQueryResult = ApolloReactCommon.QueryResult<
  ControlledDialQuery,
  ControlledDialQueryVariables
>;
export const ChangeSetpointDocument = gql`
  mutation ChangeSetpoint(
    $id: ID!
    $single: SingleSetpointInput
    $dual: DualSetpointInput
  ) {
    changeSetpoint(input: { id: $id, single: $single, dual: $dual }) {
      __typename
      ... on ChangeSetpointSuccess {
        controller {
          setpoint {
            ...SetpointFields
          }
        }
      }
    }
  }
  ${SetpointFieldsFragmentDoc}
`;
export type ChangeSetpointMutationFn = ApolloReactCommon.MutationFunction<
  ChangeSetpointMutation,
  ChangeSetpointMutationVariables
>;

/**
 * __useChangeSetpointMutation__
 *
 * To run a mutation, you first call `useChangeSetpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeSetpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeSetpointMutation, { data, loading, error }] = useChangeSetpointMutation({
 *   variables: {
 *      id: // value for 'id'
 *      single: // value for 'single'
 *      dual: // value for 'dual'
 *   },
 * });
 */
export function useChangeSetpointMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeSetpointMutation,
    ChangeSetpointMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ChangeSetpointMutation,
    ChangeSetpointMutationVariables
  >(ChangeSetpointDocument, baseOptions);
}
export type ChangeSetpointMutationHookResult = ReturnType<
  typeof useChangeSetpointMutation
>;
export type ChangeSetpointMutationResult = ApolloReactCommon.MutationResult<ChangeSetpointMutation>;
export const RemoveAccountDocument = gql`
  mutation RemoveAccount {
    removeAccount(input: { token: "" }) {
      __typename
    }
  }
`;
export type RemoveAccountMutationFn = ApolloReactCommon.MutationFunction<
  RemoveAccountMutation,
  RemoveAccountMutationVariables
>;

/**
 * __useRemoveAccountMutation__
 *
 * To run a mutation, you first call `useRemoveAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAccountMutation, { data, loading, error }] = useRemoveAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveAccountMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemoveAccountMutation,
    RemoveAccountMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RemoveAccountMutation,
    RemoveAccountMutationVariables
  >(RemoveAccountDocument, baseOptions);
}
export type RemoveAccountMutationHookResult = ReturnType<
  typeof useRemoveAccountMutation
>;
export type RemoveAccountMutationResult = ApolloReactCommon.MutationResult<RemoveAccountMutation>;
export const RemoveLocationDocument = gql`
  mutation RemoveLocation($locationId: ID!) {
    removeLocation(input: { id: $locationId }) {
      __typename
    }
  }
`;
export type RemoveLocationMutationFn = ApolloReactCommon.MutationFunction<
  RemoveLocationMutation,
  RemoveLocationMutationVariables
>;

/**
 * __useRemoveLocationMutation__
 *
 * To run a mutation, you first call `useRemoveLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLocationMutation, { data, loading, error }] = useRemoveLocationMutation({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useRemoveLocationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemoveLocationMutation,
    RemoveLocationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RemoveLocationMutation,
    RemoveLocationMutationVariables
  >(RemoveLocationDocument, baseOptions);
}
export type RemoveLocationMutationHookResult = ReturnType<
  typeof useRemoveLocationMutation
>;
export type RemoveLocationMutationResult = ApolloReactCommon.MutationResult<RemoveLocationMutation>;
export const ControllersContextDocument = gql`
  query ControllersContext {
    controllers {
      ...Context_Controllers_Controller
    }
  }
  ${Context_Controllers_ControllerFragmentDoc}
`;

/**
 * __useControllersContextQuery__
 *
 * To run a query within a React component, call `useControllersContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useControllersContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useControllersContextQuery({
 *   variables: {
 *   },
 * });
 */
export function useControllersContextQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ControllersContextQuery,
    ControllersContextQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ControllersContextQuery,
    ControllersContextQueryVariables
  >(ControllersContextDocument, baseOptions);
}
export function useControllersContextLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ControllersContextQuery,
    ControllersContextQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ControllersContextQuery,
    ControllersContextQueryVariables
  >(ControllersContextDocument, baseOptions);
}
export type ControllersContextQueryHookResult = ReturnType<
  typeof useControllersContextQuery
>;
export type ControllersContextLazyQueryHookResult = ReturnType<
  typeof useControllersContextLazyQuery
>;
export type ControllersContextQueryResult = ApolloReactCommon.QueryResult<
  ControllersContextQuery,
  ControllersContextQueryVariables
>;
export const FeatureFlagContextDocument = gql`
  query FeatureFlagContext {
    features {
      ...FeatureMapFields
    }
  }
  ${FeatureMapFieldsFragmentDoc}
`;

/**
 * __useFeatureFlagContextQuery__
 *
 * To run a query within a React component, call `useFeatureFlagContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeatureFlagContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeatureFlagContextQuery({
 *   variables: {
 *   },
 * });
 */
export function useFeatureFlagContextQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FeatureFlagContextQuery,
    FeatureFlagContextQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    FeatureFlagContextQuery,
    FeatureFlagContextQueryVariables
  >(FeatureFlagContextDocument, baseOptions);
}
export function useFeatureFlagContextLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FeatureFlagContextQuery,
    FeatureFlagContextQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    FeatureFlagContextQuery,
    FeatureFlagContextQueryVariables
  >(FeatureFlagContextDocument, baseOptions);
}
export type FeatureFlagContextQueryHookResult = ReturnType<
  typeof useFeatureFlagContextQuery
>;
export type FeatureFlagContextLazyQueryHookResult = ReturnType<
  typeof useFeatureFlagContextLazyQuery
>;
export type FeatureFlagContextQueryResult = ApolloReactCommon.QueryResult<
  FeatureFlagContextQuery,
  FeatureFlagContextQueryVariables
>;
export const BootstrapDocument = gql`
  query Bootstrap($platform: Platform!, $version: String!, $build: String!) {
    controllers {
      ...BootstrapControllerFields
    }
    features {
      ...FeatureMapFields
    }
    locations {
      ...BootstrapLocationFields
    }
    me {
      ...UserBootstrapFields
    }
    updateRequired(
      input: { platform: $platform, version: $version, build: $build }
    )
  }
  ${BootstrapControllerFieldsFragmentDoc}
  ${FeatureMapFieldsFragmentDoc}
  ${BootstrapLocationFieldsFragmentDoc}
  ${UserBootstrapFieldsFragmentDoc}
`;

/**
 * __useBootstrapQuery__
 *
 * To run a query within a React component, call `useBootstrapQuery` and pass it any options that fit your needs.
 * When your component renders, `useBootstrapQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBootstrapQuery({
 *   variables: {
 *      platform: // value for 'platform'
 *      version: // value for 'version'
 *      build: // value for 'build'
 *   },
 * });
 */
export function useBootstrapQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    BootstrapQuery,
    BootstrapQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<BootstrapQuery, BootstrapQueryVariables>(
    BootstrapDocument,
    baseOptions
  );
}
export function useBootstrapLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    BootstrapQuery,
    BootstrapQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<BootstrapQuery, BootstrapQueryVariables>(
    BootstrapDocument,
    baseOptions
  );
}
export type BootstrapQueryHookResult = ReturnType<typeof useBootstrapQuery>;
export type BootstrapLazyQueryHookResult = ReturnType<
  typeof useBootstrapLazyQuery
>;
export type BootstrapQueryResult = ApolloReactCommon.QueryResult<
  BootstrapQuery,
  BootstrapQueryVariables
>;
export const LoadDocument = gql`
  query Load {
    controllers {
      ...ControllerFields
    }
    locations {
      ...LocationFields
    }
    manufacturer {
      ...ManufacturerFields
    }
    me {
      ...UserFields
    }
  }
  ${ControllerFieldsFragmentDoc}
  ${LocationFieldsFragmentDoc}
  ${ManufacturerFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
`;

/**
 * __useLoadQuery__
 *
 * To run a query within a React component, call `useLoadQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoadQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<LoadQuery, LoadQueryVariables>
) {
  return ApolloReactHooks.useQuery<LoadQuery, LoadQueryVariables>(
    LoadDocument,
    baseOptions
  );
}
export function useLoadLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LoadQuery,
    LoadQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<LoadQuery, LoadQueryVariables>(
    LoadDocument,
    baseOptions
  );
}
export type LoadQueryHookResult = ReturnType<typeof useLoadQuery>;
export type LoadLazyQueryHookResult = ReturnType<typeof useLoadLazyQuery>;
export type LoadQueryResult = ApolloReactCommon.QueryResult<
  LoadQuery,
  LoadQueryVariables
>;
export const RefreshTokenDocument = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      __typename
      ... on RefreshTokenSuccess {
        accessToken
        refreshToken
        ttl
      }
    }
  }
`;
export type RefreshTokenMutationFn = ApolloReactCommon.MutationFunction<
  RefreshTokenMutation,
  RefreshTokenMutationVariables
>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRefreshTokenMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RefreshTokenMutation,
    RefreshTokenMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RefreshTokenMutation,
    RefreshTokenMutationVariables
  >(RefreshTokenDocument, baseOptions);
}
export type RefreshTokenMutationHookResult = ReturnType<
  typeof useRefreshTokenMutation
>;
export type RefreshTokenMutationResult = ApolloReactCommon.MutationResult<RefreshTokenMutation>;
export const SubscribeToNotificationsDocument = gql`
  mutation SubscribeToNotifications($input: SubscribeToNotificationsInput!) {
    subscribeToNotifications(input: $input) {
      __typename
      ... on SubscribeToNotificationsSuccess {
        pushToken {
          id
        }
      }
    }
  }
`;
export type SubscribeToNotificationsMutationFn = ApolloReactCommon.MutationFunction<
  SubscribeToNotificationsMutation,
  SubscribeToNotificationsMutationVariables
>;

/**
 * __useSubscribeToNotificationsMutation__
 *
 * To run a mutation, you first call `useSubscribeToNotificationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToNotificationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeToNotificationsMutation, { data, loading, error }] = useSubscribeToNotificationsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubscribeToNotificationsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SubscribeToNotificationsMutation,
    SubscribeToNotificationsMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SubscribeToNotificationsMutation,
    SubscribeToNotificationsMutationVariables
  >(SubscribeToNotificationsDocument, baseOptions);
}
export type SubscribeToNotificationsMutationHookResult = ReturnType<
  typeof useSubscribeToNotificationsMutation
>;
export type SubscribeToNotificationsMutationResult = ApolloReactCommon.MutationResult<SubscribeToNotificationsMutation>;
export const UnsubscribeFromNotificationsDocument = gql`
  mutation UnsubscribeFromNotifications(
    $input: UnsubscribeFromNotificationsInput!
  ) {
    unsubscribeFromNotifications(input: $input) {
      __typename
    }
  }
`;
export type UnsubscribeFromNotificationsMutationFn = ApolloReactCommon.MutationFunction<
  UnsubscribeFromNotificationsMutation,
  UnsubscribeFromNotificationsMutationVariables
>;

/**
 * __useUnsubscribeFromNotificationsMutation__
 *
 * To run a mutation, you first call `useUnsubscribeFromNotificationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsubscribeFromNotificationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsubscribeFromNotificationsMutation, { data, loading, error }] = useUnsubscribeFromNotificationsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnsubscribeFromNotificationsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UnsubscribeFromNotificationsMutation,
    UnsubscribeFromNotificationsMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UnsubscribeFromNotificationsMutation,
    UnsubscribeFromNotificationsMutationVariables
  >(UnsubscribeFromNotificationsDocument, baseOptions);
}
export type UnsubscribeFromNotificationsMutationHookResult = ReturnType<
  typeof useUnsubscribeFromNotificationsMutation
>;
export type UnsubscribeFromNotificationsMutationResult = ApolloReactCommon.MutationResult<UnsubscribeFromNotificationsMutation>;
export const RequestRatingDocument = gql`
  query RequestRating(
    $build: String!
    $installedAt: String!
    $lastDisplayedAt: String
    $platform: Platform!
    $version: String!
  ) {
    requestRating(
      input: {
        build: $build
        installedAt: $installedAt
        lastDisplayedAt: $lastDisplayedAt
        platform: $platform
        version: $version
      }
    )
  }
`;

/**
 * __useRequestRatingQuery__
 *
 * To run a query within a React component, call `useRequestRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestRatingQuery({
 *   variables: {
 *      build: // value for 'build'
 *      installedAt: // value for 'installedAt'
 *      lastDisplayedAt: // value for 'lastDisplayedAt'
 *      platform: // value for 'platform'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useRequestRatingQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    RequestRatingQuery,
    RequestRatingQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    RequestRatingQuery,
    RequestRatingQueryVariables
  >(RequestRatingDocument, baseOptions);
}
export function useRequestRatingLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    RequestRatingQuery,
    RequestRatingQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    RequestRatingQuery,
    RequestRatingQueryVariables
  >(RequestRatingDocument, baseOptions);
}
export type RequestRatingQueryHookResult = ReturnType<
  typeof useRequestRatingQuery
>;
export type RequestRatingLazyQueryHookResult = ReturnType<
  typeof useRequestRatingLazyQuery
>;
export type RequestRatingQueryResult = ApolloReactCommon.QueryResult<
  RequestRatingQuery,
  RequestRatingQueryVariables
>;
export const RequestSurveyFeedbackDocument = gql`
  query RequestSurveyFeedback(
    $build: String!
    $installedAt: String!
    $lastDisplayedAt: String
    $lastResponseAt: String
    $platform: Platform!
    $version: String!
  ) {
    requestSurveyFeedback(
      input: {
        build: $build
        installedAt: $installedAt
        lastDisplayedAt: $lastDisplayedAt
        lastResponseAt: $lastResponseAt
        platform: $platform
        version: $version
      }
    )
  }
`;

/**
 * __useRequestSurveyFeedbackQuery__
 *
 * To run a query within a React component, call `useRequestSurveyFeedbackQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestSurveyFeedbackQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestSurveyFeedbackQuery({
 *   variables: {
 *      build: // value for 'build'
 *      installedAt: // value for 'installedAt'
 *      lastDisplayedAt: // value for 'lastDisplayedAt'
 *      lastResponseAt: // value for 'lastResponseAt'
 *      platform: // value for 'platform'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useRequestSurveyFeedbackQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    RequestSurveyFeedbackQuery,
    RequestSurveyFeedbackQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    RequestSurveyFeedbackQuery,
    RequestSurveyFeedbackQueryVariables
  >(RequestSurveyFeedbackDocument, baseOptions);
}
export function useRequestSurveyFeedbackLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    RequestSurveyFeedbackQuery,
    RequestSurveyFeedbackQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    RequestSurveyFeedbackQuery,
    RequestSurveyFeedbackQueryVariables
  >(RequestSurveyFeedbackDocument, baseOptions);
}
export type RequestSurveyFeedbackQueryHookResult = ReturnType<
  typeof useRequestSurveyFeedbackQuery
>;
export type RequestSurveyFeedbackLazyQueryHookResult = ReturnType<
  typeof useRequestSurveyFeedbackLazyQuery
>;
export type RequestSurveyFeedbackQueryResult = ApolloReactCommon.QueryResult<
  RequestSurveyFeedbackQuery,
  RequestSurveyFeedbackQueryVariables
>;
export const RequestSurveySessionDocument = gql`
  mutation RequestSurveySession {
    requestSurveySession {
      __typename
      userId
      userName
      sessionToken
      sessionExpiresAt
    }
  }
`;
export type RequestSurveySessionMutationFn = ApolloReactCommon.MutationFunction<
  RequestSurveySessionMutation,
  RequestSurveySessionMutationVariables
>;

/**
 * __useRequestSurveySessionMutation__
 *
 * To run a mutation, you first call `useRequestSurveySessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestSurveySessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestSurveySessionMutation, { data, loading, error }] = useRequestSurveySessionMutation({
 *   variables: {
 *   },
 * });
 */
export function useRequestSurveySessionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RequestSurveySessionMutation,
    RequestSurveySessionMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RequestSurveySessionMutation,
    RequestSurveySessionMutationVariables
  >(RequestSurveySessionDocument, baseOptions);
}
export type RequestSurveySessionMutationHookResult = ReturnType<
  typeof useRequestSurveySessionMutation
>;
export type RequestSurveySessionMutationResult = ApolloReactCommon.MutationResult<RequestSurveySessionMutation>;
export const ChangeTemperatureUnitDocument = gql`
  mutation ChangeTemperatureUnit($input: ChangeTemperatureUnitInput!) {
    changeTemperatureUnit(input: $input) {
      __typename
      ... on ChangeTemperatureUnitSuccess {
        location {
          __typename
          id
          temperatureUnit
        }
      }
    }
  }
`;
export type ChangeTemperatureUnitMutationFn = ApolloReactCommon.MutationFunction<
  ChangeTemperatureUnitMutation,
  ChangeTemperatureUnitMutationVariables
>;

/**
 * __useChangeTemperatureUnitMutation__
 *
 * To run a mutation, you first call `useChangeTemperatureUnitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeTemperatureUnitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeTemperatureUnitMutation, { data, loading, error }] = useChangeTemperatureUnitMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangeTemperatureUnitMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeTemperatureUnitMutation,
    ChangeTemperatureUnitMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ChangeTemperatureUnitMutation,
    ChangeTemperatureUnitMutationVariables
  >(ChangeTemperatureUnitDocument, baseOptions);
}
export type ChangeTemperatureUnitMutationHookResult = ReturnType<
  typeof useChangeTemperatureUnitMutation
>;
export type ChangeTemperatureUnitMutationResult = ApolloReactCommon.MutationResult<ChangeTemperatureUnitMutation>;
export const HomeDocument = gql`
  query Home($controllerId: ID!) {
    controller(id: $controllerId) {
      ...Screen_Home_Controller
    }
    locations {
      ...Screen_Home_Location
    }
    me {
      ...Screen_Home_User
    }
  }
  ${Screen_Home_ControllerFragmentDoc}
  ${Screen_Home_LocationFragmentDoc}
  ${Screen_Home_UserFragmentDoc}
`;

/**
 * __useHomeQuery__
 *
 * To run a query within a React component, call `useHomeQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeQuery({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *   },
 * });
 */
export function useHomeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<HomeQuery, HomeQueryVariables>
) {
  return ApolloReactHooks.useQuery<HomeQuery, HomeQueryVariables>(
    HomeDocument,
    baseOptions
  );
}
export function useHomeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    HomeQuery,
    HomeQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<HomeQuery, HomeQueryVariables>(
    HomeDocument,
    baseOptions
  );
}
export type HomeQueryHookResult = ReturnType<typeof useHomeQuery>;
export type HomeLazyQueryHookResult = ReturnType<typeof useHomeLazyQuery>;
export type HomeQueryResult = ApolloReactCommon.QueryResult<
  HomeQuery,
  HomeQueryVariables
>;
export const CancelHoldDocument = gql`
  mutation CancelHold($controllerId: ID!) {
    cancelHold(input: { id: $controllerId }) {
      ... on CancelHoldSuccess {
        controller {
          ...Screen_Home_Controller
        }
      }
    }
  }
  ${Screen_Home_ControllerFragmentDoc}
`;
export type CancelHoldMutationFn = ApolloReactCommon.MutationFunction<
  CancelHoldMutation,
  CancelHoldMutationVariables
>;

/**
 * __useCancelHoldMutation__
 *
 * To run a mutation, you first call `useCancelHoldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelHoldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelHoldMutation, { data, loading, error }] = useCancelHoldMutation({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *   },
 * });
 */
export function useCancelHoldMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CancelHoldMutation,
    CancelHoldMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CancelHoldMutation,
    CancelHoldMutationVariables
  >(CancelHoldDocument, baseOptions);
}
export type CancelHoldMutationHookResult = ReturnType<
  typeof useCancelHoldMutation
>;
export type CancelHoldMutationResult = ApolloReactCommon.MutationResult<CancelHoldMutation>;
export const SettingsDocument = gql`
  query Settings {
    locations {
      ...Screen_Settings_Location
    }
    manufacturer {
      ...Screen_Settings_Manufacturer
    }
    me {
      ...Screen_Settings_User
    }
  }
  ${Screen_Settings_LocationFragmentDoc}
  ${Screen_Settings_ManufacturerFragmentDoc}
  ${Screen_Settings_UserFragmentDoc}
`;

/**
 * __useSettingsQuery__
 *
 * To run a query within a React component, call `useSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSettingsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SettingsQuery,
    SettingsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<SettingsQuery, SettingsQueryVariables>(
    SettingsDocument,
    baseOptions
  );
}
export function useSettingsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SettingsQuery,
    SettingsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<SettingsQuery, SettingsQueryVariables>(
    SettingsDocument,
    baseOptions
  );
}
export type SettingsQueryHookResult = ReturnType<typeof useSettingsQuery>;
export type SettingsLazyQueryHookResult = ReturnType<
  typeof useSettingsLazyQuery
>;
export type SettingsQueryResult = ApolloReactCommon.QueryResult<
  SettingsQuery,
  SettingsQueryVariables
>;
export const SettingsLocationDocument = gql`
  query SettingsLocation($locationId: ID!) {
    location(id: $locationId) {
      ...Screen_Settings_Location
    }
  }
  ${Screen_Settings_LocationFragmentDoc}
`;

/**
 * __useSettingsLocationQuery__
 *
 * To run a query within a React component, call `useSettingsLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSettingsLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSettingsLocationQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useSettingsLocationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SettingsLocationQuery,
    SettingsLocationQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SettingsLocationQuery,
    SettingsLocationQueryVariables
  >(SettingsLocationDocument, baseOptions);
}
export function useSettingsLocationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SettingsLocationQuery,
    SettingsLocationQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SettingsLocationQuery,
    SettingsLocationQueryVariables
  >(SettingsLocationDocument, baseOptions);
}
export type SettingsLocationQueryHookResult = ReturnType<
  typeof useSettingsLocationQuery
>;
export type SettingsLocationLazyQueryHookResult = ReturnType<
  typeof useSettingsLocationLazyQuery
>;
export type SettingsLocationQueryResult = ApolloReactCommon.QueryResult<
  SettingsLocationQuery,
  SettingsLocationQueryVariables
>;
export const GenerateAccountSharingQrCodeDocument = gql`
  mutation GenerateAccountSharingQrCode($width: Int!) {
    generateAccountSharingQrCode(input: { size: $width }) {
      ... on GenerateAccountSharingQrCodeSuccess {
        code {
          dataUrl
          ttl
        }
      }
    }
  }
`;
export type GenerateAccountSharingQrCodeMutationFn = ApolloReactCommon.MutationFunction<
  GenerateAccountSharingQrCodeMutation,
  GenerateAccountSharingQrCodeMutationVariables
>;

/**
 * __useGenerateAccountSharingQrCodeMutation__
 *
 * To run a mutation, you first call `useGenerateAccountSharingQrCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateAccountSharingQrCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateAccountSharingQrCodeMutation, { data, loading, error }] = useGenerateAccountSharingQrCodeMutation({
 *   variables: {
 *      width: // value for 'width'
 *   },
 * });
 */
export function useGenerateAccountSharingQrCodeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    GenerateAccountSharingQrCodeMutation,
    GenerateAccountSharingQrCodeMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    GenerateAccountSharingQrCodeMutation,
    GenerateAccountSharingQrCodeMutationVariables
  >(GenerateAccountSharingQrCodeDocument, baseOptions);
}
export type GenerateAccountSharingQrCodeMutationHookResult = ReturnType<
  typeof useGenerateAccountSharingQrCodeMutation
>;
export type GenerateAccountSharingQrCodeMutationResult = ApolloReactCommon.MutationResult<GenerateAccountSharingQrCodeMutation>;
export const ManageAccountDocument = gql`
  query ManageAccount {
    me {
      ...Screen_ManageAccount_User
    }
  }
  ${Screen_ManageAccount_UserFragmentDoc}
`;

/**
 * __useManageAccountQuery__
 *
 * To run a query within a React component, call `useManageAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useManageAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useManageAccountQuery({
 *   variables: {
 *   },
 * });
 */
export function useManageAccountQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ManageAccountQuery,
    ManageAccountQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ManageAccountQuery,
    ManageAccountQueryVariables
  >(ManageAccountDocument, baseOptions);
}
export function useManageAccountLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ManageAccountQuery,
    ManageAccountQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ManageAccountQuery,
    ManageAccountQueryVariables
  >(ManageAccountDocument, baseOptions);
}
export type ManageAccountQueryHookResult = ReturnType<
  typeof useManageAccountQuery
>;
export type ManageAccountLazyQueryHookResult = ReturnType<
  typeof useManageAccountLazyQuery
>;
export type ManageAccountQueryResult = ApolloReactCommon.QueryResult<
  ManageAccountQuery,
  ManageAccountQueryVariables
>;
export const AwayControllerDocument = gql`
  query AwayController($controllerId: ID!) {
    controller(id: $controllerId) {
      ...Screen_Settings_Away_Controller
    }
  }
  ${Screen_Settings_Away_ControllerFragmentDoc}
`;

/**
 * __useAwayControllerQuery__
 *
 * To run a query within a React component, call `useAwayControllerQuery` and pass it any options that fit your needs.
 * When your component renders, `useAwayControllerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAwayControllerQuery({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *   },
 * });
 */
export function useAwayControllerQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AwayControllerQuery,
    AwayControllerQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    AwayControllerQuery,
    AwayControllerQueryVariables
  >(AwayControllerDocument, baseOptions);
}
export function useAwayControllerLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AwayControllerQuery,
    AwayControllerQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    AwayControllerQuery,
    AwayControllerQueryVariables
  >(AwayControllerDocument, baseOptions);
}
export type AwayControllerQueryHookResult = ReturnType<
  typeof useAwayControllerQuery
>;
export type AwayControllerLazyQueryHookResult = ReturnType<
  typeof useAwayControllerLazyQuery
>;
export type AwayControllerQueryResult = ApolloReactCommon.QueryResult<
  AwayControllerQuery,
  AwayControllerQueryVariables
>;
export const AwayLocationDocument = gql`
  query AwayLocation($locationId: ID!) {
    location(id: $locationId) {
      ...Screen_Settings_Away_Location
    }
  }
  ${Screen_Settings_Away_LocationFragmentDoc}
`;

/**
 * __useAwayLocationQuery__
 *
 * To run a query within a React component, call `useAwayLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAwayLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAwayLocationQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useAwayLocationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AwayLocationQuery,
    AwayLocationQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    AwayLocationQuery,
    AwayLocationQueryVariables
  >(AwayLocationDocument, baseOptions);
}
export function useAwayLocationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AwayLocationQuery,
    AwayLocationQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    AwayLocationQuery,
    AwayLocationQueryVariables
  >(AwayLocationDocument, baseOptions);
}
export type AwayLocationQueryHookResult = ReturnType<
  typeof useAwayLocationQuery
>;
export type AwayLocationLazyQueryHookResult = ReturnType<
  typeof useAwayLocationLazyQuery
>;
export type AwayLocationQueryResult = ApolloReactCommon.QueryResult<
  AwayLocationQuery,
  AwayLocationQueryVariables
>;
export const ChangeControllerAwaySetpointDocument = gql`
  mutation ChangeControllerAwaySetpoint($input: ChangeAwaySetpointInput!) {
    changeControllerAwaySetpoint(input: $input) {
      ... on ChangeControllerAwaySetpointSuccess {
        controller {
          ...Screen_Settings_Away_Controller
        }
      }
    }
  }
  ${Screen_Settings_Away_ControllerFragmentDoc}
`;
export type ChangeControllerAwaySetpointMutationFn = ApolloReactCommon.MutationFunction<
  ChangeControllerAwaySetpointMutation,
  ChangeControllerAwaySetpointMutationVariables
>;

/**
 * __useChangeControllerAwaySetpointMutation__
 *
 * To run a mutation, you first call `useChangeControllerAwaySetpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeControllerAwaySetpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeControllerAwaySetpointMutation, { data, loading, error }] = useChangeControllerAwaySetpointMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangeControllerAwaySetpointMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeControllerAwaySetpointMutation,
    ChangeControllerAwaySetpointMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ChangeControllerAwaySetpointMutation,
    ChangeControllerAwaySetpointMutationVariables
  >(ChangeControllerAwaySetpointDocument, baseOptions);
}
export type ChangeControllerAwaySetpointMutationHookResult = ReturnType<
  typeof useChangeControllerAwaySetpointMutation
>;
export type ChangeControllerAwaySetpointMutationResult = ApolloReactCommon.MutationResult<ChangeControllerAwaySetpointMutation>;
export const ChangeLocationAwaySetpointDocument = gql`
  mutation ChangeLocationAwaySetpoint($input: ChangeAwaySetpointInput!) {
    changeLocationAwaySetpoint(input: $input) {
      ... on ChangeLocationAwaySetpointSuccess {
        location {
          ...Screen_Settings_Away_Location
        }
      }
    }
  }
  ${Screen_Settings_Away_LocationFragmentDoc}
`;
export type ChangeLocationAwaySetpointMutationFn = ApolloReactCommon.MutationFunction<
  ChangeLocationAwaySetpointMutation,
  ChangeLocationAwaySetpointMutationVariables
>;

/**
 * __useChangeLocationAwaySetpointMutation__
 *
 * To run a mutation, you first call `useChangeLocationAwaySetpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeLocationAwaySetpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeLocationAwaySetpointMutation, { data, loading, error }] = useChangeLocationAwaySetpointMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangeLocationAwaySetpointMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeLocationAwaySetpointMutation,
    ChangeLocationAwaySetpointMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ChangeLocationAwaySetpointMutation,
    ChangeLocationAwaySetpointMutationVariables
  >(ChangeLocationAwaySetpointDocument, baseOptions);
}
export type ChangeLocationAwaySetpointMutationHookResult = ReturnType<
  typeof useChangeLocationAwaySetpointMutation
>;
export type ChangeLocationAwaySetpointMutationResult = ApolloReactCommon.MutationResult<ChangeLocationAwaySetpointMutation>;
export const SettingsDebugMenuDebugUserDocument = gql`
  query SettingsDebugMenuDebugUser {
    me {
      ...Screen_Settings_DebugMenu_DebugUser
    }
  }
  ${Screen_Settings_DebugMenu_DebugUserFragmentDoc}
`;

/**
 * __useSettingsDebugMenuDebugUserQuery__
 *
 * To run a query within a React component, call `useSettingsDebugMenuDebugUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useSettingsDebugMenuDebugUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSettingsDebugMenuDebugUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useSettingsDebugMenuDebugUserQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SettingsDebugMenuDebugUserQuery,
    SettingsDebugMenuDebugUserQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SettingsDebugMenuDebugUserQuery,
    SettingsDebugMenuDebugUserQueryVariables
  >(SettingsDebugMenuDebugUserDocument, baseOptions);
}
export function useSettingsDebugMenuDebugUserLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SettingsDebugMenuDebugUserQuery,
    SettingsDebugMenuDebugUserQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SettingsDebugMenuDebugUserQuery,
    SettingsDebugMenuDebugUserQueryVariables
  >(SettingsDebugMenuDebugUserDocument, baseOptions);
}
export type SettingsDebugMenuDebugUserQueryHookResult = ReturnType<
  typeof useSettingsDebugMenuDebugUserQuery
>;
export type SettingsDebugMenuDebugUserLazyQueryHookResult = ReturnType<
  typeof useSettingsDebugMenuDebugUserLazyQuery
>;
export type SettingsDebugMenuDebugUserQueryResult = ApolloReactCommon.QueryResult<
  SettingsDebugMenuDebugUserQuery,
  SettingsDebugMenuDebugUserQueryVariables
>;
export const ScreenSettingsFaultLogsLocationDocument = gql`
  query ScreenSettingsFaultLogsLocation($locationId: ID!) {
    location(id: $locationId) {
      ...Screen_Settings_FaultLogs_Location
    }
  }
  ${Screen_Settings_FaultLogs_LocationFragmentDoc}
`;

/**
 * __useScreenSettingsFaultLogsLocationQuery__
 *
 * To run a query within a React component, call `useScreenSettingsFaultLogsLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useScreenSettingsFaultLogsLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScreenSettingsFaultLogsLocationQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useScreenSettingsFaultLogsLocationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ScreenSettingsFaultLogsLocationQuery,
    ScreenSettingsFaultLogsLocationQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ScreenSettingsFaultLogsLocationQuery,
    ScreenSettingsFaultLogsLocationQueryVariables
  >(ScreenSettingsFaultLogsLocationDocument, baseOptions);
}
export function useScreenSettingsFaultLogsLocationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ScreenSettingsFaultLogsLocationQuery,
    ScreenSettingsFaultLogsLocationQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ScreenSettingsFaultLogsLocationQuery,
    ScreenSettingsFaultLogsLocationQueryVariables
  >(ScreenSettingsFaultLogsLocationDocument, baseOptions);
}
export type ScreenSettingsFaultLogsLocationQueryHookResult = ReturnType<
  typeof useScreenSettingsFaultLogsLocationQuery
>;
export type ScreenSettingsFaultLogsLocationLazyQueryHookResult = ReturnType<
  typeof useScreenSettingsFaultLogsLocationLazyQuery
>;
export type ScreenSettingsFaultLogsLocationQueryResult = ApolloReactCommon.QueryResult<
  ScreenSettingsFaultLogsLocationQuery,
  ScreenSettingsFaultLogsLocationQueryVariables
>;
export const SettingsFaultLogsLocationDocument = gql`
  query SettingsFaultLogsLocation($locationId: ID!) {
    location(id: $locationId) {
      ...Settings_FaultLogs_Location
    }
  }
  ${Settings_FaultLogs_LocationFragmentDoc}
`;

/**
 * __useSettingsFaultLogsLocationQuery__
 *
 * To run a query within a React component, call `useSettingsFaultLogsLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSettingsFaultLogsLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSettingsFaultLogsLocationQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useSettingsFaultLogsLocationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SettingsFaultLogsLocationQuery,
    SettingsFaultLogsLocationQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SettingsFaultLogsLocationQuery,
    SettingsFaultLogsLocationQueryVariables
  >(SettingsFaultLogsLocationDocument, baseOptions);
}
export function useSettingsFaultLogsLocationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SettingsFaultLogsLocationQuery,
    SettingsFaultLogsLocationQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SettingsFaultLogsLocationQuery,
    SettingsFaultLogsLocationQueryVariables
  >(SettingsFaultLogsLocationDocument, baseOptions);
}
export type SettingsFaultLogsLocationQueryHookResult = ReturnType<
  typeof useSettingsFaultLogsLocationQuery
>;
export type SettingsFaultLogsLocationLazyQueryHookResult = ReturnType<
  typeof useSettingsFaultLogsLocationLazyQuery
>;
export type SettingsFaultLogsLocationQueryResult = ApolloReactCommon.QueryResult<
  SettingsFaultLogsLocationQuery,
  SettingsFaultLogsLocationQueryVariables
>;
export const SettingsHoldLengthLocationDocument = gql`
  query SettingsHoldLengthLocation($locationId: ID!) {
    location(id: $locationId) {
      ...Screen_Settings_HoldLength_Location
    }
  }
  ${Screen_Settings_HoldLength_LocationFragmentDoc}
`;

/**
 * __useSettingsHoldLengthLocationQuery__
 *
 * To run a query within a React component, call `useSettingsHoldLengthLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSettingsHoldLengthLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSettingsHoldLengthLocationQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useSettingsHoldLengthLocationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SettingsHoldLengthLocationQuery,
    SettingsHoldLengthLocationQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SettingsHoldLengthLocationQuery,
    SettingsHoldLengthLocationQueryVariables
  >(SettingsHoldLengthLocationDocument, baseOptions);
}
export function useSettingsHoldLengthLocationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SettingsHoldLengthLocationQuery,
    SettingsHoldLengthLocationQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SettingsHoldLengthLocationQuery,
    SettingsHoldLengthLocationQueryVariables
  >(SettingsHoldLengthLocationDocument, baseOptions);
}
export type SettingsHoldLengthLocationQueryHookResult = ReturnType<
  typeof useSettingsHoldLengthLocationQuery
>;
export type SettingsHoldLengthLocationLazyQueryHookResult = ReturnType<
  typeof useSettingsHoldLengthLocationLazyQuery
>;
export type SettingsHoldLengthLocationQueryResult = ApolloReactCommon.QueryResult<
  SettingsHoldLengthLocationQuery,
  SettingsHoldLengthLocationQueryVariables
>;
export const ChangeLocationHoldLengthDocument = gql`
  mutation ChangeLocationHoldLength($input: ChangeDefaultHoldLengthInput!) {
    changeDefaultLocationHoldLength(input: $input) {
      __typename
      ... on ChangeDefaultLocationHoldLengthSuccess {
        location {
          ...Screen_Settings_HoldLength_Location
        }
      }
    }
  }
  ${Screen_Settings_HoldLength_LocationFragmentDoc}
`;
export type ChangeLocationHoldLengthMutationFn = ApolloReactCommon.MutationFunction<
  ChangeLocationHoldLengthMutation,
  ChangeLocationHoldLengthMutationVariables
>;

/**
 * __useChangeLocationHoldLengthMutation__
 *
 * To run a mutation, you first call `useChangeLocationHoldLengthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeLocationHoldLengthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeLocationHoldLengthMutation, { data, loading, error }] = useChangeLocationHoldLengthMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangeLocationHoldLengthMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeLocationHoldLengthMutation,
    ChangeLocationHoldLengthMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ChangeLocationHoldLengthMutation,
    ChangeLocationHoldLengthMutationVariables
  >(ChangeLocationHoldLengthDocument, baseOptions);
}
export type ChangeLocationHoldLengthMutationHookResult = ReturnType<
  typeof useChangeLocationHoldLengthMutation
>;
export type ChangeLocationHoldLengthMutationResult = ApolloReactCommon.MutationResult<ChangeLocationHoldLengthMutation>;
export const NamesDocument = gql`
  query Names($locationId: ID!) {
    location(id: $locationId) {
      ...Screen_Settings_Names_Location
    }
  }
  ${Screen_Settings_Names_LocationFragmentDoc}
`;

/**
 * __useNamesQuery__
 *
 * To run a query within a React component, call `useNamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNamesQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useNamesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    NamesQuery,
    NamesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<NamesQuery, NamesQueryVariables>(
    NamesDocument,
    baseOptions
  );
}
export function useNamesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    NamesQuery,
    NamesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<NamesQuery, NamesQueryVariables>(
    NamesDocument,
    baseOptions
  );
}
export type NamesQueryHookResult = ReturnType<typeof useNamesQuery>;
export type NamesLazyQueryHookResult = ReturnType<typeof useNamesLazyQuery>;
export type NamesQueryResult = ApolloReactCommon.QueryResult<
  NamesQuery,
  NamesQueryVariables
>;
export const ControllerNameDocument = gql`
  query ControllerName($controllerId: ID!) {
    controller(id: $controllerId) {
      ...Screen_Settings_Names_Controller
    }
  }
  ${Screen_Settings_Names_ControllerFragmentDoc}
`;

/**
 * __useControllerNameQuery__
 *
 * To run a query within a React component, call `useControllerNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useControllerNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useControllerNameQuery({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *   },
 * });
 */
export function useControllerNameQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ControllerNameQuery,
    ControllerNameQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ControllerNameQuery,
    ControllerNameQueryVariables
  >(ControllerNameDocument, baseOptions);
}
export function useControllerNameLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ControllerNameQuery,
    ControllerNameQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ControllerNameQuery,
    ControllerNameQueryVariables
  >(ControllerNameDocument, baseOptions);
}
export type ControllerNameQueryHookResult = ReturnType<
  typeof useControllerNameQuery
>;
export type ControllerNameLazyQueryHookResult = ReturnType<
  typeof useControllerNameLazyQuery
>;
export type ControllerNameQueryResult = ApolloReactCommon.QueryResult<
  ControllerNameQuery,
  ControllerNameQueryVariables
>;
export const RenameControllerDocument = gql`
  mutation RenameController($input: RenameInput!) {
    renameController(input: $input) {
      __typename
      ... on RenameControllerSuccess {
        controller {
          ...Screen_Settings_Names_Controller
        }
      }
    }
  }
  ${Screen_Settings_Names_ControllerFragmentDoc}
`;
export type RenameControllerMutationFn = ApolloReactCommon.MutationFunction<
  RenameControllerMutation,
  RenameControllerMutationVariables
>;

/**
 * __useRenameControllerMutation__
 *
 * To run a mutation, you first call `useRenameControllerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameControllerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameControllerMutation, { data, loading, error }] = useRenameControllerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRenameControllerMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RenameControllerMutation,
    RenameControllerMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RenameControllerMutation,
    RenameControllerMutationVariables
  >(RenameControllerDocument, baseOptions);
}
export type RenameControllerMutationHookResult = ReturnType<
  typeof useRenameControllerMutation
>;
export type RenameControllerMutationResult = ApolloReactCommon.MutationResult<RenameControllerMutation>;
export const RenameLocationDocument = gql`
  mutation RenameLocation($input: RenameInput!) {
    renameLocation(input: $input) {
      __typename
      ... on RenameLocationSuccess {
        location {
          ...Screen_Settings_Names_Location
        }
      }
    }
  }
  ${Screen_Settings_Names_LocationFragmentDoc}
`;
export type RenameLocationMutationFn = ApolloReactCommon.MutationFunction<
  RenameLocationMutation,
  RenameLocationMutationVariables
>;

/**
 * __useRenameLocationMutation__
 *
 * To run a mutation, you first call `useRenameLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameLocationMutation, { data, loading, error }] = useRenameLocationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRenameLocationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RenameLocationMutation,
    RenameLocationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RenameLocationMutation,
    RenameLocationMutationVariables
  >(RenameLocationDocument, baseOptions);
}
export type RenameLocationMutationHookResult = ReturnType<
  typeof useRenameLocationMutation
>;
export type RenameLocationMutationResult = ApolloReactCommon.MutationResult<RenameLocationMutation>;
export const LocationNotificationsDocument = gql`
  query LocationNotifications($locationId: ID!) {
    location(id: $locationId) {
      ...Screen_Settings_Notifications_Location
    }
  }
  ${Screen_Settings_Notifications_LocationFragmentDoc}
`;

/**
 * __useLocationNotificationsQuery__
 *
 * To run a query within a React component, call `useLocationNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLocationNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLocationNotificationsQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useLocationNotificationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LocationNotificationsQuery,
    LocationNotificationsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    LocationNotificationsQuery,
    LocationNotificationsQueryVariables
  >(LocationNotificationsDocument, baseOptions);
}
export function useLocationNotificationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LocationNotificationsQuery,
    LocationNotificationsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    LocationNotificationsQuery,
    LocationNotificationsQueryVariables
  >(LocationNotificationsDocument, baseOptions);
}
export type LocationNotificationsQueryHookResult = ReturnType<
  typeof useLocationNotificationsQuery
>;
export type LocationNotificationsLazyQueryHookResult = ReturnType<
  typeof useLocationNotificationsLazyQuery
>;
export type LocationNotificationsQueryResult = ApolloReactCommon.QueryResult<
  LocationNotificationsQuery,
  LocationNotificationsQueryVariables
>;
export const ControllerNotificationsDocument = gql`
  query ControllerNotifications($controllerId: ID!) {
    controller(id: $controllerId) {
      ...Screen_Settings_Notifications_Controller
    }
  }
  ${Screen_Settings_Notifications_ControllerFragmentDoc}
`;

/**
 * __useControllerNotificationsQuery__
 *
 * To run a query within a React component, call `useControllerNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useControllerNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useControllerNotificationsQuery({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *   },
 * });
 */
export function useControllerNotificationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ControllerNotificationsQuery,
    ControllerNotificationsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ControllerNotificationsQuery,
    ControllerNotificationsQueryVariables
  >(ControllerNotificationsDocument, baseOptions);
}
export function useControllerNotificationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ControllerNotificationsQuery,
    ControllerNotificationsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ControllerNotificationsQuery,
    ControllerNotificationsQueryVariables
  >(ControllerNotificationsDocument, baseOptions);
}
export type ControllerNotificationsQueryHookResult = ReturnType<
  typeof useControllerNotificationsQuery
>;
export type ControllerNotificationsLazyQueryHookResult = ReturnType<
  typeof useControllerNotificationsLazyQuery
>;
export type ControllerNotificationsQueryResult = ApolloReactCommon.QueryResult<
  ControllerNotificationsQuery,
  ControllerNotificationsQueryVariables
>;
export const ToggleControllerTemperatureNotificationDocument = gql`
  mutation ToggleControllerTemperatureNotification(
    $input: ToggleNotificationInput!
  ) {
    toggleControllerTemperatureNotification(input: $input) {
      __typename
      ... on ToggleControllerTemperatureNotificationSuccess {
        controller {
          ...Screen_Settings_Notifications_Controller
        }
      }
    }
  }
  ${Screen_Settings_Notifications_ControllerFragmentDoc}
`;
export type ToggleControllerTemperatureNotificationMutationFn = ApolloReactCommon.MutationFunction<
  ToggleControllerTemperatureNotificationMutation,
  ToggleControllerTemperatureNotificationMutationVariables
>;

/**
 * __useToggleControllerTemperatureNotificationMutation__
 *
 * To run a mutation, you first call `useToggleControllerTemperatureNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleControllerTemperatureNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleControllerTemperatureNotificationMutation, { data, loading, error }] = useToggleControllerTemperatureNotificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleControllerTemperatureNotificationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ToggleControllerTemperatureNotificationMutation,
    ToggleControllerTemperatureNotificationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ToggleControllerTemperatureNotificationMutation,
    ToggleControllerTemperatureNotificationMutationVariables
  >(ToggleControllerTemperatureNotificationDocument, baseOptions);
}
export type ToggleControllerTemperatureNotificationMutationHookResult = ReturnType<
  typeof useToggleControllerTemperatureNotificationMutation
>;
export type ToggleControllerTemperatureNotificationMutationResult = ApolloReactCommon.MutationResult<ToggleControllerTemperatureNotificationMutation>;
export const AdjustControllerTemperatureNotificationThresholdDocument = gql`
  mutation AdjustControllerTemperatureNotificationThreshold(
    $input: AdjustNotificationThresholdInput!
  ) {
    adjustControllerTemperatureNotificationThreshold(input: $input) {
      __typename
      ... on AdjustControllerTemperatureNotificationThresholdSuccess {
        controller {
          ...Screen_Settings_Notifications_Controller
        }
      }
    }
  }
  ${Screen_Settings_Notifications_ControllerFragmentDoc}
`;
export type AdjustControllerTemperatureNotificationThresholdMutationFn = ApolloReactCommon.MutationFunction<
  AdjustControllerTemperatureNotificationThresholdMutation,
  AdjustControllerTemperatureNotificationThresholdMutationVariables
>;

/**
 * __useAdjustControllerTemperatureNotificationThresholdMutation__
 *
 * To run a mutation, you first call `useAdjustControllerTemperatureNotificationThresholdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdjustControllerTemperatureNotificationThresholdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adjustControllerTemperatureNotificationThresholdMutation, { data, loading, error }] = useAdjustControllerTemperatureNotificationThresholdMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdjustControllerTemperatureNotificationThresholdMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AdjustControllerTemperatureNotificationThresholdMutation,
    AdjustControllerTemperatureNotificationThresholdMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AdjustControllerTemperatureNotificationThresholdMutation,
    AdjustControllerTemperatureNotificationThresholdMutationVariables
  >(AdjustControllerTemperatureNotificationThresholdDocument, baseOptions);
}
export type AdjustControllerTemperatureNotificationThresholdMutationHookResult = ReturnType<
  typeof useAdjustControllerTemperatureNotificationThresholdMutation
>;
export type AdjustControllerTemperatureNotificationThresholdMutationResult = ApolloReactCommon.MutationResult<AdjustControllerTemperatureNotificationThresholdMutation>;
export const ToggleControllerHumidityNotificationDocument = gql`
  mutation ToggleControllerHumidityNotification(
    $input: ToggleNotificationInput!
  ) {
    toggleControllerHumidityNotification(input: $input) {
      __typename
      ... on ToggleControllerHumidityNotificationSuccess {
        controller {
          ...Screen_Settings_Notifications_Controller
        }
      }
    }
  }
  ${Screen_Settings_Notifications_ControllerFragmentDoc}
`;
export type ToggleControllerHumidityNotificationMutationFn = ApolloReactCommon.MutationFunction<
  ToggleControllerHumidityNotificationMutation,
  ToggleControllerHumidityNotificationMutationVariables
>;

/**
 * __useToggleControllerHumidityNotificationMutation__
 *
 * To run a mutation, you first call `useToggleControllerHumidityNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleControllerHumidityNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleControllerHumidityNotificationMutation, { data, loading, error }] = useToggleControllerHumidityNotificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleControllerHumidityNotificationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ToggleControllerHumidityNotificationMutation,
    ToggleControllerHumidityNotificationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ToggleControllerHumidityNotificationMutation,
    ToggleControllerHumidityNotificationMutationVariables
  >(ToggleControllerHumidityNotificationDocument, baseOptions);
}
export type ToggleControllerHumidityNotificationMutationHookResult = ReturnType<
  typeof useToggleControllerHumidityNotificationMutation
>;
export type ToggleControllerHumidityNotificationMutationResult = ApolloReactCommon.MutationResult<ToggleControllerHumidityNotificationMutation>;
export const AdjustControllerHumidityNotificationThresholdDocument = gql`
  mutation AdjustControllerHumidityNotificationThreshold(
    $input: AdjustNotificationThresholdInput!
  ) {
    adjustControllerHumidityNotificationThreshold(input: $input) {
      __typename
      ... on AdjustControllerHumidityNotificationThresholdSuccess {
        controller {
          ...Screen_Settings_Notifications_Controller
        }
      }
    }
  }
  ${Screen_Settings_Notifications_ControllerFragmentDoc}
`;
export type AdjustControllerHumidityNotificationThresholdMutationFn = ApolloReactCommon.MutationFunction<
  AdjustControllerHumidityNotificationThresholdMutation,
  AdjustControllerHumidityNotificationThresholdMutationVariables
>;

/**
 * __useAdjustControllerHumidityNotificationThresholdMutation__
 *
 * To run a mutation, you first call `useAdjustControllerHumidityNotificationThresholdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdjustControllerHumidityNotificationThresholdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adjustControllerHumidityNotificationThresholdMutation, { data, loading, error }] = useAdjustControllerHumidityNotificationThresholdMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdjustControllerHumidityNotificationThresholdMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AdjustControllerHumidityNotificationThresholdMutation,
    AdjustControllerHumidityNotificationThresholdMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AdjustControllerHumidityNotificationThresholdMutation,
    AdjustControllerHumidityNotificationThresholdMutationVariables
  >(AdjustControllerHumidityNotificationThresholdDocument, baseOptions);
}
export type AdjustControllerHumidityNotificationThresholdMutationHookResult = ReturnType<
  typeof useAdjustControllerHumidityNotificationThresholdMutation
>;
export type AdjustControllerHumidityNotificationThresholdMutationResult = ApolloReactCommon.MutationResult<AdjustControllerHumidityNotificationThresholdMutation>;
export const ToggleLocationFaultNotificationDocument = gql`
  mutation ToggleLocationFaultNotification($input: ToggleNotificationInput!) {
    toggleLocationFaultNotification(input: $input) {
      __typename
      ... on ToggleLocationFaultNotificationSuccess {
        location {
          ...Screen_Settings_Notifications_Location
        }
      }
    }
  }
  ${Screen_Settings_Notifications_LocationFragmentDoc}
`;
export type ToggleLocationFaultNotificationMutationFn = ApolloReactCommon.MutationFunction<
  ToggleLocationFaultNotificationMutation,
  ToggleLocationFaultNotificationMutationVariables
>;

/**
 * __useToggleLocationFaultNotificationMutation__
 *
 * To run a mutation, you first call `useToggleLocationFaultNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLocationFaultNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLocationFaultNotificationMutation, { data, loading, error }] = useToggleLocationFaultNotificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleLocationFaultNotificationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ToggleLocationFaultNotificationMutation,
    ToggleLocationFaultNotificationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ToggleLocationFaultNotificationMutation,
    ToggleLocationFaultNotificationMutationVariables
  >(ToggleLocationFaultNotificationDocument, baseOptions);
}
export type ToggleLocationFaultNotificationMutationHookResult = ReturnType<
  typeof useToggleLocationFaultNotificationMutation
>;
export type ToggleLocationFaultNotificationMutationResult = ApolloReactCommon.MutationResult<ToggleLocationFaultNotificationMutation>;
export const ToggleLocationTemperatureNotificationDocument = gql`
  mutation ToggleLocationTemperatureNotification(
    $input: ToggleNotificationInput!
  ) {
    toggleLocationTemperatureNotification(input: $input) {
      __typename
      ... on ToggleLocationTemperatureNotificationSuccess {
        location {
          ...Screen_Settings_Notifications_Location
        }
      }
    }
  }
  ${Screen_Settings_Notifications_LocationFragmentDoc}
`;
export type ToggleLocationTemperatureNotificationMutationFn = ApolloReactCommon.MutationFunction<
  ToggleLocationTemperatureNotificationMutation,
  ToggleLocationTemperatureNotificationMutationVariables
>;

/**
 * __useToggleLocationTemperatureNotificationMutation__
 *
 * To run a mutation, you first call `useToggleLocationTemperatureNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLocationTemperatureNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLocationTemperatureNotificationMutation, { data, loading, error }] = useToggleLocationTemperatureNotificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleLocationTemperatureNotificationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ToggleLocationTemperatureNotificationMutation,
    ToggleLocationTemperatureNotificationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ToggleLocationTemperatureNotificationMutation,
    ToggleLocationTemperatureNotificationMutationVariables
  >(ToggleLocationTemperatureNotificationDocument, baseOptions);
}
export type ToggleLocationTemperatureNotificationMutationHookResult = ReturnType<
  typeof useToggleLocationTemperatureNotificationMutation
>;
export type ToggleLocationTemperatureNotificationMutationResult = ApolloReactCommon.MutationResult<ToggleLocationTemperatureNotificationMutation>;
export const AdjustLocationTemperatureNotificationThresholdDocument = gql`
  mutation AdjustLocationTemperatureNotificationThreshold(
    $input: AdjustNotificationThresholdInput!
  ) {
    adjustLocationTemperatureNotificationThreshold(input: $input) {
      __typename
      ... on AdjustLocationTemperatureNotificationThresholdSuccess {
        location {
          ...Screen_Settings_Notifications_Location
        }
      }
    }
  }
  ${Screen_Settings_Notifications_LocationFragmentDoc}
`;
export type AdjustLocationTemperatureNotificationThresholdMutationFn = ApolloReactCommon.MutationFunction<
  AdjustLocationTemperatureNotificationThresholdMutation,
  AdjustLocationTemperatureNotificationThresholdMutationVariables
>;

/**
 * __useAdjustLocationTemperatureNotificationThresholdMutation__
 *
 * To run a mutation, you first call `useAdjustLocationTemperatureNotificationThresholdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdjustLocationTemperatureNotificationThresholdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adjustLocationTemperatureNotificationThresholdMutation, { data, loading, error }] = useAdjustLocationTemperatureNotificationThresholdMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdjustLocationTemperatureNotificationThresholdMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AdjustLocationTemperatureNotificationThresholdMutation,
    AdjustLocationTemperatureNotificationThresholdMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AdjustLocationTemperatureNotificationThresholdMutation,
    AdjustLocationTemperatureNotificationThresholdMutationVariables
  >(AdjustLocationTemperatureNotificationThresholdDocument, baseOptions);
}
export type AdjustLocationTemperatureNotificationThresholdMutationHookResult = ReturnType<
  typeof useAdjustLocationTemperatureNotificationThresholdMutation
>;
export type AdjustLocationTemperatureNotificationThresholdMutationResult = ApolloReactCommon.MutationResult<AdjustLocationTemperatureNotificationThresholdMutation>;
export const ToggleLocationHumidityNotificationDocument = gql`
  mutation ToggleLocationHumidityNotification(
    $input: ToggleNotificationInput!
  ) {
    toggleLocationHumidityNotification(input: $input) {
      __typename
      ... on ToggleLocationHumidityNotificationSuccess {
        location {
          ...Screen_Settings_Notifications_Location
        }
      }
    }
  }
  ${Screen_Settings_Notifications_LocationFragmentDoc}
`;
export type ToggleLocationHumidityNotificationMutationFn = ApolloReactCommon.MutationFunction<
  ToggleLocationHumidityNotificationMutation,
  ToggleLocationHumidityNotificationMutationVariables
>;

/**
 * __useToggleLocationHumidityNotificationMutation__
 *
 * To run a mutation, you first call `useToggleLocationHumidityNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLocationHumidityNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLocationHumidityNotificationMutation, { data, loading, error }] = useToggleLocationHumidityNotificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleLocationHumidityNotificationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ToggleLocationHumidityNotificationMutation,
    ToggleLocationHumidityNotificationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ToggleLocationHumidityNotificationMutation,
    ToggleLocationHumidityNotificationMutationVariables
  >(ToggleLocationHumidityNotificationDocument, baseOptions);
}
export type ToggleLocationHumidityNotificationMutationHookResult = ReturnType<
  typeof useToggleLocationHumidityNotificationMutation
>;
export type ToggleLocationHumidityNotificationMutationResult = ApolloReactCommon.MutationResult<ToggleLocationHumidityNotificationMutation>;
export const AdjustLocationHumidityNotificationThresholdDocument = gql`
  mutation AdjustLocationHumidityNotificationThreshold(
    $input: AdjustNotificationThresholdInput!
  ) {
    adjustLocationHumidityNotificationThreshold(input: $input) {
      __typename
      ... on AdjustLocationHumidityNotificationThresholdSuccess {
        location {
          ...Screen_Settings_Notifications_Location
        }
      }
    }
  }
  ${Screen_Settings_Notifications_LocationFragmentDoc}
`;
export type AdjustLocationHumidityNotificationThresholdMutationFn = ApolloReactCommon.MutationFunction<
  AdjustLocationHumidityNotificationThresholdMutation,
  AdjustLocationHumidityNotificationThresholdMutationVariables
>;

/**
 * __useAdjustLocationHumidityNotificationThresholdMutation__
 *
 * To run a mutation, you first call `useAdjustLocationHumidityNotificationThresholdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdjustLocationHumidityNotificationThresholdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adjustLocationHumidityNotificationThresholdMutation, { data, loading, error }] = useAdjustLocationHumidityNotificationThresholdMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdjustLocationHumidityNotificationThresholdMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AdjustLocationHumidityNotificationThresholdMutation,
    AdjustLocationHumidityNotificationThresholdMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AdjustLocationHumidityNotificationThresholdMutation,
    AdjustLocationHumidityNotificationThresholdMutationVariables
  >(AdjustLocationHumidityNotificationThresholdDocument, baseOptions);
}
export type AdjustLocationHumidityNotificationThresholdMutationHookResult = ReturnType<
  typeof useAdjustLocationHumidityNotificationThresholdMutation
>;
export type AdjustLocationHumidityNotificationThresholdMutationResult = ApolloReactCommon.MutationResult<AdjustLocationHumidityNotificationThresholdMutation>;
export const SupportContactDocument = gql`
  query SupportContact {
    manufacturer {
      ...Screen_Support_Manufacturer
    }
  }
  ${Screen_Support_ManufacturerFragmentDoc}
`;

/**
 * __useSupportContactQuery__
 *
 * To run a query within a React component, call `useSupportContactQuery` and pass it any options that fit your needs.
 * When your component renders, `useSupportContactQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSupportContactQuery({
 *   variables: {
 *   },
 * });
 */
export function useSupportContactQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SupportContactQuery,
    SupportContactQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SupportContactQuery,
    SupportContactQueryVariables
  >(SupportContactDocument, baseOptions);
}
export function useSupportContactLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SupportContactQuery,
    SupportContactQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SupportContactQuery,
    SupportContactQueryVariables
  >(SupportContactDocument, baseOptions);
}
export type SupportContactQueryHookResult = ReturnType<
  typeof useSupportContactQuery
>;
export type SupportContactLazyQueryHookResult = ReturnType<
  typeof useSupportContactLazyQuery
>;
export type SupportContactQueryResult = ApolloReactCommon.QueryResult<
  SupportContactQuery,
  SupportContactQueryVariables
>;
export const ConnectAylaDisplayDocument = gql`
  mutation ConnectAylaDisplay($token: String!) {
    connectAylaDisplay(input: { token: $token }) {
      __typename
      ... on ConnectAylaDisplaySuccess {
        location {
          id
        }
      }
    }
  }
`;
export type ConnectAylaDisplayMutationFn = ApolloReactCommon.MutationFunction<
  ConnectAylaDisplayMutation,
  ConnectAylaDisplayMutationVariables
>;

/**
 * __useConnectAylaDisplayMutation__
 *
 * To run a mutation, you first call `useConnectAylaDisplayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConnectAylaDisplayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [connectAylaDisplayMutation, { data, loading, error }] = useConnectAylaDisplayMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConnectAylaDisplayMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ConnectAylaDisplayMutation,
    ConnectAylaDisplayMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ConnectAylaDisplayMutation,
    ConnectAylaDisplayMutationVariables
  >(ConnectAylaDisplayDocument, baseOptions);
}
export type ConnectAylaDisplayMutationHookResult = ReturnType<
  typeof useConnectAylaDisplayMutation
>;
export type ConnectAylaDisplayMutationResult = ApolloReactCommon.MutationResult<ConnectAylaDisplayMutation>;
export const CopyScheduleDocument = gql`
  query CopySchedule($controllerId: ID!) {
    controller(id: $controllerId) {
      ...Screen_Copy_Schedule_Controller
    }
  }
  ${Screen_Copy_Schedule_ControllerFragmentDoc}
`;

/**
 * __useCopyScheduleQuery__
 *
 * To run a query within a React component, call `useCopyScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useCopyScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCopyScheduleQuery({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *   },
 * });
 */
export function useCopyScheduleQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CopyScheduleQuery,
    CopyScheduleQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    CopyScheduleQuery,
    CopyScheduleQueryVariables
  >(CopyScheduleDocument, baseOptions);
}
export function useCopyScheduleLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CopyScheduleQuery,
    CopyScheduleQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    CopyScheduleQuery,
    CopyScheduleQueryVariables
  >(CopyScheduleDocument, baseOptions);
}
export type CopyScheduleQueryHookResult = ReturnType<
  typeof useCopyScheduleQuery
>;
export type CopyScheduleLazyQueryHookResult = ReturnType<
  typeof useCopyScheduleLazyQuery
>;
export type CopyScheduleQueryResult = ApolloReactCommon.QueryResult<
  CopyScheduleQuery,
  CopyScheduleQueryVariables
>;
export const MakeScheduleCopyDocument = gql`
  mutation MakeScheduleCopy($input: CopyScheduleInput!) {
    copySchedule(input: $input) {
      __typename
      ... on CopyScheduleSuccess {
        controller {
          ...Screen_Copy_Schedule_Controller
        }
      }
    }
  }
  ${Screen_Copy_Schedule_ControllerFragmentDoc}
`;
export type MakeScheduleCopyMutationFn = ApolloReactCommon.MutationFunction<
  MakeScheduleCopyMutation,
  MakeScheduleCopyMutationVariables
>;

/**
 * __useMakeScheduleCopyMutation__
 *
 * To run a mutation, you first call `useMakeScheduleCopyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMakeScheduleCopyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [makeScheduleCopyMutation, { data, loading, error }] = useMakeScheduleCopyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMakeScheduleCopyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    MakeScheduleCopyMutation,
    MakeScheduleCopyMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    MakeScheduleCopyMutation,
    MakeScheduleCopyMutationVariables
  >(MakeScheduleCopyDocument, baseOptions);
}
export type MakeScheduleCopyMutationHookResult = ReturnType<
  typeof useMakeScheduleCopyMutation
>;
export type MakeScheduleCopyMutationResult = ApolloReactCommon.MutationResult<MakeScheduleCopyMutation>;
export const ListTemperaturePresetsDocument = gql`
  query ListTemperaturePresets($locationId: ID!) {
    location(id: $locationId) {
      ...Screen_Settings_List_Temperature_Presets_Location
    }
  }
  ${Screen_Settings_List_Temperature_Presets_LocationFragmentDoc}
`;

/**
 * __useListTemperaturePresetsQuery__
 *
 * To run a query within a React component, call `useListTemperaturePresetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListTemperaturePresetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListTemperaturePresetsQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useListTemperaturePresetsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ListTemperaturePresetsQuery,
    ListTemperaturePresetsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ListTemperaturePresetsQuery,
    ListTemperaturePresetsQueryVariables
  >(ListTemperaturePresetsDocument, baseOptions);
}
export function useListTemperaturePresetsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ListTemperaturePresetsQuery,
    ListTemperaturePresetsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ListTemperaturePresetsQuery,
    ListTemperaturePresetsQueryVariables
  >(ListTemperaturePresetsDocument, baseOptions);
}
export type ListTemperaturePresetsQueryHookResult = ReturnType<
  typeof useListTemperaturePresetsQuery
>;
export type ListTemperaturePresetsLazyQueryHookResult = ReturnType<
  typeof useListTemperaturePresetsLazyQuery
>;
export type ListTemperaturePresetsQueryResult = ApolloReactCommon.QueryResult<
  ListTemperaturePresetsQuery,
  ListTemperaturePresetsQueryVariables
>;
export const TemperaturePresetDocument = gql`
  query TemperaturePreset($temperaturePresetId: ID!) {
    temperaturePreset(id: $temperaturePresetId) {
      ...TemperaturePresetsFields
    }
  }
  ${TemperaturePresetsFieldsFragmentDoc}
`;

/**
 * __useTemperaturePresetQuery__
 *
 * To run a query within a React component, call `useTemperaturePresetQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemperaturePresetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemperaturePresetQuery({
 *   variables: {
 *      temperaturePresetId: // value for 'temperaturePresetId'
 *   },
 * });
 */
export function useTemperaturePresetQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    TemperaturePresetQuery,
    TemperaturePresetQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    TemperaturePresetQuery,
    TemperaturePresetQueryVariables
  >(TemperaturePresetDocument, baseOptions);
}
export function useTemperaturePresetLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    TemperaturePresetQuery,
    TemperaturePresetQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    TemperaturePresetQuery,
    TemperaturePresetQueryVariables
  >(TemperaturePresetDocument, baseOptions);
}
export type TemperaturePresetQueryHookResult = ReturnType<
  typeof useTemperaturePresetQuery
>;
export type TemperaturePresetLazyQueryHookResult = ReturnType<
  typeof useTemperaturePresetLazyQuery
>;
export type TemperaturePresetQueryResult = ApolloReactCommon.QueryResult<
  TemperaturePresetQuery,
  TemperaturePresetQueryVariables
>;
export const NewScheduleDocument = gql`
  query NewSchedule($controllerId: ID!) {
    controller(id: $controllerId) {
      ...Screen_Manage_Schedule_Controller
    }
  }
  ${Screen_Manage_Schedule_ControllerFragmentDoc}
`;

/**
 * __useNewScheduleQuery__
 *
 * To run a query within a React component, call `useNewScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewScheduleQuery({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *   },
 * });
 */
export function useNewScheduleQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    NewScheduleQuery,
    NewScheduleQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<NewScheduleQuery, NewScheduleQueryVariables>(
    NewScheduleDocument,
    baseOptions
  );
}
export function useNewScheduleLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    NewScheduleQuery,
    NewScheduleQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    NewScheduleQuery,
    NewScheduleQueryVariables
  >(NewScheduleDocument, baseOptions);
}
export type NewScheduleQueryHookResult = ReturnType<typeof useNewScheduleQuery>;
export type NewScheduleLazyQueryHookResult = ReturnType<
  typeof useNewScheduleLazyQuery
>;
export type NewScheduleQueryResult = ApolloReactCommon.QueryResult<
  NewScheduleQuery,
  NewScheduleQueryVariables
>;
export const ManageScheduleDocument = gql`
  query ManageSchedule($controllerId: ID!, $scheduleEventId: ID!) {
    controller(id: $controllerId) {
      ...Screen_Manage_Schedule_Controller
    }
    scheduleEvent(id: $scheduleEventId) {
      ...ScheduleEventFields
    }
  }
  ${Screen_Manage_Schedule_ControllerFragmentDoc}
  ${ScheduleEventFieldsFragmentDoc}
`;

/**
 * __useManageScheduleQuery__
 *
 * To run a query within a React component, call `useManageScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useManageScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useManageScheduleQuery({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *      scheduleEventId: // value for 'scheduleEventId'
 *   },
 * });
 */
export function useManageScheduleQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ManageScheduleQuery,
    ManageScheduleQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ManageScheduleQuery,
    ManageScheduleQueryVariables
  >(ManageScheduleDocument, baseOptions);
}
export function useManageScheduleLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ManageScheduleQuery,
    ManageScheduleQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ManageScheduleQuery,
    ManageScheduleQueryVariables
  >(ManageScheduleDocument, baseOptions);
}
export type ManageScheduleQueryHookResult = ReturnType<
  typeof useManageScheduleQuery
>;
export type ManageScheduleLazyQueryHookResult = ReturnType<
  typeof useManageScheduleLazyQuery
>;
export type ManageScheduleQueryResult = ApolloReactCommon.QueryResult<
  ManageScheduleQuery,
  ManageScheduleQueryVariables
>;
export const ChangeScheduleEventDocument = gql`
  mutation ChangeScheduleEvent(
    $timeInput: ChangeScheduleEventTimeInput!
    $temperaturePresetInput: ChangeScheduleEventTemperaturePresetInput!
  ) {
    changeScheduleEventTime(input: $timeInput) {
      __typename
      ... on ChangeScheduleEventTimeSuccess {
        scheduleEvent {
          ...ScheduleEventFields
        }
      }
    }
    changeScheduleEventTemperaturePreset(input: $temperaturePresetInput) {
      __typename
      ... on ChangeScheduleEventTemperaturePresetSuccess {
        scheduleEvent {
          ...ScheduleEventFields
        }
      }
    }
  }
  ${ScheduleEventFieldsFragmentDoc}
`;
export type ChangeScheduleEventMutationFn = ApolloReactCommon.MutationFunction<
  ChangeScheduleEventMutation,
  ChangeScheduleEventMutationVariables
>;

/**
 * __useChangeScheduleEventMutation__
 *
 * To run a mutation, you first call `useChangeScheduleEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeScheduleEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeScheduleEventMutation, { data, loading, error }] = useChangeScheduleEventMutation({
 *   variables: {
 *      timeInput: // value for 'timeInput'
 *      temperaturePresetInput: // value for 'temperaturePresetInput'
 *   },
 * });
 */
export function useChangeScheduleEventMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeScheduleEventMutation,
    ChangeScheduleEventMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ChangeScheduleEventMutation,
    ChangeScheduleEventMutationVariables
  >(ChangeScheduleEventDocument, baseOptions);
}
export type ChangeScheduleEventMutationHookResult = ReturnType<
  typeof useChangeScheduleEventMutation
>;
export type ChangeScheduleEventMutationResult = ApolloReactCommon.MutationResult<ChangeScheduleEventMutation>;
export const AddScheduleEventDocument = gql`
  mutation AddScheduleEvent($input: AddScheduleEventInput!) {
    addScheduleEvent(input: $input) {
      __typename
      ... on AddScheduleEventSuccess {
        controller {
          ...Screen_Schedules_Controller
        }
      }
    }
  }
  ${Screen_Schedules_ControllerFragmentDoc}
`;
export type AddScheduleEventMutationFn = ApolloReactCommon.MutationFunction<
  AddScheduleEventMutation,
  AddScheduleEventMutationVariables
>;

/**
 * __useAddScheduleEventMutation__
 *
 * To run a mutation, you first call `useAddScheduleEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddScheduleEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addScheduleEventMutation, { data, loading, error }] = useAddScheduleEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddScheduleEventMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddScheduleEventMutation,
    AddScheduleEventMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AddScheduleEventMutation,
    AddScheduleEventMutationVariables
  >(AddScheduleEventDocument, baseOptions);
}
export type AddScheduleEventMutationHookResult = ReturnType<
  typeof useAddScheduleEventMutation
>;
export type AddScheduleEventMutationResult = ApolloReactCommon.MutationResult<AddScheduleEventMutation>;
export const RemoveScheduleEventDocument = gql`
  mutation RemoveScheduleEvent($input: RemoveScheduleEventInput!) {
    removeScheduleEvent(input: $input) {
      __typename
      ... on RemoveScheduleEventSuccess {
        controller {
          ...Screen_Schedules_Controller
        }
      }
    }
  }
  ${Screen_Schedules_ControllerFragmentDoc}
`;
export type RemoveScheduleEventMutationFn = ApolloReactCommon.MutationFunction<
  RemoveScheduleEventMutation,
  RemoveScheduleEventMutationVariables
>;

/**
 * __useRemoveScheduleEventMutation__
 *
 * To run a mutation, you first call `useRemoveScheduleEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveScheduleEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeScheduleEventMutation, { data, loading, error }] = useRemoveScheduleEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveScheduleEventMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemoveScheduleEventMutation,
    RemoveScheduleEventMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RemoveScheduleEventMutation,
    RemoveScheduleEventMutationVariables
  >(RemoveScheduleEventDocument, baseOptions);
}
export type RemoveScheduleEventMutationHookResult = ReturnType<
  typeof useRemoveScheduleEventMutation
>;
export type RemoveScheduleEventMutationResult = ApolloReactCommon.MutationResult<RemoveScheduleEventMutation>;
export const NewTemperaturePresetDocument = gql`
  query NewTemperaturePreset($locationId: ID!) {
    location(id: $locationId) {
      ...Screen_Manage_Temperature_Preset_Location
    }
  }
  ${Screen_Manage_Temperature_Preset_LocationFragmentDoc}
`;

/**
 * __useNewTemperaturePresetQuery__
 *
 * To run a query within a React component, call `useNewTemperaturePresetQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewTemperaturePresetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewTemperaturePresetQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useNewTemperaturePresetQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    NewTemperaturePresetQuery,
    NewTemperaturePresetQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    NewTemperaturePresetQuery,
    NewTemperaturePresetQueryVariables
  >(NewTemperaturePresetDocument, baseOptions);
}
export function useNewTemperaturePresetLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    NewTemperaturePresetQuery,
    NewTemperaturePresetQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    NewTemperaturePresetQuery,
    NewTemperaturePresetQueryVariables
  >(NewTemperaturePresetDocument, baseOptions);
}
export type NewTemperaturePresetQueryHookResult = ReturnType<
  typeof useNewTemperaturePresetQuery
>;
export type NewTemperaturePresetLazyQueryHookResult = ReturnType<
  typeof useNewTemperaturePresetLazyQuery
>;
export type NewTemperaturePresetQueryResult = ApolloReactCommon.QueryResult<
  NewTemperaturePresetQuery,
  NewTemperaturePresetQueryVariables
>;
export const ManageTemperaturePresetDocument = gql`
  query ManageTemperaturePreset($locationId: ID!, $temperaturePresetId: ID!) {
    location(id: $locationId) {
      ...Screen_Manage_Temperature_Preset_Location
    }
    temperaturePreset(id: $temperaturePresetId) {
      ...TemperaturePresetsFields
    }
  }
  ${Screen_Manage_Temperature_Preset_LocationFragmentDoc}
  ${TemperaturePresetsFieldsFragmentDoc}
`;

/**
 * __useManageTemperaturePresetQuery__
 *
 * To run a query within a React component, call `useManageTemperaturePresetQuery` and pass it any options that fit your needs.
 * When your component renders, `useManageTemperaturePresetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useManageTemperaturePresetQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *      temperaturePresetId: // value for 'temperaturePresetId'
 *   },
 * });
 */
export function useManageTemperaturePresetQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ManageTemperaturePresetQuery,
    ManageTemperaturePresetQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ManageTemperaturePresetQuery,
    ManageTemperaturePresetQueryVariables
  >(ManageTemperaturePresetDocument, baseOptions);
}
export function useManageTemperaturePresetLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ManageTemperaturePresetQuery,
    ManageTemperaturePresetQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ManageTemperaturePresetQuery,
    ManageTemperaturePresetQueryVariables
  >(ManageTemperaturePresetDocument, baseOptions);
}
export type ManageTemperaturePresetQueryHookResult = ReturnType<
  typeof useManageTemperaturePresetQuery
>;
export type ManageTemperaturePresetLazyQueryHookResult = ReturnType<
  typeof useManageTemperaturePresetLazyQuery
>;
export type ManageTemperaturePresetQueryResult = ApolloReactCommon.QueryResult<
  ManageTemperaturePresetQuery,
  ManageTemperaturePresetQueryVariables
>;
export const AddTemperaturePresetDocument = gql`
  mutation AddTemperaturePreset($input: AddTemperaturePresetInput!) {
    addTemperaturePreset(input: $input) {
      __typename
      ... on AddTemperaturePresetSuccess {
        temperaturePreset {
          ...TemperaturePresetsFields
        }
      }
    }
  }
  ${TemperaturePresetsFieldsFragmentDoc}
`;
export type AddTemperaturePresetMutationFn = ApolloReactCommon.MutationFunction<
  AddTemperaturePresetMutation,
  AddTemperaturePresetMutationVariables
>;

/**
 * __useAddTemperaturePresetMutation__
 *
 * To run a mutation, you first call `useAddTemperaturePresetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTemperaturePresetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTemperaturePresetMutation, { data, loading, error }] = useAddTemperaturePresetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddTemperaturePresetMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddTemperaturePresetMutation,
    AddTemperaturePresetMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AddTemperaturePresetMutation,
    AddTemperaturePresetMutationVariables
  >(AddTemperaturePresetDocument, baseOptions);
}
export type AddTemperaturePresetMutationHookResult = ReturnType<
  typeof useAddTemperaturePresetMutation
>;
export type AddTemperaturePresetMutationResult = ApolloReactCommon.MutationResult<AddTemperaturePresetMutation>;
export const ChangeTemperaturePresetDocument = gql`
  mutation ChangeTemperaturePreset(
    $setpointInput: ChangeTemperaturePresetSetpointInput!
    $nameInput: ChangeTemperaturePresetNameInput!
  ) {
    changeTemperaturePresetSetpoint(input: $setpointInput) {
      __typename
      ... on ChangeTemperaturePresetSetpointSuccess {
        temperaturePreset {
          ...TemperaturePresetsFields
        }
      }
    }
    changeTemperaturePresetName(input: $nameInput) {
      __typename
      ... on ChangeTemperaturePresetNameSuccess {
        temperaturePreset {
          ...TemperaturePresetsFields
        }
      }
    }
  }
  ${TemperaturePresetsFieldsFragmentDoc}
`;
export type ChangeTemperaturePresetMutationFn = ApolloReactCommon.MutationFunction<
  ChangeTemperaturePresetMutation,
  ChangeTemperaturePresetMutationVariables
>;

/**
 * __useChangeTemperaturePresetMutation__
 *
 * To run a mutation, you first call `useChangeTemperaturePresetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeTemperaturePresetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeTemperaturePresetMutation, { data, loading, error }] = useChangeTemperaturePresetMutation({
 *   variables: {
 *      setpointInput: // value for 'setpointInput'
 *      nameInput: // value for 'nameInput'
 *   },
 * });
 */
export function useChangeTemperaturePresetMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeTemperaturePresetMutation,
    ChangeTemperaturePresetMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ChangeTemperaturePresetMutation,
    ChangeTemperaturePresetMutationVariables
  >(ChangeTemperaturePresetDocument, baseOptions);
}
export type ChangeTemperaturePresetMutationHookResult = ReturnType<
  typeof useChangeTemperaturePresetMutation
>;
export type ChangeTemperaturePresetMutationResult = ApolloReactCommon.MutationResult<ChangeTemperaturePresetMutation>;
export const RemoveTemperaturePresetDocument = gql`
  mutation RemoveTemperaturePreset($input: RemoveTemperaturePresetInput!) {
    removeTemperaturePreset(input: $input) {
      __typename
      ... on RemoveTemperaturePresetSuccess {
        _
      }
    }
  }
`;
export type RemoveTemperaturePresetMutationFn = ApolloReactCommon.MutationFunction<
  RemoveTemperaturePresetMutation,
  RemoveTemperaturePresetMutationVariables
>;

/**
 * __useRemoveTemperaturePresetMutation__
 *
 * To run a mutation, you first call `useRemoveTemperaturePresetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTemperaturePresetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTemperaturePresetMutation, { data, loading, error }] = useRemoveTemperaturePresetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveTemperaturePresetMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemoveTemperaturePresetMutation,
    RemoveTemperaturePresetMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RemoveTemperaturePresetMutation,
    RemoveTemperaturePresetMutationVariables
  >(RemoveTemperaturePresetDocument, baseOptions);
}
export type RemoveTemperaturePresetMutationHookResult = ReturnType<
  typeof useRemoveTemperaturePresetMutation
>;
export type RemoveTemperaturePresetMutationResult = ApolloReactCommon.MutationResult<RemoveTemperaturePresetMutation>;
export const SchedulesDocument = gql`
  query Schedules($controllerId: ID!) {
    controller(id: $controllerId) {
      ...Screen_Schedules_Controller
    }
  }
  ${Screen_Schedules_ControllerFragmentDoc}
`;

/**
 * __useSchedulesQuery__
 *
 * To run a query within a React component, call `useSchedulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchedulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchedulesQuery({
 *   variables: {
 *      controllerId: // value for 'controllerId'
 *   },
 * });
 */
export function useSchedulesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SchedulesQuery,
    SchedulesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<SchedulesQuery, SchedulesQueryVariables>(
    SchedulesDocument,
    baseOptions
  );
}
export function useSchedulesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SchedulesQuery,
    SchedulesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<SchedulesQuery, SchedulesQueryVariables>(
    SchedulesDocument,
    baseOptions
  );
}
export type SchedulesQueryHookResult = ReturnType<typeof useSchedulesQuery>;
export type SchedulesLazyQueryHookResult = ReturnType<
  typeof useSchedulesLazyQuery
>;
export type SchedulesQueryResult = ApolloReactCommon.QueryResult<
  SchedulesQuery,
  SchedulesQueryVariables
>;
export const ScheduleEventDocument = gql`
  query ScheduleEvent($scheduleEventId: ID!) {
    scheduleEvent(id: $scheduleEventId) {
      ...ScheduleEventFields
    }
  }
  ${ScheduleEventFieldsFragmentDoc}
`;

/**
 * __useScheduleEventQuery__
 *
 * To run a query within a React component, call `useScheduleEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleEventQuery({
 *   variables: {
 *      scheduleEventId: // value for 'scheduleEventId'
 *   },
 * });
 */
export function useScheduleEventQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ScheduleEventQuery,
    ScheduleEventQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ScheduleEventQuery,
    ScheduleEventQueryVariables
  >(ScheduleEventDocument, baseOptions);
}
export function useScheduleEventLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ScheduleEventQuery,
    ScheduleEventQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ScheduleEventQuery,
    ScheduleEventQueryVariables
  >(ScheduleEventDocument, baseOptions);
}
export type ScheduleEventQueryHookResult = ReturnType<
  typeof useScheduleEventQuery
>;
export type ScheduleEventLazyQueryHookResult = ReturnType<
  typeof useScheduleEventLazyQuery
>;
export type ScheduleEventQueryResult = ApolloReactCommon.QueryResult<
  ScheduleEventQuery,
  ScheduleEventQueryVariables
>;
export const SelectFanModeDocument = gql`
  query SelectFanMode($locationId: ID!) {
    location(id: $locationId) {
      ...Screen_Select_Fan_Mode
    }
  }
  ${Screen_Select_Fan_ModeFragmentDoc}
`;

/**
 * __useSelectFanModeQuery__
 *
 * To run a query within a React component, call `useSelectFanModeQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelectFanModeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelectFanModeQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useSelectFanModeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SelectFanModeQuery,
    SelectFanModeQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SelectFanModeQuery,
    SelectFanModeQueryVariables
  >(SelectFanModeDocument, baseOptions);
}
export function useSelectFanModeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SelectFanModeQuery,
    SelectFanModeQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SelectFanModeQuery,
    SelectFanModeQueryVariables
  >(SelectFanModeDocument, baseOptions);
}
export type SelectFanModeQueryHookResult = ReturnType<
  typeof useSelectFanModeQuery
>;
export type SelectFanModeLazyQueryHookResult = ReturnType<
  typeof useSelectFanModeLazyQuery
>;
export type SelectFanModeQueryResult = ApolloReactCommon.QueryResult<
  SelectFanModeQuery,
  SelectFanModeQueryVariables
>;
export const ChangeTemperaturePresetFanModeDocument = gql`
  mutation ChangeTemperaturePresetFanMode(
    $input: ChangeTemperaturePresetFanModeInput!
  ) {
    changeTemperaturePresetFanMode(input: $input) {
      __typename
      ... on ChangeTemperaturePresetFanModeSuccess {
        temperaturePreset {
          ...TemperaturePresetsFields
        }
      }
    }
  }
  ${TemperaturePresetsFieldsFragmentDoc}
`;
export type ChangeTemperaturePresetFanModeMutationFn = ApolloReactCommon.MutationFunction<
  ChangeTemperaturePresetFanModeMutation,
  ChangeTemperaturePresetFanModeMutationVariables
>;

/**
 * __useChangeTemperaturePresetFanModeMutation__
 *
 * To run a mutation, you first call `useChangeTemperaturePresetFanModeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeTemperaturePresetFanModeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeTemperaturePresetFanModeMutation, { data, loading, error }] = useChangeTemperaturePresetFanModeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangeTemperaturePresetFanModeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeTemperaturePresetFanModeMutation,
    ChangeTemperaturePresetFanModeMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ChangeTemperaturePresetFanModeMutation,
    ChangeTemperaturePresetFanModeMutationVariables
  >(ChangeTemperaturePresetFanModeDocument, baseOptions);
}
export type ChangeTemperaturePresetFanModeMutationHookResult = ReturnType<
  typeof useChangeTemperaturePresetFanModeMutation
>;
export type ChangeTemperaturePresetFanModeMutationResult = ApolloReactCommon.MutationResult<ChangeTemperaturePresetFanModeMutation>;
export const SendTokenDocument = gql`
  mutation SendToken($input: SendTokenInput!) {
    sendToken(input: $input) {
      __typename
    }
  }
`;
export type SendTokenMutationFn = ApolloReactCommon.MutationFunction<
  SendTokenMutation,
  SendTokenMutationVariables
>;

/**
 * __useSendTokenMutation__
 *
 * To run a mutation, you first call `useSendTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendTokenMutation, { data, loading, error }] = useSendTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendTokenMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SendTokenMutation,
    SendTokenMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SendTokenMutation,
    SendTokenMutationVariables
  >(SendTokenDocument, baseOptions);
}
export type SendTokenMutationHookResult = ReturnType<
  typeof useSendTokenMutation
>;
export type SendTokenMutationResult = ApolloReactCommon.MutationResult<SendTokenMutation>;
export const SignInDocument = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      __typename
      ... on SignInSuccess {
        accessToken
        refreshToken
        ttl
        user {
          id
        }
      }
    }
  }
`;
export type SignInMutationFn = ApolloReactCommon.MutationFunction<
  SignInMutation,
  SignInMutationVariables
>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignInMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SignInMutation,
    SignInMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<SignInMutation, SignInMutationVariables>(
    SignInDocument,
    baseOptions
  );
}
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = ApolloReactCommon.MutationResult<SignInMutation>;
export const SignUpDocument = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      __typename
    }
  }
`;
export type SignUpMutationFn = ApolloReactCommon.MutationFunction<
  SignUpMutation,
  SignUpMutationVariables
>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SignUpMutation,
    SignUpMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<SignUpMutation, SignUpMutationVariables>(
    SignUpDocument,
    baseOptions
  );
}
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = ApolloReactCommon.MutationResult<SignUpMutation>;
export const BackgroundAwayActiveStatusDocument = gql`
  query BackgroundAwayActiveStatus($locationId: ID!) {
    location(id: $locationId) {
      ...Background_AwayActiveStatus_Location
    }
  }
  ${Background_AwayActiveStatus_LocationFragmentDoc}
`;

/**
 * __useBackgroundAwayActiveStatusQuery__
 *
 * To run a query within a React component, call `useBackgroundAwayActiveStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useBackgroundAwayActiveStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBackgroundAwayActiveStatusQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useBackgroundAwayActiveStatusQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    BackgroundAwayActiveStatusQuery,
    BackgroundAwayActiveStatusQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    BackgroundAwayActiveStatusQuery,
    BackgroundAwayActiveStatusQueryVariables
  >(BackgroundAwayActiveStatusDocument, baseOptions);
}
export function useBackgroundAwayActiveStatusLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    BackgroundAwayActiveStatusQuery,
    BackgroundAwayActiveStatusQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    BackgroundAwayActiveStatusQuery,
    BackgroundAwayActiveStatusQueryVariables
  >(BackgroundAwayActiveStatusDocument, baseOptions);
}
export type BackgroundAwayActiveStatusQueryHookResult = ReturnType<
  typeof useBackgroundAwayActiveStatusQuery
>;
export type BackgroundAwayActiveStatusLazyQueryHookResult = ReturnType<
  typeof useBackgroundAwayActiveStatusLazyQuery
>;
export type BackgroundAwayActiveStatusQueryResult = ApolloReactCommon.QueryResult<
  BackgroundAwayActiveStatusQuery,
  BackgroundAwayActiveStatusQueryVariables
>;
