import React, { ComponentProps } from "react";

import Box, { VSpacer } from "~/components/Box";
import Cloak from "~/components/Cloak";
import ProgressDots from "~/components/ProgressDots";
import Screen from "~/components/Screen";
import Text from "~/components/Text";
import { Button } from "~/components/Touchables";

import i18n from "~/i18n";

interface OnboardingProps {
  button?: ComponentProps<typeof Button>;
  caption?: string;
  progress?: ComponentProps<typeof ProgressDots>;
  title: string;
  Content: JSX.Element;
  Footer?: JSX.Element;
  Icon?: JSX.Element;
}

export default function Onboarding({
  button,
  caption,
  progress,
  title,
  Content,
  Footer,
  Icon,
}: OnboardingProps): JSX.Element {
  return (
    <Screen
      paddingHorizontal="z"
      maxWidth={440}
      minWidth={260}
      width={"65%"}
      alignSelf="center"
    >
      <Box flexGrow={2}>
        <VSpacer />
        {Icon}
        <Text textAlign="center" variant="largeTitle" marginBottom="xxl">
          {title}
        </Text>
        {Content}
        <VSpacer />
      </Box>

      <Box flexGrow={1} justifyContent="flex-end">
        {button ? (
          <Box width={200} alignSelf="center">
            <Button text={i18n.t("Common.continue")} {...button} />
            <Text
              ellipsizeMode="clip"
              marginTop="m"
              numberOfLines={2}
              textAlign="center"
              variant="onboardingHelper"
            >
              {caption ?? ""}
              {" \n \n \n"}
            </Text>
          </Box>
        ) : null}
        <Cloak visible={progress != null}>
          {({ opacity }) => (
            <Box opacity={opacity}>
              <ProgressDots dots={1} activeIndex={0} {...progress} />
            </Box>
          )}
        </Cloak>
        {Footer}
      </Box>
    </Screen>
  );
}
