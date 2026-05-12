import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";

import { withBackground } from "~/components/Background";
import { BaseListItem, Section, SectionList } from "~/components/Lists";
import { useFeatureFlags, useAuth } from "~/contexts";

import {
  GoBack,
  useManageAccountQuery,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import i18n from "~/i18n";

const scope = "Screens.Authenticated.SettingsNavigator.ManageAccount";

export type ManageAccountProps = WithQueryDataProps<
  typeof useManageAccountQuery
>;

function ManageAccount({ data }: ManageAccountProps): JSX.Element {
  const { me } = data;
  if (!me) throw new GoBack();

  const { removeAccount, signOut } = useAuth();

  const navigation = useNavigation();

  const { handleEnabledVariant } = useFeatureFlags();

  function handleItemPress(item: BaseListItem): void {
    if (item.navigate) {
      navigation.navigate(item.navigate.name, item.navigate.params);
    }
    if (item.onPress) {
      item.onPress();
    }
  }

  const items = useMemo<Section[]>(() => {
    const mainSection: BaseListItem[] = [];

    mainSection.push({
      title: i18n.t("email", { scope }),
      subtitle: me.email,
    });
    handleEnabledVariant("accountSharing", "QR_CODE", () => {
      mainSection.push({
        title: i18n.t("accountSharing", { scope }),
        navigate: {
          name: "AccountSharing",
        },
        displayChevronIOS: true,
      });
    });

    mainSection.push({
      title: i18n.t("signOut", { scope }),
      onPress: () => signOut(true),
    });

    return [
      {
        data: mainSection,
      },
      {
        data: [
          {
            title: i18n.t("removeAccount", { scope }),
            destructive: true,
            onPress: () => removeAccount(true),
          },
        ],
      },
    ];
  }, [handleEnabledVariant, me.email, removeAccount, signOut]);

  return (
    <SectionList
      alwaysBounceVertical={false}
      sections={items}
      handleItemPress={handleItemPress}
    />
  );
}

export default withBackground(
  withQueryData(useManageAccountQuery)(ManageAccount)
);
