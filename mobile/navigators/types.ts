import { AuthenticatedNavigatorRouteList } from "./AuthenticatedNavigator";
import { SettingsNavigatorRouteList } from "./SettingsNavigator";

type RouteParamsOf<RouteList> = RouteList[keyof RouteList];
type ScreenNamesOf<RouteList> = keyof RouteList;

export type SettingsNames = ScreenNamesOf<SettingsNavigatorRouteList>;
export type SettingsParams = RouteParamsOf<SettingsNavigatorRouteList>;

export type AuthenticatedNames = ScreenNamesOf<AuthenticatedNavigatorRouteList>;
export type AuthenticatedParams = RouteParamsOf<AuthenticatedNavigatorRouteList>;

export type AuthenticatedAppScreenNames = SettingsNames | AuthenticatedNames;
export type AuthenticatedAppScreenParams = SettingsParams | AuthenticatedParams;
