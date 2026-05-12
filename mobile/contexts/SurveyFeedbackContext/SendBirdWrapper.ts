import { IMessage } from "react-native-gifted-chat";
import SendBird, { SendBirdInstance } from "sendbird";

import { captureException } from "~/utils/sentry";

import {
  SENDBIRD_CHAT_MODERATOR_USER_ID,
  SENDBIRD_CHAT_MODERATOR_PUBLIC_CHANNEL_URL,
} from "~/config/constants";

/*
Notes:
- Assumption: Only 1 chat connection active at a time.
- Only sending UserMessages (not FileMessage, etc.)
*/

// IMessage is what is expected by GiftedChat
export function convertUserMessage(msg: SendBird.UserMessage): IMessage {
  return {
    _id: msg.messageId,
    text: msg.message,
    createdAt: msg.createdAt,
    user: {
      _id: msg.sender.userId,
      name: msg.sender.nickname,
    },
  };
}

type SendBirdApiAttributes = {
  appId: string;
};

export type SendBirdUserAttributes = {
  userId: string;
  userName: string;
};

type SendBirdConnectOptions = SendBirdUserAttributes & {
  sessionToken: string;
};

type SendBirdWrapperParams = SendBirdApiAttributes;

type SendBirdMessageHandler = (message: IMessage) => void;

type SendBirdMetaDataChangeHandler = (metaData: SendBirdMetaData) => void;

type SendBirdMetaData = {
  [key: string]: string;
};

export class SendBirdWrapper {
  public sb: SendBirdInstance;
  private onMessageHandler: SendBirdMessageHandler | undefined;
  private onMetaDataChangeHandler: SendBirdMetaDataChangeHandler | undefined;
  private surveyChannel: SendBird.GroupChannel | undefined;
  private user: SendBird.User | undefined;
  private metaData: SendBirdMetaData;

  constructor({ appId }: SendBirdWrapperParams) {
    this.sb = new SendBird({ appId });
    this.onMessageHandler = undefined;
    this.onMetaDataChangeHandler = undefined;
    this.surveyChannel = undefined;
    this.user = undefined;
    this.metaData = {};
  }

  onMessage = (handler: SendBirdMessageHandler): void => {
    this.onMessageHandler = handler;
  };

  onMetaDataChanged = (handler: SendBirdMetaDataChangeHandler): void => {
    this.onMetaDataChangeHandler = handler;
  };

  connect = async ({
    userId,
    userName,
    sessionToken,
  }: SendBirdConnectOptions): Promise<void> => {
    if (this.user) {
      return;
    }

    let sbUser: SendBird.User | undefined;
    try {
      sbUser = await this.sb.connect(userId, sessionToken);

      // When first connecting the nickname field is blank, so set it
      if (sbUser.nickname !== userName) {
        await this.setUserName(userName);
      }

      await this.joinPublicChannel();
    } catch (ex) {
      // Reset user and channel handlers on error
      this.user = undefined;
      this.sb.removeChannelHandler("messages");
      this.sb.removeChannelHandler("metaData");

      throw ex;
    }

    this.user = sbUser;
  };

  disconnect = async (): Promise<void> => {
    if (!this.user) {
      return;
    }

    try {
      await this.sb.disconnect();
    } catch (ex) {
      const errorToLog =
        ex instanceof Error
          ? ex
          : new Error("Error disconnecting from SendBird");
      // Silently fail but log the error
      captureException(errorToLog);
    } finally {
      this.user = undefined;
      this.sb.removeChannelHandler("messages");
      this.sb.removeChannelHandler("metaData");
    }
  };

  setUserName = async (userName: string): Promise<void> => {
    await this.sb.updateCurrentUserInfo(userName, "");
  };

  private searchGroupChannels = async (
    name = "Feedback"
  ): Promise<SendBird.GroupChannel | null> => {
    const channelQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
    channelQuery.includeEmpty = true;
    channelQuery.channelNameContainsFilter = name;
    channelQuery.limit = 1;

    const foundChannels = await channelQuery.next();

    if (foundChannels.length > 0) {
      return foundChannels[0];
    }

    return null;
  };

  private createGroupChannel = async (
    { userId }: SendBirdUserAttributes,
    name = "Feedback"
  ): Promise<SendBird.GroupChannel> => {
    const newChannelParams = new this.sb.GroupChannelParams();
    newChannelParams.addUserIds([userId, SENDBIRD_CHAT_MODERATOR_USER_ID]);
    // This persists the 1:1 channel instead of creating it every time
    newChannelParams.isDistinct = true;
    newChannelParams.isPublic = false;
    newChannelParams.isEphemeral = false;
    newChannelParams.isSuper = false;
    newChannelParams.name = name;

    return this.sb.GroupChannel.createChannel(newChannelParams);
  };

  private getSurveyChannel = async (
    userInfo: SendBirdUserAttributes
  ): Promise<SendBird.GroupChannel> => {
    if (this.surveyChannel) {
      return this.surveyChannel;
    }

    // Check if channel between user and moderator yet
    let surveyChannel = await this.searchGroupChannels();
    if (!surveyChannel) {
      // Otherwise create the new channel
      surveyChannel = await this.createGroupChannel(userInfo);
    }

    this.surveyChannel = surveyChannel;

    return this.surveyChannel;
  };

