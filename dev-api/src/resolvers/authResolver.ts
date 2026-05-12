import { AuthenticationError } from "apollo-server-express";

import qrcode from "qrcode";

import {
  addUser,
  findUserByEmail,
  findUserById,
  removeUser,
} from "../fixtures";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  SignInFeature,
  AccountSharingFeature,
} from "../schema";

import { randSleep } from "../utils";
import {
  createAccessToken,
  createRefreshToken,
  decodeRefreshToken,
} from "../utils/auth";

export const resolver: Resolvers = {
  AccountSharingQrCode: {
    data: ({ data }) => data.toString("base64"),
    dataUrl: ({ data, mime }) =>
      `data:${mime};base64,${data.toString("base64")}`,
    mimeType: ({ mime }) => mime,
    ttl: () => 5 * 60 * 1000,
  },
  FeatureMap: {
    accountSharing: () => AccountSharingFeature.QrCode,
    signIn: () => SignInFeature.Token,
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  checkEmail: async (_, { input: { email } }) => {
    await randSleep(100, 2000);

    return {
      __typename: "CheckEmailResult",
      available: !(await findUserByEmail(email)),
    };
  },
  sendToken: async (_, { input: { email } }) => {
    await randSleep(100, 2000);

    const user = await findUserByEmail(email);

    if (!user) {
      return {
        __typename: "EmailInvalid",
      };
    }

    return {
      __typename: "SendTokenSuccess",
    };
  },

  signIn: async (_, { input: { email, token } }) => {
    await randSleep(100, 2000);

    const user = await findUserByEmail(email);

    if (!user) {
      return {
        __typename: "EmailInvalid",
      };
    }

    if (user.token !== token) {
      return {
        __typename: "TokenInvalid",
      };
    }

    const ttl = 24 * 60 * 60;

    return {
      __typename: "SignInSuccess",
      user,
      accessToken: createAccessToken(
        {
          userId: user.id,
        },
        `${ttl}s`
      ),
      refreshToken: createRefreshToken(
        {
          userId: user.id,
        },
        "1y"
      ),
      ttl,
    };
  },
  signUp: async (_, { input: { email } }) => {
    try {
      await randSleep(100, 2000);

      const emailTaken = !!(await findUserByEmail(email));
      if (emailTaken) {
        // todo handle errors for real
        return {
          __typename: "EmailTaken",
          message: "This email already exists",
        };
      } else {
        await addUser({ email, token: "abcd1234" });
        return {
          __typename: "SignUpSuccess",
        };
      }
    } catch (e) {
      // todo handle errors for real
      return {
        __typename: "EmailInvalid",
      };
    }
  },
  refreshToken: async (_, { input: { token } }) => {
    try {
      const payload = decodeRefreshToken(token);

      await randSleep(100, 2000);

      const ttl = 24 * 60 * 60;

      return {
        __typename: "RefreshTokenSuccess",
        accessToken: createAccessToken(payload, `${ttl}s`),
        refreshToken: createRefreshToken(payload, "1y"),
        ttl,
      };
    } catch {
      return {
        __typename: "TokenInvalid",
      };
    }
  },
  removeAccount: (_root, _input, { user }) => {
    if (!user) throw new AuthenticationError("Must be logged in");

    void removeUser(user.id);

    return {
      __typename: "RemoveAccountSuccess",
    };
  },
  generateAccountSharingQrCode: async (_root, { input: { size } }, ctx) => {
    const user = await (ctx.user ? findUserById(ctx.user.id) : undefined);

    if (!user) throw new AuthenticationError("Must be logged in");

    const code = await qrcode.toBuffer(
      `https://klimate.kraftful.app/signIn/${user.email}/${user.token}`,
      {
        width: size,
        margin: 0,
        color: {
          dark: "#000000FF",
          light: "#FFFFFF00",
        },
      }
    );

    return {
      __typename: "GenerateAccountSharingQrCodeSuccess",
      code: {
        data: code,
        mime: "image/png",
      },
    };
  },
};
