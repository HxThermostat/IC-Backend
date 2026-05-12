export const TOKEN_LENGTH = 8;

const validTokenPattern = new RegExp(`^[0-9a-zA-Z]{${TOKEN_LENGTH}}$`);

export const isValidToken = (token: string): boolean =>
  validTokenPattern.test(token);
