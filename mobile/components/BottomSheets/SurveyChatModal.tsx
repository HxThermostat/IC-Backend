import React, { useState, useEffect, useMemo, useRef } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

import BottomSheetModal, {
  BottomSheetModalRef,
} from "~/components/BottomSheetModal";
import Box from "~/components/Box";
import Text from "~/components/Text";

import i18n from "~/i18n";

import {
  WithQueryDataProps,
  withQueryData,
  useSurveyChatModalQuery,
  Maybe,
} from "~/graph";

import { useSurveyFeedbackChat } from "~/hooks/useSurveyFeedbackChat";
import { saveToAsyncStorage } from "~/utils/storage";

interface SurveyMessagingProps {
  userId: string;
  userName: string;
}

const scope = "Screens.Authenticated.Home";

function makeSystemMessage(earliestDate: number): IMessage {
  const exactDate = new Date(earliestDate);
  // Beginning of the day
  const createdAt = new Date(
    exactDate.getFullYear(),
    exactDate.getMonth(),
    exactDate.getDate()
  );
  return {
    _id: 1,
    createdAt,
    system: true,
    text: i18n.t("survey.chat.intro", { scope }),
    user: {
      _id: 1,
      name: "System",
    },
  };
}

function SurveyMessaging({
  userId,
  userName,
}: SurveyMessagingProps): JSX.Element {
  const {
    connecting,
    connected,
    connectAndLoadMessages,
    messages,
    sendMessage,
  } = useSurveyFeedbackChat({
    userId,
    userName,
  });

  // Memoize this to prevent GiftedChat re-renders
  const user = useMemo(
    () => ({
      _id: userId,
      name: userName,
    }),
    [userId, userName]
  );

  // Grab a ref to GiftedChat so we can focus the keyboard immediately
  const chatRef = useRef<GiftedChat<IMessage>>(null);

  useEffect(() => {
    if (!connected && !connecting) {
      void connectAndLoadMessages();
      chatRef.current?.focusTextInput();
    }
  }, [connected, connectAndLoadMessages, connecting]);

  const onMessageSend = async (messages: IMessage[]): Promise<void> => {
    for (let i = 0; i < messages.length; i++) {
      await sendMessage(messages[i].text);
    }
    void saveToAsyncStorage(
      "last_survey_response_at",
      new Date().toISOString()
    );
  };

  const earliestMessageTime = useMemo(() => {
    return messages.reduce((earliest, msg) => {
      const msgTime =
        msg.createdAt instanceof Date ? msg.createdAt.getTime() : msg.createdAt;
      if (msgTime < earliest) {
        earliest = msgTime;
      }

      return earliest;
    }, Date.now());
  }, [messages]);

  const displayedMessages = GiftedChat.append(
    [makeSystemMessage(earliestMessageTime)],
    messages
  );

  return (
    <Box paddingHorizontal="l" height="100%" paddingBottom="xl">
      <Text marginBottom="s" variant="modalHeader">
        {i18n.t("survey.chat.title", { scope })}
      </Text>
      <Box flexGrow={1}>
        <GiftedChat
          ref={chatRef}
          messages={displayedMessages}
          onSend={onMessageSend}
          user={user}
        />
      </Box>
    </Box>
  );
}

type SurveyChatModalProps = {
  forwardedRef: BottomSheetModalRef;
} & WithQueryDataProps<typeof useSurveyChatModalQuery>;

const SurveyChatModal = (props: SurveyChatModalProps): Maybe<JSX.Element> => {
  const {
    data: { me },
    forwardedRef,
  } = props;
  const [snapPoints] = useState<Array<number | string>>(["100%"]);

  if (!me) {
    return null;
  }

  return (
    <BottomSheetModal
      ref={forwardedRef}
      index={0}
      snapPoints={snapPoints}
      backdrop={true}
    >
      <SurveyMessaging userId={me.id} userName={me.email} />
    </BottomSheetModal>
  );
};

export default withQueryData(useSurveyChatModalQuery, {
  options: { fetchPolicy: "cache-and-network" },
})(SurveyChatModal);
