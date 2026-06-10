import type { Application, Email } from "./core/users";
import type { AylaProfile, AylaToken } from "./types";

import { AYLA_APP_ID, AYLA_APP_SECRET } from "./config";

import { isHTTPError, TokenContext } from "./core/client";
import * as userClient from "./core/users";
import * as userMetadataClient from "./core/userMetaData";

export type { Email };

const application: Application = {
  app_id: AYLA_APP_ID,
  app_secret: AYLA_APP_SECRET,
};

export async function changePassword({
  email,
  passwordCurrent,
  passwordNew,
  ...context
}: {
  email: string;
  passwordCurrent: string;
  passwordNew: string;
} & TokenContext): Promise<AylaToken> {
  await userClient.changePassword(
    {
      user: { current_password: passwordCurrent, password: passwordNew },
    },
    context
  );
  return await signIn({ email, password: passwordNew });
}

export async function checkEmail({
  email,
}: {
  email: string;
}): Promise<boolean> {
  let taken: boolean | undefined;

  try {
    await userClient.signUp({
      user: {
        email,
        password: "",
        firstname: "",
        lastname: "",
        application,
      },
    });
  } catch (e) {
    if (isHTTPError(e)) {
      taken = e.response.rawBody.includes("has already been taken");
    }
  }

  return taken === false;
}

export async function confirmAccount({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}): Promise<AylaToken> {
  await userClient.confirmUserAccount({
    confirmation_token: token,
  });
  return await signIn({ email, password });
}

export async function loadKsid(
  context: TokenContext
): Promise<string | undefined> {
  return (await loadMetadata(context))["ksid"];
}

async function loadMetadata(
  context: TokenContext
): Promise<Record<string, string>> {
  const datums = await userMetadataClient.userData(context);

  return datums.reduce((metadata, { datum }) => {
    metadata[datum.key] = datum.value;
    return metadata;
  }, {} as Record<string, string>);
}

export async function profile(context: TokenContext): Promise<AylaProfile> {
  const profileData = await userClient.getUserProfile(context);

  return {
    email: profileData.email,
    firstName: profileData.firstname,
    id: profileData.uuid,
    lastName: profileData.lastname,
  };
}

export async function refreshToken({
  token,
}: {
  token: string;
}): Promise<AylaToken> {
  const response = await userClient.refreshTokens({
    user: { refresh_token: token },
  });

  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresIn: response.expires_in,
  };
}

export async function removeAccount(context: TokenContext): Promise<void> {
  await userClient.deleteLoginUser(context);
}

export async function resetPassword({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}): Promise<AylaToken> {
  await userClient.resetPassword({
    user: {
      reset_password_token: token,
      password: password,
      password_confirmation: password,
    },
  });
  return await signIn({ email, password });
}

export async function sendToken({
  email,
  ...templateParams
}: { email: string } & Partial<Email>): Promise<void> {
  const accountAvailable = await checkEmail({ email });

  if (accountAvailable)
    throw new Error("There is no account for that email address");

  try {
    await userClient.resendPasswordResetInstruction({
      user: { email, application },
      ...templateParams,
    });
  } catch (e) {
    if (isHTTPError(e) && e.response.rawBody.includes("confirm your account")) {
      await userClient.resendUserConfirmation({
        user: { email, application },
        ...templateParams,
      });
    } else {
      throw e;
    }
  }
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AylaToken> {
  const response = await userClient.signIn({
    user: {
      email,
      password,
      application,
    },
  });

  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresIn: response.expires_in,
  };
}

export async function signUp({
  email,
  password,
  firstName: firstname,
  lastName: lastname,
  ...templateParams
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
} & Partial<Email>): Promise<void> {
  await userClient.signUp({
    user: {
      email,
      password,
      firstname,
      lastname,
      application,
    },
    ...templateParams,
  });
}

export async function storeKsid({
  ksid: value,
  ...context
}: {
  ksid: string;
} & TokenContext): Promise<void> {
  await upsertMetadata({ key: "ksid", value, ...context });
}

async function upsertMetadata({
  key,
  value,
  ...context
}: {
  key: string;
  value: string;
} & TokenContext): Promise<void> {
  try {
    await userMetadataClient.updateSpecificDatum(
      key,
      { datum: { value } },
      context
    );
  } catch (e) {
    if (isHTTPError(e) && e.response.statusCode === 404) {
      await userMetadataClient.createNewDatum(
        { datum: { key, value } },
        context
      );
    }
  }
}
