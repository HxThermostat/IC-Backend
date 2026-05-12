import { AuthenticationError } from "apollo-server-errors";
import {
  AylaToken,
  changePassword,
  checkEmail,
  confirmAccount,
  loadKsid,
  profile,
  refreshToken,
  removeAccount,
  resetPassword,
  sendToken,
  signIn,
  signUp,
  storeKsid,
} from "ayla-client";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  SignInFeature,
} from "../schema";

import { template } from "../intellicomfort";

import {
  createAccessToken,
  createRefreshToken,
  decodeRefreshToken,
  generateKsid,
  generatePassword,
} from "../utils/auth";
import { ResolverNotSupported } from "./errors";

export const resolver: Resolvers = {
  FeatureMap: {
    signIn: () => SignInFeature.Token,
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  checkEmail: async (_, { input: { email } }) => {
    const available = await checkEmail({ email });

    return {
      __typename: "CheckEmailResult",
      available,
    };
  },
  sendToken: async (_, { input: { email } }) => {
    try {
      await sendToken({ email, ...template.signIn(email) });
    } catch {
      return {
        __typename: "EmailInvalid",
      };
    }

    return {
      __typename: "SendTokenSuccess",
    };
  },
  signIn: async (_, { input: { email, token } }) => {
    const freshKsid = generateKsid();
    const freshPassword = generatePassword({ email, ksid: freshKsid });

    let aylaToken: AylaToken;
    let ksid = freshKsid;
    let password: string | undefined;

    if (token.startsWith("#")) {
      password = token.substring(1);
    }

    if (password) {
      // If we got a valid password, short-circuit the sign in This
      // means the token won't have a valid KSID, but it's helpful to
      // testing
      try {
        aylaToken = await signIn({ email, password });

        const { id: userId } = await profile({
          accessToken: aylaToken.accessToken,
        });

        return {
          __typename: "SignInSuccess",
          accessToken: createAccessToken(
            { userId, accessToken: aylaToken.accessToken },
            `${aylaToken.expiresIn}s`
          ),
          refreshToken: createRefreshToken(
            { email, ksid: "", refreshToken: aylaToken.refreshToken, userId },
            "1y"
          ),
          ttl: aylaToken.expiresIn,
          user: {
            id: userId,
            accessToken: aylaToken.accessToken,
          },
        };
      } catch {
        return {
          __typename: "TokenInvalid",
        };
      }
    } else {
      password = freshPassword;

      try {
        aylaToken = await resetPassword({
          email,
          password,
          token: token.slice(0, 8),
        });
      } catch {
        try {
          // This will be the same password that was set when the
          // account was created
          password = generatePassword({ email });
          aylaToken = await confirmAccount({
            email,
            password,
            token: token.slice(-8),
          });
        } catch {
          return {
            __typename: "TokenInvalid",
          };
        }
      }
    }

    const { accessToken } = aylaToken;

    try {
      const currentKsid = await loadKsid({ accessToken });

      if (currentKsid != null) {
        ksid = currentKsid;
      } else {
        await storeKsid({ ksid, accessToken });
      }
    } catch {
      // TODO(nleach): Capture in Sentry
    }

    try {
      const { id: userId, email } = await profile({ accessToken });
      const newPassword = generatePassword({ email, ksid });

      if (password !== newPassword) {
        // aylaToken = await Promise.race([
        //   changePassword({
        //     email,
        //     passwordCurrent: password,
        //     passwordNew: newPassword,
        //     accessToken,
        //   }),
        //   new Promise<AylaToken>((resolve) =>
        //     setTimeout(() => resolve(aylaToken), 3000)
        //   ),
        // ]);
        aylaToken = await changePassword({
          email,
          passwordCurrent: password,
          passwordNew: newPassword,
          accessToken,
        });
      }

      return {
        __typename: "SignInSuccess",
        accessToken: createAccessToken(
          { userId, accessToken: aylaToken.accessToken },
          `${aylaToken.expiresIn}s`
        ),
        refreshToken: createRefreshToken(
          { email, ksid, refreshToken: aylaToken.refreshToken, userId },
          "1y"
        ),
        ttl: aylaToken.expiresIn,
        user: {
          id: userId,
          accessToken: aylaToken.accessToken,
        },
      };
    } catch {
      return {
        __typename: "TokenInvalid",
      };
    }
  },
  signUp: async (_, { input: { email, firstName, lastName } }) => {
    const password = generatePassword({ email });
    try {
      await signUp({
        email,
        password,
        firstName,
        lastName,
        ...template.signIn(email),
      });

      return {
        __typename: "SignUpSuccess",
      };
    } catch {
      return {
        __typename: "EmailInvalid",
      };
    }
  },
  refreshToken: async (_, { input: { token: kraftfulRefreshToken } }) => {
    try {
      const {
        email,
        ksid,
        refreshToken: aylaRefreshToken,
        userId,
      } = decodeRefreshToken(kraftfulRefreshToken);

      let newToken: AylaToken;
      try {
        newToken = await refreshToken({ token: aylaRefreshToken });
      } catch {
        newToken = await signIn({
          email,
          password: generatePassword({ email, ksid }),
        });
      }

      return {
        __typename: "RefreshTokenSuccess",
        accessToken: createAccessToken(
          {
            userId,
            accessToken: newToken.accessToken,
          },
          `${newToken.expiresIn}s`
        ),
        refreshToken: createRefreshToken(
          {
            email,
            ksid,
            refreshToken: newToken.refreshToken,
            userId,
          },
          "1y"
        ),
        ttl: newToken.expiresIn,
      };
    } catch {
      return {
        __typename: "TokenInvalid",
      };
    }
  },
  removeAccount: async (_root, _input, { user }) => {
    if (!user) throw new AuthenticationError("Must be logged in");

    await removeAccount({ accessToken: user.accessToken });

    return {
      __typename: "RemoveAccountSuccess",
    };
  },
  generateAccountSharingQrCode: ResolverNotSupported(),
};
