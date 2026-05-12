import React, { useCallback, useMemo } from "react";

import { withBackground } from "~/components/Background";
import Box from "~/components/Box";
import { BaseListItem, Section, SectionList } from "~/components/Lists";
import Text from "~/components/Text";

import {
  GoBack,
  useSupportContactQuery,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import i18n from "~/i18n";

import { attemptToOpenURL } from "~/utils/linking";

const scope = "Screens.Authenticated.SettingsNavigator.Support";

function Footer(): JSX.Element {
  return (
    <Box>
      <Text marginHorizontal="m" variant="body" marginBottom="l">
        {i18n.t("contactDealer", { scope })}
      </Text>
    </Box>
  );
}

type SupportProps = WithQueryDataProps<typeof useSupportContactQuery>;

function Support({
  data: {
    manufacturer: { support },
  },
}: SupportProps): JSX.Element {
  if (!support) throw new GoBack();

  const { email, phone, website } = support;

  const handleItemPress = useCallback(
    (item: BaseListItem): void => item.onPress?.(),
    []
  );

  const sections = useMemo<Section[]>(() => {
    const section: Section = {
      title: i18n.t("manufacturerSupport", { scope }),
      data: [],
    };

    if (email != null) {
      section.data.push({
        title: i18n.t("email", { scope }),
        subtitle: email,
        subtitleSelectable: true,
        onPress: () => {
          attemptToOpenURL(`mailto:${email}`);
        },
      });
    }

    if (phone) {
      section.data.push({
        title: i18n.t("phone", { scope }),
        subtitle: phone,
        subtitleSelectable: true,
        onPress: () => {
          attemptToOpenURL(`tel:${phone}`);
        },
      });
    }

    if (website) {
      section.data.push({
        title: i18n.t("web", { scope }),
        subtitle: website,
        subtitleSelectable: true,
        onPress: () => {
          attemptToOpenURL(website);
        },
      });
    }

    return [section];
  }, [email, phone, website]);

  return (
    <SectionList
      alwaysBounceVertical={false}
      sections={sections}
      handleItemPress={handleItemPress}
      ListFooterComponent={Footer}
    />
  );
}

export default withBackground(withQueryData(useSupportContactQuery)(Support));
