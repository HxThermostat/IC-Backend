import { useCallback, useState, useMemo } from "react";
import { IMessage, GiftedChat } from "react-native-gifted-chat";
import { SendBirdUserAttributes, useSurveyFeedback } from "~/contexts";

export type UseSurveyFeedbackChatOptions = SendBirdUserAttributes;

export type UseSurveyFeedbackChatResult = {
  connecting: boolean;
  connected: boolean;
  connect: () => Promise<void>;
  connectAndLoadMessages: () => Promise<void>;
  disconnect: () => Promise<void>;
  messages: IMessage[];
  loadMessages: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  isChatAvailable: boolean;
  sessionToken: string | undefined;
};

export type UseSurveyFeedbackChatConnectOptions = {
  sessionToken: string;
};

export const useSurveyFeedbackChat = ({
  userId,
  userName,
}: UseSurveyFeedbackChatOptions): UseSurveyFeedbackChatResult => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isChatAvailable, setIsChatAvailable] = useState(false);

  const user: SendBirdUserAttributes = useMemo(() => ({ userId, userName }), [
    userId,
    userName,
  ]);

  const { sendbird: sb, sessionToken } = useSurveyFeedback();
  sb.onMessage(
    useCallback(
      (message) => {
        setMessages(GiftedChat.append(messages, [message]));
      },
      [messages, setMessages]
    )
  );
  sb.onMetaDataChanged(
    useCallback(
      ({ chatting_user }) => {
        setIsChatAvailable(
          chatting_user === "open" || chatting_user === userId
        );
      },
      [setIsChatAvailable, userId]
    )
  );

  const connect = useCallback(
    async function connect() {
      if (sessionToken) {
        await sb.connect({ ...user, sessionToken });
        await sb.joinSurveyChannel(user);
      }
    },
    [sessionToken, sb, user]
  );

  const disconnect = useCallback(async () => {
    await sb.disconnect();
  }, [sb]);

  const loadMessages = useCallback(
    async function loadMessages() {
      const channelMessages = await sb.getSurveyChannelMessages();
      setMessages(GiftedChat.append(messages, channelMessages));
    },
    [sb, messages, setMessages]
  );

  const connectAndLoadMessages = useCallback(async () => {
    if (!sessionToken) return;

    await connect();
    await loadMessages();
  }, [sessionToken, connect, loadMessages]);

  const sendMessage = useCallback(
    async (message: string) => {
      await sb.setChattingUser(user.userId);
      const newMessage = await sb.sendMessage(user, message);
      setMessages(GiftedChat.append(messages, [newMessage]));
    },
    [sb, user, messages, setMessages]
  );

  // These exposed functions have state setters wrapped around the connecting logic
  const exposedConnect = useCallback(async () => {
    if (!sessionToken) return;

    setConnecting(true);
    await connect();
    setConnected(true);
    setConnecting(false);
  }, [sessionToken, connect, setConnected, setConnecting]);

  const exposedConnectAndLoad = useCallback(async () => {
    if (!sessionToken) return;

    setConnecting(true);
    await connectAndLoadMessages();
    setConnected(true);
    setConnecting(false);
  }, [sessionToken, connectAndLoadMessages, setConnecting, setConnected]);

  const exposedDisconnect = useCallback(async () => {
    await disconnect();
    setConnecting(false);
    setConnected(false);
  }, [disconnect, setConnecting, setConnected]);

  return {
    connecting,
    connected,
    connect: exposedConnect,
    connectAndLoadMessages: exposedConnectAndLoad,
    disconnect: exposedDisconnect,
    messages,
    loadMessages,
    sendMessage,
    sessionToken,
    isChatAvailable,
  };
};
