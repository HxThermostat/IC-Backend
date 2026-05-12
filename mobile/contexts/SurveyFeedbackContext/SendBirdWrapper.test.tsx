import { SendBirdWrapper } from "./SendBirdWrapper";

jest.mock("sendbird");

const TEST_USER: SendBird.User = {
  userId: "test-user-id",
  nickname: "test@user.com",
  profileUrl: "",
  plainProfileUrl: "",
  metaData: {},
  connectionStatus: "",
  lastSeenAt: "",
  isActive: true,
  requireAuth: true,
  friendDiscoveryKey: null,
  friendName: null,
  preferredLanguages: ["en-US"],
  createMetaData: jest.fn(),
  deleteAllMetaData: jest.fn(),
  deleteMetaData: jest.fn(),
  getOriginalProfileUrl: jest.fn(),
  serialize: jest.fn(),
  updateMetaData: jest.fn(),
};

const TEST_PUBLIC_CHANNEL = {
  participantCount: 1,
  operators: [],

  enter: jest.fn(),
  sendUserMessage: jest.fn(),
};

class TestUserMessageParams {
  public message: string;

  constructor() {
    this.message = "";
  }
}

describe("SendBirdWrapper", () => {
  afterEach(() => {
    TEST_PUBLIC_CHANNEL.enter.mockClear();
    TEST_PUBLIC_CHANNEL.sendUserMessage.mockClear();
  });

  it("instantiates without error", () => {
    expect(() => new SendBirdWrapper({ appId: "test-1234" })).not.toThrow();
  });

  it("connects", async () => {
    const wrapper = new SendBirdWrapper({ appId: "test-1234" });

    const connect = jest.fn().mockReturnValueOnce(Promise.resolve(TEST_USER));
    const joinPublicChannel = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(TEST_PUBLIC_CHANNEL));

    wrapper.sb.connect = connect;
    wrapper.joinPublicChannel = joinPublicChannel;

    await wrapper.connect({
      userId: "test-user-id",
      userName: "test@user.com",
      sessionToken: "test-token-1234",
    });

    expect(connect).toHaveBeenCalledTimes(1);
    expect(joinPublicChannel).toHaveBeenCalledTimes(1);
  });

  it("sends messages", async () => {
    const wrapper = new SendBirdWrapper({ appId: "test-1234" });

    TEST_PUBLIC_CHANNEL.sendUserMessage.mockImplementationOnce(
      (
        _userMsg,
        callback: (msg: SendBird.UserMessage, err: Error | null) => void
      ) =>
        callback(
          {
            messageId: 1234,
            messageType: "user",
            message: "Test message!",
            createdAt: Date.now() - 2000,
            sender: {
              ...TEST_USER,
            },
          } as SendBird.UserMessage,
          null
        )
    );

    wrapper.joinSurveyChannel = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(TEST_PUBLIC_CHANNEL));
    // For some reason this class is not present on the sendbird export after jest.mock("sendbird")
    wrapper.sb.UserMessageParams = TestUserMessageParams as SendBird.UserMessageParams;

    await wrapper.sendMessage(
      { userId: "test-user-id", userName: "test-user.com" },
      "Test message!"
    );

    expect(TEST_PUBLIC_CHANNEL.sendUserMessage).toHaveBeenCalledTimes(1);
  });

  // It's getting hard to stub out the sendbird module because of the sub classing structure
  // so I'm giong to pause on adding more tests.
});
