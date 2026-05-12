import { Constants } from "react-native-unimodules";

import { version } from "../package.json";

export const nativeVersion = Constants.nativeAppVersion as string;
export const nativeBuild = Constants.nativeBuildVersion as string;
export const appVersion = version;
