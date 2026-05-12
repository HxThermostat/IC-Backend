import got from "got";

import { RequestSurveySessionResult } from "../../schema";

import { SENDBIRD_APP_ID, SENDBIRD_API_TOKEN } from "../../config";

interface SendBirdUserResponse {
  user_id: string;
  nickname: string;
}

interface SendBirdSessionToken {
  token: string;
  expires_at: number;
}

const SENDBIRD_API_URL_BASE = `https://api-${SENDBIRD_APP_ID}.sendbird.com/v3/`;

export const SENDBIRD_API_DEFAULTS = {
  prefixUrl: SENDBIRD_API_URL_BASE,
  headers: {
    "Content-Type": "application/json; charset=utf8",
    "Api-Token": SENDBIRD_API_TOKEN,
  },
};

export const sendbirdClient = got.extend({
  ...SENDBIRD_API_DEFAULTS,
});

const checkIfUserExists = async (
  userId: string
): Promise<SendBirdUserResponse | null> => {
  const userFindResponse: SendBirdUserResponse = await sendbirdClient
    // https://sendbird.com/docs/chat/v3/platform-api/guides/user#2-create-a-user-3-http-request
    .get(`users/${userId}`)
    .json();

  if (!userFindResponse) {
    throw new Error("Invalid find response");
  }

  if (!userFindResponse.user_id || !userFindResponse.nickname) {
    throw new Error("Invalid find response fields");
  }

  if (userFindResponse.user_id !== userId) {
    throw new Error(
      `Invalid find response user_id: ${userFindResponse.user_id}`
    );
  }

  return userFindResponse;
};

const findOrCreateUser = async (
  userId: string,
  userName: string
): Promise<SendBirdUserResponse> => {
  const foundUser = await checkIfUserExists(userId);

  if (foundUser) return foundUser;

  // Create the user if necessary
  const userCreateResponse: SendBirdUserResponse = await sendbirdClient
    .post(
      // https://sendbird.com/docs/chat/v3/platform-api/guides/user#2-create-a-user-3-http-request
      "users",
      {
        json: {
          user_id: userId,
          nickname: userName,
          profile_url: "",
        },
      }
    )
    .json();

  if (!userCreateResponse) {
    throw new Error("Invalid create response");
  }

  if (!userCreateResponse.user_id || !userCreateResponse.nickname) {
    throw new Error("Invalid create response fields");
  }

  if (userCreateResponse.user_id !== userId) {
    throw new Error(
      `Invalid create response user_id: ${userCreateResponse.user_id}`
    );
  }

  return userCreateResponse;
};

export const createUserSession = async (
  userId: string,
  userName: string
): Promise<RequestSurveySessionResult> => {
  await findOrCreateUser(userId, userName);

  // Create the session token
  const userTokenResponse: SendBirdSessionToken = await sendbirdClient
    .post(
      // https://sendbird.com/docs/chat/v3/platform-api/guides/user#2-issue-a-session-token-3-http-request
      `users/${userId}/token`,
      {
        json: {
          user_id: userId,
        },
      }
    )
    .json();

  if (!userTokenResponse) {
    throw new Error("Invalid token response");
  }

  if (!userTokenResponse.token) {
    throw new Error("Invalid token response; token");
  }

  if (
    !userTokenResponse.expires_at ||
    !Number.isInteger(userTokenResponse.expires_at)
  ) {
    throw new Error("Invalid token response; expires_at");
  }

  return {
    userId,
    userName,
    sessionToken: userTokenResponse.token,
    sessionExpiresAt: new Date(userTokenResponse.expires_at).toISOString(),
  };
};
