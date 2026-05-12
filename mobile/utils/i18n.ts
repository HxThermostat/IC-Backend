import i18n from "~/i18n";

const defaultScope = "Screens.Authenticated.Home";

export function translateFanSpeedName(
  speedName: string,
  scope: string = defaultScope
): string {
  switch (speedName) {
    case "LOW":
      return i18n.t("fanSpeed.low", { scope });
    case "MEDIUM":
      return i18n.t("fanSpeed.medium", { scope });
    case "HIGH":
      return i18n.t("fanSpeed.high", { scope });
    default:
      return "";
  }
}
