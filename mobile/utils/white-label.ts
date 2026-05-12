import { NativeModules } from "react-native";

import { ColorPalette } from "~/theme/color";

const { WhiteLabelModule: RNWhiteLabelModule } = NativeModules;

interface WhiteLabelModuleConstants {
  GRAPH_URL: string;
  IOS_STORE_ID: string;
  ANDROID_STORE_ID: string;
  URI_SCHEME: string;
  LIGHT_COLORS: Partial<ColorPalette>;
  DARK_COLORS: Partial<ColorPalette>;
  SENDBIRD_CHAT_MODERATOR_PUBLIC_CHANNEL_URL: string;
  SENDBIRD_CHAT_MODERATOR_USER_ID: string;
}

interface WhiteLabelModule {
  getConstants(): WhiteLabelModuleConstants;
}

const WhiteLabelModule = RNWhiteLabelModule as WhiteLabelModule;
const NativeConstants = WhiteLabelModule.getConstants();

const WhiteLabelModuleConstants = {
  ...NativeConstants,
  LIGHT_COLORS: NativeConstants.LIGHT_COLORS ?? {},
  DARK_COLORS: NativeConstants.DARK_COLORS ?? {},
};

export default WhiteLabelModuleConstants;