  getPublicChannel = (): Promise<SendBird.OpenChannel> =>
    this.sb.OpenChannel.getChannel(SENDBIRD_CHAT_MODERATOR_PUBLIC_CHANNEL_URL);

  joinPublicChannel = async (): Promise<SendBird.OpenChannel> => {
    const openChannel = await this.getPublicChannel();
    await openChannel.enter();

    // Grab current metadata first
    this.metaData = (await openChannel.getAllMetaData()) as SendBirdMetaData;
    if (this.onMetaDataChangeHandler) {
      this.onMetaDataChangeHandler(this.metaData);
    }

    // Metadata update handling
    const channelHandler = new this.sb.ChannelHandler();
    channelHandler.onMetaDataCreated = (channel, metaData) => {
      if (
        channel.url === SENDBIRD_CHAT_MODERATOR_PUBLIC_CHANNEL_URL &&
        this.onMetaDataChangeHandler
      ) {
        this.metaData = metaData as SendBirdMetaData;
        this.onMetaDataChangeHandler(this.metaData);
      }
    };
    channelHandler.onMetaDataUpdated = (channel, metaData) => {
      if (
        channel.url === SENDBIRD_CHAT_MODERATOR_PUBLIC_CHANNEL_URL &&
        this.onMetaDataChangeHandler
      ) {
        this.metaData = metaData as SendBirdMetaData;
        this.onMetaDataChangeHandler(this.metaData);
      }
    };
    channelHandler.onMetaDataDeleted = (channel, deletedKeys) => {
      if (
        channel.url === SENDBIRD_CHAT_MODERATOR_PUBLIC_CHANNEL_URL &&
        this.onMetaDataChangeHandler
      ) {
        deletedKeys.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(this.metaData, key)) {
            delete this.metaData[key];
          }
        });

        this.onMetaDataChangeHandler(this.metaData);
      }
    };

    this.sb.removeChannelHandler("metaData");
    this.sb.addChannelHandler("metaData", channelHandler);

    return openChannel;
  };

  joinSurveyChannel = async (
    user: SendBirdUserAttributes
  ): Promise<SendBird.GroupChannel> => {
    const surveyChannel = await this.getSurveyChannel(user);

    // Message handling
    const channelHandler = new this.sb.ChannelHandler();
    channelHandler.onMessageReceived = (channel, message) => {
      // Only handle UserMessage type
      if (message.messageType !== "user") return;

      // Only handle our group 1:1 channel messages
      if (channel.url !== surveyChannel.url) return;

      this.onMessageHandler?.(convertUserMessage(message));
    };
    this.sb.removeChannelHandler("messages");
    this.sb.addChannelHandler("messages", channelHandler);

    return surveyChannel;
  };

  getSurveyChannelMessages = async (): Promise<IMessage[]> => {
    if (!this.surveyChannel) return [];

    const prevMessagesQuery = this.surveyChannel?.createPreviousMessageListQuery();
    prevMessagesQuery.limit = 100;
    prevMessagesQuery.reverse = true;
    prevMessagesQuery.includeMetaArray = false;
    prevMessagesQuery.includeReactions = false;

    const prevMessages = await new Promise<SendBird.UserMessage[]>(
      (resolve, reject) => {
        prevMessagesQuery.load((messages, err) => {
          if (err) {
            return reject(err);
          }

          resolve(
            messages.filter(
              (msg): msg is SendBird.UserMessage => msg.messageType === "user"
            )
          );
        });
      }
    );

    return prevMessages.map((msg) => convertUserMessage(msg));
  };

  sendMessage = async (
    user: SendBirdUserAttributes,
    message: string
  ): Promise<IMessage> => {
    const surveyChannel = await this.joinSurveyChannel(user);
    const userMessage = new this.sb.UserMessageParams();
    userMessage.message = message;

    // Have to wrap this sendUserMessage call in a promise because it doesn't
    // return a promise like the other methods in this api
    const sentMessage = await new Promise<SendBird.UserMessage>(
      (resolve, reject) => {
        surveyChannel.sendUserMessage(userMessage, (resultMessage, err) => {
          if (err) {
            return reject(err);
          } else if (resultMessage.messageType !== "user") {
            return reject(
              new Error(
                `Unexpected result message type: ${resultMessage.messageType}`
              )
            );
          }

          // Type casting because we're not sending the other types of messages
          resolve(resultMessage);
        });
      }
    );

    return convertUserMessage(sentMessage);
  };

  setChattingUser = async (userId: string): Promise<void> => {
    if (this.metaData["chatting_user"] === userId) {
      return;
    }

    if (this.metaData["chatting_user"] !== "open") {
      throw new Error("Unable to set chatting_user; not open");
    }

    const openChannel = await this.getPublicChannel();

    this.metaData["chatting_user"] = userId;
    this.metaData = (await openChannel.updateMetaData(
      this.metaData
    )) as SendBirdMetaData;
    if (this.onMetaDataChangeHandler) {
      this.onMetaDataChangeHandler(this.metaData);
    }
  };
}
