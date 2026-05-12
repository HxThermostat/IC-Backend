import React, { useState } from "react";

import { useApolloClient } from "@apollo/client";

import { useAuth } from "~/contexts";

import { buildLink } from "~/graph/links";

import { GRAPH_URL } from "~/config/constants";

import i18n from "~/i18n";

import SingleInputScreen from "../SingleInputScreen";

const scope = "Screens.Authenticated.SettingsNavigator.ChangeGraphUrl";

function ChangeGraphUrl(): JSX.Element {
  const { signOut } = useAuth();
  const client = useApolloClient();

  // This defaults to the url that's set in the app config, but if we change it here and then leave/return to this screen, it's technically incorrect, as there doesn't seem to be a way to directly read from the client what the current URL is set to...? So just be careful I guess!
  const [graphUrl, setGraphUrl] = useState(GRAPH_URL);

  function handlePressSave(): Promise<void> {
    if (graphUrl) {
      client.setLink(
        buildLink(async () => {
          await signOut();
        }, graphUrl)
      );
    }
    return Promise.resolve();
  }

  return (
    <SingleInputScreen
      allowEmptySubmission={false}
      value={graphUrl}
      label={i18n.t("label", { scope })}
      onChangeText={(value: string) => setGraphUrl(value)}
      handleSave={handlePressSave}
    />
  );
}

export default ChangeGraphUrl;
