import type { ViewStyle } from "react-native";

const variants: Record<"defaults" | "disabled" | "gradient", ViewStyle> = {
  defaults: {
    width: 65,
    height: 65,
    borderRadius: 65,
    backgroundColor: "stepperButton",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  disabled: {
    elevation: 0,
    // Because of how the Touchable styles are applied this gets
    // swallowed. I'm leaving this here to help close the loop between
    // this style and the disabledStyle we apply in the
    // <StepperButton /> component
    // opacity: 1,
    shadowOpacity: 0,
  },
  gradient: {
    elevation: 0,
    backgroundColor: "stepperButtonOnGradientBackground",
  },
};

export default variants;
