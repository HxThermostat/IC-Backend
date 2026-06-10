export interface AylaProfile {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}

export interface AylaToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
