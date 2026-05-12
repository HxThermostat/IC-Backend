declare module "react-native-androw" {
  import { FC } from "react";
  import { ViewProps } from "react-native";

  export type AndrowProps = ViewProps;
  const Androw: FC<AndrowProps>;
  export default Androw;
}
