import buildClient, { TokenContext } from "./client";
import { AYLA_USER_SERVICE_URL } from "./config";

// APIs specific to the user account
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json

const client = buildClient({
  prefixUrl: AYLA_USER_SERVICE_URL,
});

export interface Application {
  app_id: string;
  app_secret: string;
}

export interface Email {
  email_body_html: string;
  email_subject: string;
  email_template_id: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

type UserRequest<R> = {
  user: R;
};

type UserAuthRequest<R> = UserRequest<R & { application: Application }>;

// Create Account (Sign Up)
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/createUser

export type SignUpRequest = UserAuthRequest<
  {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    country?: string;
    city?: string;
    street?: string;
    zip?: string;
    phone_country_code?: string;
  } & Partial<Email>
>;

export const signUp = async (json: SignUpRequest): Promise<void> => {
  await client.post("users", { json });
};

// Sign In
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/sign_in

export type SignInRequest = UserAuthRequest<{
  email: string;
  password: string;
}>;

export type SignInResponse = Token;

export const signIn = async (json: SignInRequest): Promise<SignInResponse> => {
  const response = await client
    .post("users/sign_in", {
      json,
    })
    .json<SignInResponse>();

  return response;
};

// Refresh Tokens
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/refresh_token

export type RefreshTokensRequest = UserRequest<{ refresh_token: string }>;

export type RefreshTokensResponse = Token;

export const refreshTokens = async (
  json: RefreshTokensRequest
): Promise<RefreshTokensResponse> => {
  const response = await client
    .post("users/refresh_token", { json })
    .json<RefreshTokensResponse>();

  return response;
};

// Resend User Confirmation
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/resendConfirmEmail

export type ResendUserConfirmationRequest = UserAuthRequest<
  {
    email: string;
  } & Partial<Email>
>;

export const resendUserConfirmation = async (
  json: ResendUserConfirmationRequest
): Promise<void> => {
  await client.post("users/confirmation", { json });
};

// Confirm User Account
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/ConfirmEmail

export type ConfirmUserAccountParams = Record<"confirmation_token", string>;

export const confirmUserAccount = async (
  searchParams: ConfirmUserAccountParams
): Promise<void> => {
  await client.put("users/confirmation", { searchParams });
};

// Resend Password Reset Instruction
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/resetPassword

export type ResendPasswordResetInstructionRequest = UserAuthRequest<
  { email: string } & Partial<Email>
>;

export const resendPasswordResetInstruction = async (
  json: ResendPasswordResetInstructionRequest
): Promise<void> => {
  await client.post("users/password", { json });
};

// Reset Password
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/resetPasswordWithToken

export type ResetPasswordRequest = UserRequest<{
  reset_password_token: string;
  password: string;
  password_confirmation: string;
}>;

export const resetPassword = async (
  json: ResetPasswordRequest
): Promise<void> => {
  await client.put("users/password", { json });
};

// Change Password
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/editPassword

export type ChangePasswordRequest = UserRequest<{
  current_password: string;
  password: string;
}>;

export const changePassword = async (
  json: ChangePasswordRequest,
  context: TokenContext
): Promise<void> => {
  await client.put("users", { json, context });
};

// Get User Profile
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/getUserProfile

export interface GetUserProfileResponse {
  approved: boolean;
  confirmed: boolean;
  city?: string;
  company?: string;
  confirmed_at?: string;
  country?: string;
  created_at?: string;
  email: string;
  firstname: string;
  lastname: string;
  phone_country_code?: string;
  phone?: string;
  state?: string;
  street?: string;
  updated_at?: string;
  uuid: string;
  zip?: string;
}

export const getUserProfile = async (
  context: TokenContext
): Promise<GetUserProfileResponse> => {
  const response = await client
    .get("users/get_user_profile", {
      context,
    })
    .json<GetUserProfileResponse>();

  return response;
};

// Delete Login User
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/Users.json/deleteCurrentLoginUser

export const deleteLoginUser = async (context: TokenContext): Promise<void> => {
  await client.delete("users", { context });
};
